//// TODOs
// Favicon
// Refactor and clean code
//      - Break up long functions
//      - create a main.js for all the major actions, keep simple and short
//      - Move variable declarations to separate js file
//      - Write unit tests for all functions
//      - Remove unused variables and code
// Improve UI aesthetics/format/style
//      - Cross-browser aesthetics (mostly/basically done)
// Enhancements
// Testing
//      - Use significantly larger csv, tsv, json, and plain text files
//      - Include data containing html and chars that need escaping
//      - Test on some malformed/invalid csv, tsv, json files

const resultsNumberTimeout = 100;

function prepareColumns(columnNames) {
    const selectedColumns = Array();  // Array of trues and falses
    inputs = document.getElementById("columns-to-show")
                     .getElementsByTagName("input");
    Array.from(inputs).forEach((input) => selectedColumns.push(input.checked));
    const columnsToDisplay = columnNames.filter((d, i) => {
        if (selectedColumns[i]) { return d; }
    });
    selectedColumns.unshift(true);
    // Add result index column with text-align control
    columnsToDisplay.unshift(`
        <svg id="text-align-control" class="align-left" height="13", width="15">
            <path d="M0,3 L8,3 M0,6 L13,6 M0,9 L8,9 M0,12 L13,12"/>
        </svg>
    `); 
    return [selectedColumns, columnsToDisplay];
}

function insertColumnHeaders(columnsToDisplay) {
    resultsTable.innerHTML = "";
    resultsTableD3.append("tr")
        .attr("id", "sticky")
        .selectAll("th")
        .data(columnsToDisplay).enter()
        .append("th")
        .attr("class", (d, i) => {
            return (i == 0) ? "result-index" : "sortable";
        })
        .html((d, i) => { 
            // Add resize and sorter controller divs in header row
            if (i == 0) {
                return d;
            } else if (i == 1) {
                if (i == columnsToDisplay.length - 1) {
                    return `<pre>${d}</pre>
                            <div class="sort" id="i${i}">&equiv;</div>`; 
                } else {
                    return `<pre>${d}</pre>
                            <div class="sort" id="i${i}">&equiv;</div>
                            <div class="resize-right"></div>`; 
                }
            } else {
                if (i !== columnsToDisplay.length - 1) {
                    return `<div class="resize-left"></div>
                            <pre>${d}</pre>
                            <div class="sort" id="i${i}">&equiv;</div>
                            <div class="resize-right"></div>`; 
                } else {
                    return `<div class="resize-left"></div>
                            <pre>${d}</pre>
                            <div class="sort" id="i${i}">&equiv;</div>`;
                }
            }
        });
}

function setMatchedData(matchedRows, selectedColumns) {
    let matchedData = Array();
    matchedRows.forEach((rowIndex, resultIndex) => {
            let row = JSON.parse(JSON.stringify(newData[rowIndex]));
            row.unshift(String(resultIndex + 1));
            row = row.filter((d, j) => selectedColumns[j]);
            matchedData.push(row);
        });
    return matchedData;
}

function determineRowsToShow(totalRows) {
    let showStart = showingStart.value - 1;
    let showEnd = showStart + Math.min(showRows.value, totalRows);
    showEnd = showEnd > totalRows ? totalRows : showEnd;
    showingStart.value = showStart + 1;
    showingEnd.textContent = `${showEnd}`;
    return [showStart, showEnd]; 
}

function sortRows(columnToSort, order) {
    rows = document.querySelectorAll('tr.sortable-row');
    newRows = Array();
    Array.from(rows).forEach((row) => {
        newRow = Array.from(row.children);
        newRows.push(newRow);
    });
    newRows = newRows.sort((a, b) => {
        let aString = a[columnToSort].__data__;
        let bString = b[columnToSort].__data__;
        if (order == "ascending") {
            return aString.localeCompare(bString);
        } else if (order == "descending") {
            return bString.localeCompare(aString);
        }
    });
    newRows = newRows.map((row, i) => {
        return row.map((item, j) => (j == 0) ? String(i + 1) : item.__data__);
    });
    d3.selectAll('tr.sortable-row')
        .data(newRows)
        .selectAll('td')
            .data((d) => d)
            .html((d) => `<pre>${d}</pre>`);
    enforceHilites();
}

