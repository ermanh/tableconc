const searchBox = document.getElementById("search-box");

const concord = function () {
    var newData = JSON.parse(JSON.stringify(data));

    var columnToSearch1 = document.getElementById("column-selection").value;
    var searchInput1 = document.getElementById("search-input").value;
    var searchType1 = $j('input[name="search-type"]').val();
    var fullWords1 = document.getElementById("full-words").checked;
    var caseSensitive1 = document.getElementById("case-sensitive").checked;
    var matchWhere1 = document.getElementById("match-where").value;

    var columnToSearch2 = document.getElementById("column-selection2").value;
    var searchInput2 = document.getElementById("search-input2").value;
    var searchType2 = $j('input[name="search-type2"]').val();
    var fullWords2 = document.getElementById("full-words2").checked;
    var caseSensitive2 = document.getElementById("case-sensitive2").checked;
    var matchWhere2 = document.getElementById("match-where2").value;
    
    columnNames = data[0];
    columnObject = {}; // {column name: index}
    for (let i = 0; i < columnNames.length; i++) {
        columnObject[columnNames[i]] = i;
    }
    // console.log(JSON.stringify(columnObject));
    var matchedRows1 = Array();  // the rows where there is a match
    var searchColumnIndex1 = columnObject[columnToSearch1];  // index of the searched column
    var matchedRows2 = Array();
    var searchColumnIndex2 = columnObject[columnToSearch2];  // index of the searched column


    // PROCESS SEARCH INPUT 1
    if (searchInput1 !== "") {
        console.log("YAY");  
        var re1;
        
        // Construct regex
        if (searchType1 == "regex") {
            re1 = caseSensitive1 ? RegExp(searchInput1) : RegExp(searchInput1, 'i');
        } else {
            var beginning1 = searchInput1.match(/^\w/) ? "\\b" : "";
            var end1 = searchInput1.match(/\w$/) ? "\\b" : "";
            var pattern1 = `${beginning1}${RegExp.escape(searchInput1)}${end1}`;
            re1 = caseSensitive1 ? RegExp(pattern1) : RegExp(pattern1, 'i');
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
    if (searchInput2 !== "") {
        console.log("YAY-YAY");
        var re2;
        // Construct regex
        if (searchType2 == "regex") {
            re2 = caseSensitive2 ? RegExp(searchInput2) : RegExp(searchIntput2, 'i');
        } else {
            var beginning2 = searchInput2.match(/^\w/) ? "\\b" : "";
            var end2 = searchInput2.match(/\w$/) ? "\\b" : "";
            var pattern2 = `${beginning2}${RegExp.escape(searchInput2)}${end2}`;
            re2 = caseSensitive2 ? RegExp(pattern2) : RegExp(pattern2, 'i');
        }

        // Record matched rows
        // TODO: searchColumnIndex2 cannot be the same as searchColumnIndex1
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
    if (searchInput1 !== "" && searchInput2 == "") {
        matchedRows = matchedRows1;
    } else if (searchInput1 == "" && searchInput2 !== "") {
        matchedRows = matchedRows2;
    } else if (searchInput1 !== "" && searchInput2 !== "") {
        matchedRows = matchedRows1.filter(x => { 
            return matchedRows2.includes(x); 
        });
    }

    
    // Pad strings to be displayed
    var concordanceStrings1 = matchedRows.map((index) => {
        return newData[index][searchColumnIndex1];
    });
    concordanceStrings1 = padConcordance(concordanceStrings1);
    matchedRows.forEach((index) => {
        newData[index][searchColumnIndex1] = concordanceStrings1.pop(0);
    });

    
    // Insert text and html
    const results = d3.select("#results-table");
    results.html(""); // clear results
    if (matchedRows.length > 0) {
        results.append("tr").selectAll("th")
        .data(columnNames).enter()
        .append("th")
        .text(function(d, i) { 
            if (selectedColumns[i]) { return d; } 
        });  
        matchedRows.forEach((index) => {
            results.append("tr").selectAll("td")
                .data(newData[index]).enter()
                .append("td")
                .html(function(d, j) {
                    if (selectedColumns[j]) { return d; }
                });
        }); 
    } else {
        results.html(`No results for "${searchInput1}"`);
    }




    console.log("columnToSearch1", columnToSearch1);
    console.log("searchInput1", searchInput1);
    console.log("searchType1", searchType1);
    console.log("fullWords1", fullWords1);
    console.log("caseSensitive1", caseSensitive1);
    console.log("matchWhere1", matchWhere1);

    console.log("columnToSearch2", columnToSearch2);
    console.log("searchInput2", searchInput2);
    console.log("searchType2", searchType2);
    console.log("fullWords2", fullWords2);
    console.log("caseSensitive2", caseSensitive2);
    console.log("matchWhere2", matchWhere2);
};

searchBox.addEventListener('submit', concord);