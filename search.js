//// TODOs
// - Refactor and clean code
//      - Append "1" to the plain names
//      - Move variable declarations to separate js file
// - Improve UI aesthetics/format/style
//      - Prettify search form hiding control/mechanism
//      - Improve column resizing aesthetics
//      - "Choose File" button needs to be bigger
//      - Light/Dark modes (later/last)
//      - Create own custom buttons
//      - Cross-browser aesthetics
//      - Do not center non-searched columns
// - Improve UX
//      - (minor) Improve column resizing 
//      - Anchored bottom button to go back to top OR sticky all top sections
//      - If no singleton values in a column, drop-down menu to see only specific values
//      - Sorting mechanism (for columns without concordance display)
// - (minor) Maybe allow users to paste in data
// - Write unit tests for all functions
// - ? Export results feature

const searchBox = document.getElementById("search-box");

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

    var columnsToSearchValues = [columnToSearchValue1, columnToSearchValue2];

    // THIS CAN BE MOVED TO A GLOBALS FILE
    var columnNames = columnHeaders ? data[0] : data[0].map((d, i) => { return `Column ${i + 1}`; });
    var startingRowIndex = columnHeaders ? 1 : 0;    
    var columnObject = {}; // {column name: index}
    for (let i = 0; i < columnNames.length; i++) {
        columnObject[columnNames[i]] = i;
    }
    // console.log(JSON.stringify(columnObject));
    var matchedRows1 = Array();  // the rows where there is a match
    var searchColumnIndex1 = columnObject[columnToSearchValue1];  // index of the searched column
    var matchedRows2 = Array();
    var searchColumnIndex2 = columnObject[columnToSearchValue2];  // index of the searched column


    // PROCESS SEARCH INPUT 1
    if (searchInputValue1 !== "") {
        console.log("YAY");  
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
                        // htmlSafeString1 = str.replace(re1, function(g1) {
                        //     return `${tagOpen1}${g1}${tagClose1}`;
                        // });
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
                // console.log('I reached here');
                var htmlSafeString2;
                if (regexChecked2 || matchWhereValue2 == "match-anywhere2") {
                    if (findallChecked2) {
                        htmlSafeString2 = iterHtmlSafeReplace(str, re2, tagOpen2, tagClose2);
                        // htmlSafeString2 = str.replace(re2, function(g1) {
                        //     return `${tagOpen2}${g1}${tagClose2}`;
                        // });
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
                // console.log('LAHDEEDAA');
                // console.log('re2', re2);
                // console.log('pattern2', pattern2);
                // console.log("Check every string and escapeHTML result");
                // console.log(str);
                // console.log(htmlSafeString2);
                newData[i][searchColumnIndex2] = htmlSafeString2;
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
    if (searchInputValue1 !== "" && searchInputValue2 == "") {
        matchedRows = matchedRows1;
    } else if (searchInputValue1 == "" && searchInputValue2 !== "") {
        matchedRows = matchedRows2;
    } else if (searchInputValue1 !== "" && searchInputValue2 !== "") {
        matchedRows = matchedRows1.filter(x => { 
            return matchedRows2.includes(x); 
        });
    }

    // Pad strings to be displayed
    if (matchedRows.length > 0) {
        if (concordDisplayChecked1 && searchInputValue1 !== "") {
            var concordStrings1 = matchedRows.map((index) => {
                return newData[index][searchColumnIndex1];
            });
            concordStrings1 = padConcordance(concordStrings1, 'one', concordCutoffValue1);
            // console.log(JSON.stringify(concordStrings1));
            matchedRows.forEach((index) => {
                newData[index][searchColumnIndex1] = concordStrings1.shift();
            });
        }
        if (concordDisplayChecked2 && searchInputValue2 !== "") {
            var concordStrings2 = matchedRows.map((index) => {
                return newData[index][searchColumnIndex2];
            });
            // console.log(JSON.stringify(newData));
            // console.log('searchColumnIndex2', searchColumnIndex2);
            // console.log(JSON.stringify(concordStrings2));
            concordStrings2 = padConcordance(concordStrings2, 'two', concordCutoffValue2);
            matchedRows.forEach((index) => {
                newData[index][searchColumnIndex2] = concordStrings2.shift();
            });
        }
    }
    
    // Insert text and html
    numberOfResults = matchedRows.length;
    if (numberOfResults > 0) {
        resultsNumber.text(`Total results: ${numberOfResults}`);
    }
    const results = d3.select("#results-table");
    results.html(""); // clear results
    results.append("br");
    columnsToDisplay = columnNames.filter(function(d, i) {
        if (selectedColumns[i]) { return d; }
    });
    if (matchedRows.length > 0) {
        // Column headers
        results.append("tr")
        .attr("class", "sticky")
        .selectAll("th")
        .data(columnsToDisplay).enter()
        .append("th")
        .html(function(d, i) { 
            // Add resize controller divs in header row
            if (i == columnsToDisplay.length - 1) {
                return d;
            } else {
                return `${d}<div class="resize"></div>`; 
            }
        });
        // Results
        matchedRows.forEach((index) => {
            results.append("tr").selectAll("td")
                .data(newData[index].map(
                    function(d, j) {
                        if (columnsToSearchValues.includes(columnNames[j])) {
                            return d;
                        } else {
                            return escapeHTML(d);
                        }
                    }).filter(function(d, j) { 
                        if (selectedColumns[j]) { return d; }
                    })
                ).enter()
                .append("td")
                .attr("class", "results-td")
                .html(function(d) { return d; });
        }); 
        // Add resize event listeners
        document.querySelectorAll("div.resize").forEach((div) => {
            makeResizable(div);
        });
    } else {
        var resultText = "No results for";
        if (searchInputValue1 !== "") {
            resultText = resultText + ` "${searchInputValue1}"`;
            if (searchInputValue2 !== "") {
                resultText = resultText + " and";
            }
        }
        if (searchInputValue2 !== "") {
            resultText = resultText + ` "${searchInputValue2}"`;
        }
        resultsNumber.text(resultText);
    }


    console.log("FINAL columnToSearchValue1", columnToSearchValue1);
    console.log("FINAL columnToSearchValue2", columnToSearchValue2);
};

searchBox.addEventListener('submit', concord);