function addResizerListeners() {
    document.querySelectorAll("div.resize-right").forEach((div) => {
        makeResizable(div, adjacentIsRight=true);
    });
    document.querySelectorAll("div.resize-left").forEach((div) => {
        makeResizable(div, adjacentIsRight=false);
    });
}

function addSorterListeners() {
    sorters = document.querySelectorAll(".sort");
    sorters.forEach((sorter) => {
        sorter.addEventListener('mouseover', 
            () => sorter.style.color = "coral");
        sorter.addEventListener('mouseout', 
            () => sorter.style.color = "steelblue");
        sorter.addEventListener('click', (e) => {
            text = sorter.innerHTML;
            if (text == "\u2261" || text == "\u25B2") { 
                sorters.forEach((sorter) => sorter.innerHTML = "&equiv;");
                sorter.innerHTML = "&#x25BC;"; 
                sortRows(sorter.id.slice(1), "ascending");
            } else if (text == "\u25BC") { 
                sorter.innerHTML = "&#x25B2;"; 
                sortRows(sorter.id.slice(1), "descending");
            }
        });
    });
}

function addTextAlignerListeners() {
    textAligner = document.getElementById("text-align-control");
    if (textAligner) {
        textAligner.addEventListener("mouseover", 
            () => textAligner.style.stroke = "yellow" );
        textAligner.addEventListener("mouseout", 
            () => textAligner.style.stroke = "#2a3347" );
        textAligner.addEventListener("click", () => {
            if (textAligner.classList.contains("align-left")) {
                textAligner.innerHTML = `
                    <path d="M3,3 L10,3 M0,6 L13,6 M3,9 L10,9 M0,12 L13,12"/>`;
                textAligner.classList.replace("align-left", "align-center");
                d3.selectAll("td.results-td").style("text-align", "center");
            } else if (textAligner.classList.contains("align-center")) {
                textAligner.innerHTML = `
                    <path d="M5,3 L13,3 M1,6 L13,6 M5,9 L13,9 M1,12 L13,12"/>`;
                textAligner.classList.replace("align-center", "align-right");
                d3.selectAll("td.results-td").style("text-align", "right");
            } else if (textAligner.classList.contains("align-right")) {
                textAligner.innerHTML = `
                    <path d="M0,3 L8,3 M0,6 L12,6 M0,9 L8,9 M0,12 L12,12"/>`;
                textAligner.classList.replace("align-right", "align-left");
                d3.selectAll("td.results-td").style("text-align", "left");
            }
        });
    }
}

function insertResults(rows) {
    resultsTableD3.selectAll("tr.sortable-row").remove();
    rows.forEach((row) => {
        resultsTableD3.append("tr")
            .attr("class", "sortable-row")
            .selectAll("td").data(row).enter()
                .append("td")
                .attr("class", (d, i) => (i !== 0) ? "results-td" : "result-index")
                .html((d) => `<pre>${d}</pre>`);
    }); 
    addResizerListeners();
    addSorterListeners();
    addTextAlignerListeners();
    enforceLightDarkMode();
    enforceHilites();
}


