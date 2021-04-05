//// SEARCH 1
// Switching search-type to "Regex"... 
// - selects "Case-sensitive"
// - deselects and disables "Full word(s)"
const regexSelection = document.getElementById("regex");
regexSelection.addEventListener('change', function() {
    if (this.checked) {
        document.getElementById("case-sensitive").checked = true;
        document.getElementById("full-words").checked = false;
        document.getElementById("full-words").disabled = true;
        document.getElementById("match-where").disabled = true;
    }
});
// Switching search-type to "Keyword" reverses above actions
const keywordSelection = document.getElementById("keyword");
keywordSelection.addEventListener('change', function() {
    if (this.checked) {
        document.getElementById("case-sensitive").checked = false;
        document.getElementById("full-words").checked = true;
        document.getElementById("full-words").disabled = false;
        document.getElementById("match-where").disabled = false;
    }
});

//// SEARCH 2
// Switching search-type to "Regex"... 
// - selects "Case-sensitive"
// - deselects and disables "Full word(s)"
const regexSelection2 = document.getElementById("regex2");
regexSelection.addEventListener('change', function() {
    if (this.checked) {
        document.getElementById("case-sensitive2").checked = true;
        document.getElementById("full-words2").checked = false;
        document.getElementById("full-words2").disabled = true;
        document.getElementById("match-where2").disabled = true;
    }
});
// Switching search-type to "Keyword" reverses above actions
const keywordSelection2 = document.getElementById("keyword2");
keywordSelection.addEventListener('change', function() {
    if (this.checked) {
        document.getElementById("case-sensitive2").checked = false;
        document.getElementById("full-words2").checked = true;
        document.getElementById("full-words2").disabled = false;
        document.getElementById("match-where2").disabled = false;
    }
});