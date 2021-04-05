const searchBox = document.getElementById("search-box");

const concord = function () {
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
    var concordanceColumn1 = Array();  // matched strings with color coding

    if (searchInput1 !== "") {
        console.log("YAY");  
        var re;
        
        // Construct regex
        if (searchType1 == "regex") {
            re = caseSensitive1 ? RegExp(searchInput1) : RegExp(searchInput1, 'i');
        } else {
            var beginning = searchInput1.match(/^\w/) ? "\\b" : "";
            var end = searchInput1.match(/\w$/) ? "\\b" : "";
            pattern = `${beginning}${RegExp.escape(searchInput1)}${end}`;
            re = caseSensitive1 ? RegExp(pattern) : RegExp(pattern, 'i');
        }
        
        // Create array of color-coded strings
        for (let i = 0; i < data.length; i++) {
            var string = data[i][searchColumnIndex1];
            if (string.match(re)) {
                matchedRows1.push(i);
                var match = string.match(re);
                before = string.slice(0, match.index);
                after = string.slice(match.index + match[0].length);
                concordanceColumn1.push(
                    before + "<text style='color:darkred;'>" + match[0] +
                    "</text>" + after
                );
            }
        }
    }
    concordanceColumn1 = padConcordance(concordanceColumn1);
    console.log(matchedRows1);
    console.log(JSON.stringify(concordanceColumn1));
    
    // Add color-coded strings into data
    var newData = JSON.parse(JSON.stringify(data));
    for (i = 1; i < data.length; i++) {
        if (matchedRows1.includes(i)) {
            newData[i][searchColumnIndex1] = concordanceColumn1.pop(0);
        }
    }

    // Display results
    var selectedColumns = Array();
    d3.select('#columns-to-show').selectAll('input').each(function (d, i) { 
        selectedColumns.push(this.checked);
    });
    const results = d3.select("#results-table");
    results.html(""); // clear results
    if (matchedRows1.length > 0) {
        results.append("tr").selectAll("th")
        .data(columnNames).enter()
        .append("th")
        .text(function(d, i) { 
            if (selectedColumns[i]) { return d; } 
        });  
        for (i = 1; i < newData.length; i++) {
            if (matchedRows1.includes(i)) {
                results.append("tr").selectAll("td")
                    .data(newData[i]).enter()
                    .append("td")
                    .html(function(d, j) { 
                        if (selectedColumns[j]) { return d; }
                    });
            }
        }   
    } else {
        results.html(`No results for "${searchInput1}"`);
    }


    if (searchInput2 !== "") {
        console.log("YAY-YAY");
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