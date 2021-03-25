const searchBox = document.getElementById("search-box");
const searchButton = document.getElementById("search-button");

const concord = function () {
    var searchInput = document.getElementById("search-input").value;
    var searchType = $j('input[name="search-type"]').val();
    var chinese = document.getElementById("chinese").checked;
    var fullWords = (
        document.getElementById("full-words").checked &&
        !document.getElementById("full-words").disabled
    );
    var caseSensitive = document.getElementById("case-sensitive").checked;
    var matchWhere = $j('input[name="match-where"]').val();
    console.log("searchInput", searchInput);
    console.log("searchType", searchType);
    console.log("chinese", chinese);
    console.log("fullWords", fullWords);
};

searchBox.addEventListener('submit', concord);
searchButton.addEventListener('click', concord);