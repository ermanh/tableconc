const searchBox = document.getElementById("search-box");

const concord = function () {
    var columnToSearch = document.getElementById("column-selection").value;
    var searchInput = document.getElementById("search-input").value;
    var searchType = $j('input[name="search-type"]').val();
    var fullWords = document.getElementById("full-words").checked;
    var caseSensitive = document.getElementById("case-sensitive").checked;
    var matchWhere = document.getElementById("match-where").value;

    var columnToSearch2 = document.getElementById("column-selection2").value;
    var searchInput2 = document.getElementById("search-input2").value;
    var searchType2 = $j('input[name="search-type2"]').val();
    var fullWords2 = document.getElementById("full-words2").checked;
    var caseSensitive2 = document.getElementById("case-sensitive2").checked;
    var matchWhere2 = document.getElementById("match-where2").value;

    if (searchInput !== "") {
        console.log("YAY");  
        if (searchType == "regex") {
            var re = RegExp(searchInput);
        } else {
            // check beginning
            var beginning = searchInput.match(/^\w/) ? "\b" : "";
            // check end
            var end = searchInput.match(/\w$/) ? "\b" : "";
            var re = RegExp(`${beginning}${searchInput}${end}`);
        }
    }

    if (searchInput2 !== "") {
        console.log("YAY-YAY");
    }

    console.log("columnToSearch", columnToSearch);
    console.log("searchInput", searchInput);
    console.log("searchType", searchType);
    console.log("fullWords", fullWords);
    console.log("caseSensitive", caseSensitive);
    console.log("matchWhere", matchWhere);

    console.log("columnToSearch2", columnToSearch2);
    console.log("searchInput2", searchInput2);
    console.log("searchType2", searchType2);
    console.log("fullWords2", fullWords2);
    console.log("caseSensitive2", caseSensitive2);
    console.log("matchWhere2", matchWhere2);
};

searchBox.addEventListener('submit', concord);