function concord() {
    newData = JSON.parse(JSON.stringify(data));

    let columnNames = columnHeaders.checked ? data[0] : data[0].map(
        (d, i) => { return `Column ${i + 1}`; });
    let startingRowIndex = columnHeaders.checked ? 1 : 0;    
    let columnObject = {};  // {column name: index}
    for (let i = 0; i < columnNames.length; i++) {
        columnObject[columnNames[i]] = i;
    }
    let matchedRows1 = Array();  // the rows where there is a match
    let searchColumnIndex1 = columnObject[columnSelection1.value];
    let matchedRows2 = Array();
    let searchColumnIndex2 = columnObject[columnSelection2.value];
    let matchedRows3 = Array();
    let searchColumnIndex3 = columnObject[columnSelection3.value];

    // PROCESS SEARCH INPUT 1
    if (filterControl1.checked) {
        if (typeof(filterSelection1.value == "string")) {
            for (let i = startingRowIndex; i < data.length; i++) {
                let str = data[i][searchColumnIndex1];
                if (str == filterSelection1.value) { matchedRows1.push(i); }
            }
        }
    } else {
        if (searchInput1.value !== "") {
            console.log("YAY");  
            let re1;
            let pattern1;
            let flags1 = "";
            let tagOpen1 = "<text class='hilite1'>";
            let tagClose1 = "</text>";

            // Construct regex
            if (!caseSensitive1.checked) { flags1 = `${flags1}i`; }
            if (findall1.checked) {
                flags1 = `${flags1}g`;
                if (regexSelection1.checked) {
                    pattern1 = searchInput1.value;
                } else {
                    pattern1 = escapeRegExp(searchInput1.value);
                    if (fullWords1.checked) {
                        pattern1 = fullwordBoundaries(pattern1, 
                                                      searchInput1.value);
                    }
                }
            } else {
                if (regexSelection1.checked) {
                    pattern1 = `^(.*?)(${searchInput1.value})(.*)$`;
                } else {
                    pattern1 = escapeRegExp(searchInput1.value);
                    if (fullWords1.checked) {
                        pattern1 = fullwordBoundaries(pattern1, 
                                                      searchInput1.value);
                    }
                    if (matchWhere1.value == "match-entire-1") {
                        pattern1 = `^(${pattern1})$`;
                    } else if (matchWhere1.value == "match-beginning-1") {
                        pattern1 = `^(${pattern1})(.*)$`;
                    } else if (matchWhere1.value == "match-end-1") {
                        pattern1 = `^(.*?)(${pattern1})$`;
                    } else {
                        pattern1 = `^(.*?)(${pattern1})(.*)$`;
                    }
                }
            }
            re1 = (flags1 == "") ? RegExp(pattern1) : RegExp(pattern1, flags1);
            
            // Record matched rows and create array of color-coded strings
            for (let i = startingRowIndex; i < data.length; i++) {
                let str = data[i][searchColumnIndex1];
                if (str.match(re1)) {
                    matchedRows1.push(i);
                    let htmlSafeString1;
                    if (regexSelection1.checked || 
                        matchWhere1.value == "match-anywhere-1") 
                    {
                        if (findall1.checked) {
                            htmlSafeString1 = iterHtmlSafeReplace(
                                str, re1, tagOpen1, tagClose1);
                        } else {
                            htmlSafeString1 = str.replace(
                                re1, (_, g1, g2, g3) =>
                            {
                                return `${escapeHTML(g1)}${tagOpen1}` + 
                                       `${escapeHTML(g2)}${tagClose1}` + 
                                       `${escapeHTML(g3)}`;
                            });
                        }
                    } else if (matchWhere1.value == "match-entire-1") {
                        htmlSafeString1 = str.replace(re1, (_, g1) => {
                            return `${tagOpen1}${escapeHTML(g1)}${tagClose1}`;
                        });
                    } else if (matchWhere1.value == "match-beginning-1") {
                        htmlSafeString1 = str.replace(re1, (_, g1, g2) => {
                            return `${tagOpen1}${escapeHTML(g1)}${tagClose1}` +
                                   `${escapeHTML(g2)}`;
                        });
                    } else if (matchWhere1.value == "match-end-1") {
                        htmlSafeString1 = str.replace(re1, (_, g1, g2) => {
                            return `${escapeHTML(g1)}${tagOpen1}` + 
                                   `${escapeHTML(g2)}${tagClose1}`;
                        });
                    }
                    newData[i][searchColumnIndex1] = htmlSafeString1;
                } 
            }
        }
    }
    
    // PROCESS SEARCH INPUT 2
    if (filterControl2.checked) {
        if (typeof(filterSelection2.value) == "string") {
            for (let i = startingRowIndex; i < data.length; i++) {
                let str = data[i][searchColumnIndex2];
                if (str === filterSelection2.value) { matchedRows2.push(i); }
            }
        }
    } else {
        if (searchInput2.value !== "") {
            console.log("YAY-YAY");
            let re2;
            let pattern2;
            let flags2 = "";
            let tagOpen2 = "<text class='hilite2'>";
            let tagClose2 = "</text>";

            // Construct regex
            if (!caseSensitive2.checked) { flags2 = `${flags2}i`; }
            if (findall2.checked) { 
                flags2 = `${flags2}g`;
                if (regexSelection2.checked) {
                    pattern2 = searchInput2.value;
                } else {
                    pattern2 = escapeRegExp(searchInput2.value);
                    if (fullWords2.checked) {
                        pattern2 = fullwordBoundaries(pattern2, 
                                                      searchInput2.value);
                    }
                }
            } else {
                if (regexSelection2.checked) {
                    pattern2 = `^(.*?)(${searchInput2.value})(.*)$`; 
                } else {
                    pattern2 = escapeRegExp(searchInput2.value);
                    if (fullWords2.checked) {
                        pattern2 = fullwordBoundaries(pattern2, 
                                                      searchInput2.value);
                    }
                    if (matchWhere2.value == "match-entire-2") {
                        pattern2 = `^(${pattern2})$`;
                    } else if (matchWhere2.value == "match-beginning-2") {
                        pattern2 = `^(${pattern2})(.*)$`;
                    } else if (matchWhere2.value == "match-end-2") {
                        pattern2 = `^(.*?)(${pattern2})$`;
                    } else {
                        pattern2 = `^(.*?)(${pattern2})(.*)$`;
                    }
                }
            }
            re2 = (flags2 == "") ? RegExp(pattern2) : RegExp(pattern2, flags2);

            // Record matched rows and create array of color-coded strings
            for (let i = startingRowIndex; i < data.length; i++) {
                let str = data[i][searchColumnIndex2];
                if (str.match(re2)) {
                    matchedRows2.push(i);
                    let htmlSafeString2;
                    if (regexSelection2.checked || 
                        matchWhere2.value == "match-anywhere-2") 
                    {
                        if (findall2.checked) {
                            htmlSafeString2 = iterHtmlSafeReplace(
                                str, re2, tagOpen2, tagClose2);
                        } else {
                            htmlSafeString2 = str.replace(
                                re2, (_, g1, g2, g3) =>
                            {
                                return `${escapeHTML(g1)}${tagOpen2}` + 
                                       `${escapeHTML(g2)}${tagClose2}` + 
                                       `${escapeHTML(g3)}`;
                            });
                        }
                    } else if (matchWhere2.value == "match-entire-2") {
                        htmlSafeString2 = str.replace(re2, (_, g1) => {
                            return `${tagOpen2}${escapeHTML(g1)}${tagClose2}`;
                        });
                    } else if (matchWhere2.value == "match-beginning-2") {
                        htmlSafeString2 = str.replace(re2, (_, g1, g2) => {
                            return `${tagOpen2}${escapeHTML(g1)}${tagClose2}` +
                                   `${escapeHTML(g2)}`;
                        });
                    } else if (matchWhere2.value == "match-end-2") {
                        htmlSafeString2 = str.replace(re2, (_, g1, g2) => {
                            return `${escapeHTML(g1)}${tagOpen2}` + 
                                   `${escapeHTML(g2)}${tagClose2}`;
                        });
                    }
                    newData[i][searchColumnIndex2] = htmlSafeString2;
                } 
            }
        }
    }

    // PROCESS SEARCH INPUT 3
    if (filterControl3.checked) {
        if (typeof(filterSelection3.value) == "string") {
            for (let i = startingRowIndex; i < data.length; i++) {
                let str = data[i][searchColumnIndex3];
                if (str === filterSelection3.value) { matchedRows3.push(i); }
            }
        }
    } else {
        if (searchInput3.value !== "") {
            console.log("YAY-YAY-YAY");
            let re3;
            let pattern3;
            let flags3 = "";
            let tagOpen3 = "<text class='hilite3'>";
            let tagClose3 = "</text>";

            // Construct regex
            if (!caseSensitive3.checked) { flags3 = `${flags3}i`; }
            if (findall3.checked) { 
                flags3 = `${flags3}g`;
                if (regexSelection3.checked) {
                    pattern3 = searchInput3.value;
                } else {
                    pattern3 = escapeRegExp(searchInput3.value);
                    if (fullWords3.checked) {
                        pattern3 = fullwordBoundaries(pattern3, 
                                                      searchInput3.value);
                    }
                }
            } else {
                if (regexSelection3.checked) {
                    pattern3 = `^(.*?)(${searchInput3.value})(.*)$`; 
                } else {
                    pattern3 = escapeRegExp(searchInput3.value);
                    if (fullWords3.checked) {
                        pattern3 = fullwordBoundaries(pattern3, 
                                                      searchInput3.value);
                    }
                    if (matchWhere3.value == "match-entire-3") {
                        pattern3 = `^(${pattern3})$`;
                    } else if (matchWhere3.value == "match-beginning-3") {
                        pattern3 = `^(${pattern3})(.*)$`;
                    } else if (matchWhere3.value == "match-end-3") {
                        pattern3 = `^(.*?)(${pattern3})$`;
                    } else {
                        pattern3 = `^(.*?)(${pattern3})(.*)$`;
                    }
                }
            }
            re3 = (flags3 == "") ? RegExp(pattern3) : RegExp(pattern3, flags3);

            // Record matched rows and create array of color-coded strings
            for (let i = startingRowIndex; i < data.length; i++) {
                let str = data[i][searchColumnIndex3];
                if (str.match(re3)) {
                    matchedRows3.push(i);
                    let htmlSafeString3;
                    if (regexSelection3.checked || 
                        matchWhere3.value == "match-anywhere-3") 
                    {
                        if (findall3.checked) {
                            htmlSafeString3 = iterHtmlSafeReplace(
                                str, re3, tagOpen3, tagClose3);
                        } else {
                            htmlSafeString3 = str.replace(
                                re3, (_, g1, g2, g3) =>
                            {
                                return `${escapeHTML(g1)}${tagOpen3}` +
                                       `${escapeHTML(g2)}${tagClose3}` + 
                                       `${escapeHTML(g3)}`;
                            });
                        }
                    } else if (matchWhere3.value == "match-entire-3") {
                        htmlSafeString3 = str.replace(re3, (_, g1) => {
                            return `${tagOpen3}${escapeHTML(g1)}${tagClose3}`;
                        });
                    } else if (matchWhere3.value == "match-beginning-3") {
                        htmlSafeString3 = str.replace(re3, (_, g1, g2) => {
                            return `${tagOpen3}${escapeHTML(g1)}${tagClose3}` + 
                                   `${escapeHTML(g2)}`;
                        });
                    } else if (matchWhere3.value == "match-end-3") {
                        htmlSafeString3 = str.replace(re3, (_, g1, g2) => {
                            return `${escapeHTML(g1)}` + 
                                   `${tagOpen3}${escapeHTML(g2)}${tagClose3}`;
                        });
                    }
                    newData[i][searchColumnIndex3] = htmlSafeString3;
                } 
            }
        }
    }
    
    //// Display results
    
    // Matched rows logic
    let inputValid1 = (
        (!filterControl1.checked && searchInput1.value !== "") ||
        (filterControl1.checked && typeof(filterSelection1.value) == "string")
    );
    let inputValid2 = (
        (!filterControl2.checked && searchInput2.value !== "") ||
        (filterControl2.checked && typeof(filterSelection2.value) == "string")
    );
    let inputValid3 = (
        (!filterControl3.checked && searchInput3.value !== "") ||
        (filterControl3.checked && typeof(filterSelection3.value) == "string")
    );
    if (inputValid1) { matchedRows = matchedRows1; }
    if (inputValid2) {
        matchedRows = inputValid1 ? 
            matchedRows.filter((x) => matchedRows2.includes(x)) : matchedRows2;
    }
    if (inputValid3) {
        matchedRows = (inputValid1 || inputValid2) ?
            matchedRows.filter((x) => matchedRows3.includes(x)) : matchedRows3;
    }

    // Pad strings to be displayed
    if (matchedRows.length > 0) {
        if (!filterControl1.checked && concordanceDisplay1.checked && 
            searchInput1.value !== "") 
        {
            let concordStrings1 = matchedRows.map((index) => {
                return newData[index][searchColumnIndex1];
            });
            concordStrings1 = padConcordance(
                concordStrings1, 'one', concordanceCutoff1.value);
            matchedRows.forEach((index) => {
                newData[index][searchColumnIndex1] = concordStrings1.shift();
            });
        }
        if (!filterControl2.checked && concordanceDisplay2.checked && 
            searchInput2.value !== "") 
        {
            let concordStrings2 = matchedRows.map((index) => {
                return newData[index][searchColumnIndex2];
            });
            concordStrings2 = padConcordance(
                concordStrings2, 'two', concordanceCutoff2.value);
            matchedRows.forEach((index) => {
                newData[index][searchColumnIndex2] = concordStrings2.shift();
            });
        }
        if (!filterControl3.checked && concordanceDisplay3.checked && 
            searchInput3.value !== "") 
        {
            let concordStrings3 = matchedRows.map((index) => {
                return newData[index][searchColumnIndex3];
            });
            concordStrings3 = padConcordance(
                concordStrings3, 'three', concordanceCutoff3.value);
            matchedRows.forEach((index) => {
                newData[index][searchColumnIndex3] = concordStrings3.shift();
            });
        }
    }
    
    // Show number of matched results
    if (matchedRows.length > 0) {
        showTotalResults(matchedRows.length);
        const [selectedColumns, columnsToDisplay] = prepareColumns(columnNames);
        insertColumnHeaders(columnsToDisplay);
        matchedData = setMatchedData(matchedRows, selectedColumns);
        const [showStart, showEnd] = determineRowsToShow(matchedData.length);
        insertResults(matchedData.slice(showStart, showEnd));
    } else {
        showNoResults();
    }

    console.log("FINAL columnSelection1.value", columnSelection1.value);
    console.log("FINAL columnSelection2.value", columnSelection2.value);
    console.log("FINAL columnSelection3.value", columnSelection3.value);
}

