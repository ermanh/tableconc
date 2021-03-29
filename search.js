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
    columnObject = {};
    for (let i = 0; i < columnNames.length; i++) {
        columnObject[columnNames[i]] = i;
    }
    // console.log(JSON.stringify(columnObject));
    var matchedRows1 = Array();
    var searchColumnIndex1 = columnObject[columnToSearch1];
    var concordanceColumn1 = Array();

    if (searchInput1 !== "") {
        console.log("YAY");  
        var re;
        
        if (searchType1 == "regex") {
            re = caseSensitive1 ? RegExp(searchInput1) : RegExp(searchInput1, 'i');
        } else {
            var beginning = searchInput1.match(/^\w/) ? "\\b" : "";
            var end = searchInput1.match(/\w$/) ? "\\b" : "";
            pattern = `${beginning}${searchInput1}${end}`
            re = caseSensitive1 ? RegExp(pattern) : RegExp(pattern, 'i');
        }
        // console.log(re);
        for (let i = 0; i < data.length; i++) {
            var string = data[i][searchColumnIndex1]
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
        // need to save column with concordance color-coding and central alignment
    }
    console.log(matchedRows1);
    console.log(JSON.stringify(concordanceColumn1));
    
    


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