// Switching search-type to "Regex" selects "Case-sensitive"
const regexSelection = document.getElementById("regex");
regexSelection.addEventListener('change', function() {
    if (this.checked) {
        document.getElementById("case-sensitive").checked = true;
    }
});

// Switching search-type to "Keyword" deselects "Case-sensitive"
const keywordSelection = document.getElementById("keyword");
keywordSelection.addEventListener('change', function() {
    if (this.checked) {
        document.getElementById("case-sensitive").checked = false;
    }
});