function showTotalResults(numberOfResults) {
    resultsNumber.textContent = "";
    setTimeout(() => { resultsNumber.textContent = `${numberOfResults}`; }, 
               resultsNumberTimeout);
}

function showNoResults() {
    resultsTable.innerHTML = "";
    let resultText = "None for ";
    if (searchInput1.value !== "" || filterSelection1.value) {
        let value1 = (searchInput1.value !== "") ? 
            searchInput1.value : filterSelection1.value;
        resultText = resultText + `"${value1}"`;
        if (searchInput2.value !== "" || filterSelection2.value ||
            searchInput3.value !== "" || filterSelection3.value) 
        {
            resultText = resultText + " and ";
        }
    }
    if (searchInput2.value !== "" || filterSelection2.value) {
        let value2 = (searchInput2.value !== "") ? 
            searchInput2.value : filterSelection2.value;
        resultText = resultText + `"${value2}"`;
        if (searchInput3.value !== "" || filterSelection3.value) {
            resultText = resultText + " and ";
        }
    }
    if (searchInput3.value !== "" || filterSelection3.value) {
        let value3 = (searchInput3.value !== "") ? 
            searchInput3.value : filterSelection3.value;
        resultText = resultText + `"${value3}"`;
    }
    resultsNumber.textContent = "";
    setTimeout(() => { resultsNumber.textContent = resultText; }, 
                resultsNumberTimeout);
}

searchBox.addEventListener('submit', concord);