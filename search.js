// TODO: Add "match multiple"

const searchBox = document.getElementById("search-box");

const concord = function () {
    var newData = JSON.parse(JSON.stringify(data));

    var columnToSearchValue1 = document.getElementById("column-selection").value;
    var searchInputValue1 = document.getElementById("search-input").value;
    var searchTypeValue1 = document.querySelector('input[name="search-type"]:checked').value;
    var fullWordsChecked1 = document.getElementById("full-words").checked;
    var caseSensitiveChecked1 = document.getElementById("case-sensitive").checked;
    var matchWhereValue1 = document.getElementById("match-where").value;
    var concordDisplayChecked1 = document.getElementById("concordance-display").checked;

    var columnToSearchValue2 = document.getElementById("column-selection2").value;
    var searchInputValue2 = document.getElementById("search-input2").value;
    var searchTypeValue2 = document.querySelector('input[name="search-type2"]:checked').value;
    var fullWordsChecked2 = document.getElementById("full-words2").checked;
    var caseSensitiveChecked2 = document.getElementById("case-sensitive2").checked;
    var matchWhereValue2 = document.getElementById("match-where2").value;
    var concordDisplayChecked2 = document.getElementById("concordance-display2").checked;
    
    columnNames = data[0];
    columnObject = {}; // {column name: index}
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
        var re1;
        var pattern1 = searchInputValue1;

        // Construct regex
        if (searchTypeValue1 == "regex") {
            re1 = caseSensitiveChecked1 ? RegExp(pattern1) : RegExp(pattern1, 'i');
        } else {
            pattern1 = RegExp.escape(searchInputValue1);
            if (fullWordsChecked1) {
                var beginning1 = searchInputValue1.match(/^\w/) ? "\\b" : "";
                var end1 = searchInputValue1.match(/\w$/) ? "\\b" : "";
                pattern1 = `${beginning1}${pattern1}${end1}`;
            }
            if (matchWhereValue1 == "match-entire") {
                pattern1 = `^${pattern1}$`;
            } else if (matchWhereValue1 == "match-beginning") {
                pattern1 = `^${pattern1}`;
            } else if (matchWhereValue1 == "match-end") {
                pattern1 = `${pattern1}$`;
            }
            re1 = caseSensitiveChecked1 ? RegExp(pattern1) : RegExp(pattern1, 'i');
        }
        
        // Record matched rows and create array of color-coded strings
        for (let i = 0; i < data.length; i++) {
            let str = data[i][searchColumnIndex1];
            if (str.match(re1)) {
                matchedRows1.push(i);
                let match = str.match(re1);
                let before = str.slice(0, match.index);
                let after = str.slice(match.index + match[0].length);
                let tagOpen = "<text style='color:darkred;'>";
                let tagClose = "</text>";
                newData[i][searchColumnIndex1] = `${before}${tagOpen}${match[0]}${tagClose}${after}`;
            }
        }
    }


    // PROCESS SEARCH INPUT 2
    if (searchInputValue2 !== "") {
        console.log("YAY-YAY");
        var re2;
        var pattern2 = searchInputValue2;

        // Construct regex
        if (searchTypeValue2 == "regex") {
            re2 = caseSensitiveChecked2 ? RegExp(pattern2) : RegExp(pattern2, 'i');
        } else {
            pattern2 = RegExp.escape(searchInputValue2);
            if (fullWordsChecked2) {
                var beginning2 = searchInputValue1.match(/^\w/) ? "\\b" : "";
                var end2 = searchInputValue1.match(/\w$/) ? "\\b" : "";
                pattern2 = `${beginning2}${pattern2}${end2}`;
            }
            if (matchWhereValue2 == "match-entire") {
                pattern2 = `^${pattern2}$`;
            } else if (matchWhereValue2 == "match-beginning") {
                pattern2 = `^${pattern2}`;
            } else if (matchWhereValue2 == "match-end") {
                pattern2 = `${pattern2}$`;
            }
            re2 = caseSensitiveChecked2 ? RegExp(pattern2) : RegExp(pattern2, 'i');
        }

        // Record matched rows
        for (let i = 0; i < data.length; i++) {
            let str = data[i][searchColumnIndex2];
            if (str.match(re2)) {
                matchedRows2.push(i);
                let match = str.match(re2);
                let before = str.slice(0, match.index);
                let after = str.slice(match.index + match[0].length);
                let tagOpen = "<text style='color:blue;'>";
                let tagClose = "</text>";
                newData[i][searchColumnIndex2] = `${before}${tagOpen}${match[0]}${tagClose}${after}`;
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
            concordStrings1 = padConcordance(concordStrings1, 'red');
            console.log(JSON.stringify(concordStrings1));
            matchedRows.forEach((index) => {
                newData[index][searchColumnIndex1] = concordStrings1.shift();
            });
        }
        if (concordDisplayChecked2 && searchInputValue2 !== "") {
            var concordStrings2 = matchedRows.map((index) => {
                return newData[index][searchColumnIndex2];
            });
            concordStrings2 = padConcordance(concordStrings2, 'blue');
            matchedRows.forEach((index) => {
                newData[index][searchColumnIndex2] = concordStrings2.shift();
            });
        }
    }
    
    // Insert text and html
    const results = d3.select("#results-table");
    results.html(""); // clear results
    if (matchedRows.length > 0) {
        results.append("tr").selectAll("th")
        .data(columnNames.filter(function(d, i) {
            if (selectedColumns[i]) { return d; }
        })).enter()
        .append("th")
        .text(function(d) { return d; });
        matchedRows.forEach((index) => {
            results.append("tr").selectAll("td")
                .data(newData[index].filter(function(d, j) {
                    if (selectedColumns[j]) { return d; }
                })).enter()
                .append("td")
                .attr("class", "results-td")
                .html(function(d) { return d; });
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
        results.html(resultText);
    }


    console.log("FINAL columnToSearchValue1", columnToSearchValue1);
    // console.log("searchInputValue1", searchInputValue1);
    // console.log("searchTypeValue1", searchTypeValue1);
    // console.log("fullWordsChecked1", fullWordsChecked1);
    // console.log("caseSensitiveChecked1", caseSensitiveChecked1);
    console.log("matchWhereValue1", matchWhereValue1);

    // console.log("columnToSearchValue2", columnToSearchValue2);
    // console.log("searchInputValue2", searchInputValue2);
    // console.log("searchTypeValue2", searchTypeValue2);
    // console.log("fullWordsChecked2", fullWordsChecked2);
    // console.log("caseSensitiveChecked2", caseSensitiveChecked2);
    // console.log("matchWhereValue2", matchWhereValue2);
};

searchBox.addEventListener('submit', concord);