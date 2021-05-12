//// TODOs
// - Refactor and clean code
//      - Append "1" to the plain names
//      - Move variable declarations to separate js file
//      - Write unit tests for all functions
// - Improve UI aesthetics/format/style
//      - Create own custom buttons
//      - Cross-browser aesthetics
//      - Move the hiders to banner to shorten height
//      - make mobile-friendly
// - (minor) Maybe allow users to paste in data
// - ? Export results feature
// - Accept JSON and XML files
// - Bugs
//      - sorting doesn't work on Chrome

const searchBox = document.getElementById("search-box");
const resultsNumberTimeout = 120;

const concord = function () {
    var newData = JSON.parse(JSON.stringify(data));
    var columnHeaders = document.getElementById("column-headers").checked;
    var resultsNumber = d3.select("#results-number");

    var columnToSearchValue1 = document.getElementById("column-selection").value;
    var searchInputValue1 = document.getElementById("search-input").value;
    var regexChecked1 = document.getElementById("regex").checked;
    var fullWordsChecked1 = document.getElementById("full-words").checked;
    var caseSensitiveChecked1 = document.getElementById("case-sensitive").checked;
    var matchWhereValue1 = document.getElementById("match-where").value;
    var findallChecked1 = document.getElementById("findall").checked;
    var concordDisplayChecked1 = document.getElementById("concordance-display").checked;
    var concordCutoffValue1 = document.getElementById("concordance-cutoff").value;

    var columnToSearchValue2 = document.getElementById("column-selection2").value;
    var searchInputValue2 = document.getElementById("search-input2").value;
    var regexChecked2 = document.getElementById("regex2").checked;
    var fullWordsChecked2 = document.getElementById("full-words2").checked;
    var caseSensitiveChecked2 = document.getElementById("case-sensitive2").checked;
    var matchWhereValue2 = document.getElementById("match-where2").value;
    var findallChecked2 = document.getElementById("findall2").checked;
    var concordDisplayChecked2 = document.getElementById("concordance-display2").checked;
    var concordCutoffValue2 = document.getElementById("concordance-cutoff2").value;

    var columnToSearchValue3 = document.getElementById("column-selection3").value;
    var searchInputValue3 = document.getElementById("search-input3").value;
    var regexChecked3 = document.getElementById("regex3").checked;
    var fullWordsChecked3 = document.getElementById("full-words3").checked;
    var caseSensitiveChecked3 = document.getElementById("case-sensitive3").checked;
    var matchWhereValue3 = document.getElementById("match-where3").value;
    var findallChecked3 = document.getElementById("findall3").checked;
    var concordDisplayChecked3 = document.getElementById("concordance-display3").checked;
    var concordCutoffValue3 = document.getElementById("concordance-cutoff3").value;

    var columnsToSearchValues = [columnToSearchValue1, columnToSearchValue2];

    // THIS CAN BE MOVED TO A GLOBALS FILE
    var columnNames = columnHeaders ? data[0] : data[0].map((d, i) => { return `Column ${i + 1}`; });
    var startingRowIndex = columnHeaders ? 1 : 0;    
    var columnObject = {}; // {column name: index}
    for (let i = 0; i < columnNames.length; i++) {
        columnObject[columnNames[i]] = i;
    }
    var matchedRows1 = Array();  // the rows where there is a match
    var searchColumnIndex1 = columnObject[columnToSearchValue1];  // index of the searched column
    var matchedRows2 = Array();
    var searchColumnIndex2 = columnObject[columnToSearchValue2];  // index of the searched column
    var matchedRows3 = Array();
    var searchColumnIndex3 = columnObject[columnToSearchValue3];  // index of the searched column

    // PROCESS SEARCH INPUT 1
    if (searchInputValue1 !== "") {
        console.log("YAY");  
        var re1;
        var pattern1;
        var flags1 = "";
        var tagOpen1 = "<text class='hilite1'>";
        var tagClose1 = "</text>";

        // Construct regex
        if (!caseSensitiveChecked1) { flags1 = `${flags1}i`; }
        if (findallChecked1) {
            flags1 = `${flags1}g`;
            if (regexChecked1) {
                pattern1 = searchInputValue1;
            } else {
                pattern1 = RegExp.escape(searchInputValue1);
                if (fullWordsChecked1) {
                    pattern1 = fullwordBoundaries(pattern1, searchInputValue1);
                }
            }
        } else {
            if (regexChecked1) {
                pattern1 = `^(.*?)(${searchInputValue1})(.*)$`;
            } else {
                pattern1 = RegExp.escape(searchInputValue1);
                if (fullWordsChecked1) {
                    pattern1 = fullwordBoundaries(pattern1, searchInputValue1);
                }
                if (matchWhereValue1 == "match-entire") {
                    pattern1 = `^(${pattern1})$`;
                } else if (matchWhereValue1 == "match-beginning") {
                    pattern1 = `^(${pattern1})(.*)$`;
                } else if (matchWhereValue1 == "match-end") {
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
                var htmlSafeString1;
                if (regexChecked1 || matchWhereValue1 == "match-anywhere") {
                    if (findallChecked1) {
                        htmlSafeString1 = iterHtmlSafeReplace(str, re1, tagOpen1, tagClose1);
                    } else {
                        htmlSafeString1 = str.replace(re1, function(_, g1, g2, g3) {
                            return `${escapeHTML(g1)}${tagOpen1}${escapeHTML(g2)}${tagClose1}${escapeHTML(g3)}`;
                        });
                    }
                } else if (matchWhereValue1 == "match-entire") {
                    htmlSafeString1 = str.replace(re1, function(_, g1) {
                        return `${tagOpen1}${escapeHTML(g1)}${tagClose1}`;
                    });
                } else if (matchWhereValue1 == "match-beginning") {
                    htmlSafeString1 = str.replace(re1, function(_, g1, g2) {
                        return `${tagOpen1}${escapeHTML(g1)}${tagClose1}${escapeHTML(g2)}`;
                    });
                } else if (matchWhereValue1 == "match-end") {
                    htmlSafeString1 = str.replace(re1, function(_, g1, g2) {
                        return `${escapeHTML(g1)}${tagOpen1}${escapeHTML(g2)}${tagClose1}`;
                    });
                }
                newData[i][searchColumnIndex1] = htmlSafeString1;
            } 
        }
    }


    // PROCESS SEARCH INPUT 2
    if (searchInputValue2 !== "") {
        console.log("YAY-YAY");
        var re2;
        var pattern2;
        var flags2 = "";
        var tagOpen2 = "<text class='hilite2'>";
        var tagClose2 = "</text>";

        // Construct regex
        if (!caseSensitiveChecked2) { flags2 = `${flags2}i`; }
        if (findallChecked2) { 
            flags2 = `${flags2}g`;
            if (regexChecked2) {
                pattern2 = searchInputValue2;
            } else {
                pattern2 = RegExp.escape(searchInputValue2);
                if (fullWordsChecked2) {
                    pattern2 = fullwordBoundaries(pattern2, searchInputValue2);
                }
            }
        } else {
            if (regexChecked2) {
                pattern2 = `^(.*?)(${searchInputValue2})(.*)$`; 
            } else {
                pattern2 = RegExp.escape(searchInputValue2);
                if (fullWordsChecked2) {
                    pattern2 = fullwordBoundaries(pattern2, searchInputValue2);
                }
                if (matchWhereValue2 == "match-entire2") {
                    pattern2 = `^(${pattern2})$`;
                } else if (matchWhereValue2 == "match-beginning2") {
                    pattern2 = `^(${pattern2})(.*)$`;
                } else if (matchWhereValue2 == "match-end2") {
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
                var htmlSafeString2;
                if (regexChecked2 || matchWhereValue2 == "match-anywhere2") {
                    if (findallChecked2) {
                        htmlSafeString2 = iterHtmlSafeReplace(str, re2, tagOpen2, tagClose2);
                    } else {
                        htmlSafeString2 = str.replace(re2, function(_, g1, g2, g3) {
                            return `${escapeHTML(g1)}${tagOpen2}${escapeHTML(g2)}${tagClose2}${escapeHTML(g3)}`;
                        });
                    }
                } else if (matchWhereValue2 == "match-entire2") {
                    htmlSafeString2 = str.replace(re2, function(_, g1) {
                        return `${tagOpen2}${escapeHTML(g1)}${tagClose2}`;
                    });
                } else if (matchWhereValue2 == "match-beginning2") {
                    htmlSafeString2 = str.replace(re2, function(_, g1, g2) {
                        return `${tagOpen2}${escapeHTML(g1)}${tagClose2}${escapeHTML(g2)}`;
                    });
                } else if (matchWhereValue2 == "match-end2") {
                    htmlSafeString2 = str.replace(re2, function(_, g1, g2) {
                        return `${escapeHTML(g1)}${tagOpen2}${escapeHTML(g2)}${tagClose2}`;
                    });
                }
                newData[i][searchColumnIndex2] = htmlSafeString2;
            } 
        }
    }


    // PROCESS SEARCH INPUT 3
    if (searchInputValue3 !== "") {
        console.log("YAY-YAY-YAY");
        var re3;
        var pattern3;
        var flags3 = "";
        var tagOpen3 = "<text class='hilite3'>";
        var tagClose3 = "</text>";

        // Construct regex
        if (!caseSensitiveChecked3) { flags3 = `${flags3}i`; }
        if (findallChecked3) { 
            flags3 = `${flags3}g`;
            if (regexChecked3) {
                pattern3 = searchInputValue3;
            } else {
                pattern3 = RegExp.escape(searchInputValue3);
                if (fullWordsChecked3) {
                    pattern3 = fullwordBoundaries(pattern3, searchInputValue3);
                }
            }
        } else {
            if (regexChecked3) {
                pattern3 = `^(.*?)(${searchInputValue3})(.*)$`; 
            } else {
                pattern3 = RegExp.escape(searchInputValue3);
                if (fullWordsChecked3) {
                    pattern3 = fullwordBoundaries(pattern3, searchInputValue3);
                }
                if (matchWhereValue3 == "match-entire3") {
                    pattern3 = `^(${pattern3})$`;
                } else if (matchWhereValue3 == "match-beginning3") {
                    pattern3 = `^(${pattern3})(.*)$`;
                } else if (matchWhereValue3 == "match-end3") {
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
                var htmlSafeString3;
                if (regexChecked3 || matchWhereValue3 == "match-anywhere3") {
                    if (findallChecked3) {
                        htmlSafeString3 = iterHtmlSafeReplace(str, re3, tagOpen3, tagClose3);
                    } else {
                        htmlSafeString3 = str.replace(re3, function(_, g1, g2, g3) {
                            return `${escapeHTML(g1)}${tagOpen3}${escapeHTML(g2)}${tagClose3}${escapeHTML(g3)}`;
                        });
                    }
                } else if (matchWhereValue3 == "match-entire3") {
                    htmlSafeString3 = str.replace(re3, function(_, g1) {
                        return `${tagOpen3}${escapeHTML(g1)}${tagClose3}`;
                    });
                } else if (matchWhereValue3 == "match-beginning3") {
                    htmlSafeString3 = str.replace(re3, function(_, g1, g2) {
                        return `${tagOpen3}${escapeHTML(g1)}${tagClose3}${escapeHTML(g2)}`;
                    });
                } else if (matchWhereValue3 == "match-end3") {
                    htmlSafeString3 = str.replace(re3, function(_, g1, g2) {
                        return `${escapeHTML(g1)}${tagOpen3}${escapeHTML(g2)}${tagClose3}`;
                    });
                }
                newData[i][searchColumnIndex3] = htmlSafeString3;
            } 
        }
    }
    

    //// Display results
    
    // Get array of trues and falses on which columns to display
    var selectedColumns = Array();
    d3.select('#columns-to-show').selectAll('input').each(function (d, i) { 
        selectedColumns.push(this.checked);
    });
    
    // Matched rows logic
    var matchedRows;
    if (searchInputValue1 !== "") {
        matchedRows = matchedRows1;
    }
    if (searchInputValue2 !== "") {
        if (searchInputValue1 !== "") {
            matchedRows = matchedRows.filter(x => matchedRows2.includes(x));
        } else {
            matchedRows = matchedRows2;
        }
    }
    if (searchInputValue3 !== "") {
        if (searchInputValue1 !== "" || searchInputValue2 !== "") {
            matchedRows = matchedRows.filter(x => matchedRows3.includes(x));
        } else {
            matchedRows = matchedRows3;
        }
    }

    // Pad strings to be displayed
    if (matchedRows.length > 0) {
        if (concordDisplayChecked1 && searchInputValue1 !== "") {
            var concordStrings1 = matchedRows.map((index) => {
                return newData[index][searchColumnIndex1];
            });
            concordStrings1 = padConcordance(concordStrings1, 'one', concordCutoffValue1);
            matchedRows.forEach((index) => {
                newData[index][searchColumnIndex1] = concordStrings1.shift();
            });
        }
        if (concordDisplayChecked2 && searchInputValue2 !== "") {
            var concordStrings2 = matchedRows.map((index) => {
                return newData[index][searchColumnIndex2];
            });
            concordStrings2 = padConcordance(concordStrings2, 'two', concordCutoffValue2);
            matchedRows.forEach((index) => {
                newData[index][searchColumnIndex2] = concordStrings2.shift();
            });
        }
        if (concordDisplayChecked3 && searchInputValue3 !== "") {
            var concordStrings3 = matchedRows.map((index) => {
                return newData[index][searchColumnIndex3];
            });
            concordStrings3 = padConcordance(concordStrings3, 'three', concordCutoffValue3);
            matchedRows.forEach((index) => {
                newData[index][searchColumnIndex3] = concordStrings3.shift();
            });
        }
    }
    // ------ stopped adding 3's here
    
    // Insert text and html
    numberOfResults = matchedRows.length;
    if (numberOfResults > 0) {
        resultsNumber.text("");
        setTimeout(
            function() { resultsNumber.text(`Total results: ${numberOfResults}`); }, 
            resultsNumberTimeout
        );
    }
    const results = d3.select("#results-table");
    results.html(""); // clear results
    columnsToDisplay = columnNames.filter(function(d, i) {
        if (selectedColumns[i]) { return d; }
    });
    selectedColumns.unshift(true);
    // Add result index column with text-align control
    columnsToDisplay.unshift(`
        <svg id="text-align-control" class="align-left" height="13", width="15">
            <path d="M0,3 L8,3 M0,6 L13,6 M0,9 L8,9 M0,12 L13,12"/>
        </svg>
    `); 
    if (matchedRows.length > 0) {
        
        // Column headers
        results.append("tr")
        .attr("id", "sticky")
        .selectAll("th")
        .data(columnsToDisplay).enter()
        .append("th")
        .attr("class", function(d, i) {
            return (i == 0) ? "result-index" : "sortable";
        })
        .html(function(d, i) { 
            // Add resize controller divs in header row
            if (i == 0) {
                return d;
            } else if (i == 1) {
                if (i == columnsToDisplay.length - 1) {
                    return `<pre>${d}</pre><div class="sort" id="i${i}">&equiv;</div>`; 
                } else {
                    return `<pre>${d}</pre><div class="sort" id="i${i}">&equiv;</div><div class="resize-right"></div>`; 
                }
            } else {
                if (i !== columnsToDisplay.length - 1) {
                    return `<div class="resize-left"></div><pre>${d}</pre><div class="sort" id="i${i}">&equiv;</div><div class="resize-right"></div>`; 
                } else {
                    return `<div class="resize-left"></div><pre>${d}</pre><div class="sort" id="i${i}">`;
                }
            }
        });
        
        // console.log('columnsToDisplay | selectedColumns');
        // console.log(JSON.stringify(columnsToDisplay));
        // console.log(JSON.stringify(selectedColumns));

        // Results
        matchedRows.forEach((index, resultIndex) => {
            results.append("tr").attr("class", "sortable-row")
                .selectAll("td")
                .data(function() {
                    // Add result index
                    let row = JSON.parse(JSON.stringify(newData[index]));
                    row.unshift(String(resultIndex + 1));
                    // row = row.map(function(d, j) {
                    //     if (j !== 0) {
                    //         if (columnsToSearchValues.includes(columnNames[j - 1])) {
                    //             return d;
                    //         } else {
                    //             return d;
                    //             // return escapeHTML(d);
                    //         }
                    //     } else {
                    //         return d;
                    //     }
                    row = row.filter(function(d, j) { 
                        if (selectedColumns[j]) { return d; }
                    });
                    return row;
                }).enter()
                .append("td")
                .attr("class", function(d, i) {
                    return (i !== 0) ? "results-td" : "result-index";
                })
                .html(function(d) { return `<pre>${d}</pre>`; });
        }); 

        // Add resize event listeners
        document.querySelectorAll("div.resize-right").forEach((div) => {
            makeResizable(div, adjacentIsRight=true);
        });
        document.querySelectorAll("div.resize-left").forEach((div) => {
            makeResizable(div, adjacentIsRight=false);
        });
        // Add sorter event listeners
        sorters = document.querySelectorAll(".sort");
        sorters.forEach((sorter) => {
            sorter.addEventListener('mouseover', () => sorter.style.color = "coral");
            sorter.addEventListener('mouseout', () => sorter.style.color = "steelblue");
            sorter.addEventListener('click', function(e) {
                text = sorter.innerHTML;
                if (text == "\u2261" || text == "\u25B2") { 
                    sorters.forEach((sorter) => { sorter.innerHTML = "&equiv;"; });
                    sorter.innerHTML = "&#x25BC;"; 
                    sortRows(sorter.id.slice(1), "ascending");
                } else if (text == "\u25BC") { 
                    sorter.innerHTML = "&#x25B2;"; 
                    sortRows(sorter.id.slice(1), "descending");
                }
            });
        });
        // Add text-align-control event listener
        textAligner = document.getElementById("text-align-control");
        textAligner.addEventListener("mouseover", () => textAligner.style.stroke = "yellow" );
        textAligner.addEventListener("mouseout", () => textAligner.style.stroke = "#2a3347" );
        textAligner.addEventListener("click", function() {
            if (textAligner.classList.contains("align-left")) {
                textAligner.innerHTML = `<path d="M3,3 L10,3 M0,6 L13,6 M3,9 L10,9 M0,12 L13,12"/>`;
                textAligner.classList.replace("align-left", "align-center");
                d3.selectAll("td.results-td").style("text-align", "center");
            } else if (textAligner.classList.contains("align-center")) {
                textAligner.innerHTML = `<path d="M5,3 L13,3 M1,6 L13,6 M5,9 L13,9 M1,12 L13,12"/>`;
                textAligner.classList.replace("align-center", "align-right");
                d3.selectAll("td.results-td").style("text-align", "right");
            } else if (textAligner.classList.contains("align-right")) {
                textAligner.innerHTML = `<path d="M0,3 L8,3 M0,6 L12,6 M0,9 L8,9 M0,12 L12,12"/>`;
                textAligner.classList.replace("align-right", "align-left");
                d3.selectAll("td.results-td").style("text-align", "left");
            }
        });
        enforceLightDarkMode();
        enforceHilites();
    } else {
        var resultText = "No results for";
        if (searchInputValue1 !== "") {
            resultText = resultText + ` "${searchInputValue1}"`;
            if (searchInputValue2 !== "" || searchInputValue3 !== "") {
                resultText = resultText + " and ";
            }
        }
        if (searchInputValue2 !== "") {
            resultText = resultText + `"${searchInputValue2}"`;
            if (searchInputValue3 !== "") {
                resultText = resultText + " and ";
            }
        }
        if (searchInputValue3 !== "") {
            resultText = resultText + `"${searchInputValue3}"`;
        }
        resultsNumber.text("");
        setTimeout(
            function() { resultsNumber.text(resultText); }, 
            resultsNumberTimeout
        );
    }

    console.log("FINAL columnToSearchValue1", columnToSearchValue1);
    console.log("FINAL columnToSearchValue2", columnToSearchValue2);
    console.log("FINAL columnToSearchValue3", columnToSearchValue3);
};

searchBox.addEventListener('submit', concord);