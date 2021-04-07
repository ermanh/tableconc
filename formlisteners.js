// ~~~~~~~~~~ All Search Elements ~~~~~~~~~~
const columnSelection = document.getElementById("column-selection");
const searchInput = document.getElementById("search-input");
const regexSelection = document.getElementById("regex");
const keywordSelection = document.getElementById("keyword");
const fullWords = document.getElementById("full-words");
const caseSensitive = document.getElementById("case-sensitive");
const matchWhere = document.getElementById("match-where");
const concordanceDisplay = document.getElementById("concordance-display");

const columnSelection2 = document.getElementById("column-selection2");
const searchInput2 = document.getElementById("search-input2");
const regexSelection2 = document.getElementById("regex2");
const keywordSelection2 = document.getElementById("keyword2");
const fullWords2 = document.getElementById("full-words2");
const caseSensitive2 = document.getElementById("case-sensitive2");
const matchWhere2 = document.getElementById("match-where2");
const concordanceDisplay2 = document.getElementById("concordance-display2");

const searchButton = document.getElementById("search-button");

// ~~~~~~~~~~ SEARCH 1 ~~~~~~~~~~~

// ~~~ Search Type ~~~
// Switching search-type to "Regex"... 
// - selects "Case-sensitive"
// - deselects and disables "Full word(s)"
regexSelection.addEventListener('change', function() {
    if (this.checked) {
        caseSensitive.checked = true;
        fullWords.checked = false;
        fullWords.disabled = true;
        matchWhere.disabled = true;
    }
});
// Switching search-type to "Keyword" reverses above actions
keywordSelection.addEventListener('change', function() {
    if (this.checked) {
        caseSensitive.checked = false;
        fullWords.checked = true;
        fullWords.disabled = false;
        matchWhere.disabled = false;
    }
});

// ~~~ Column Selection ~~~
columnSelection.addEventListener('change', function() {
    if (this.value == "(none)") {
        // Diable all selections
        searchInput.value = "";
        searchInput.disabled = true;
        regexSelection.disabled = true;
        keywordSelection.disabled = true;
        fullWords.disabled = true;
        caseSensitive.disabled = true;
        matchWhere.disabled = true;
        concordanceDisplay.disabled = true;
        if (columnSelection2.value == "(none)") {
            searchButton.disabled = true;
        }
    } else {
        // Enable all selections
        searchInput.disabled = false;
        regexSelection.disabled = false;
        keywordSelection.disabled = false;
        fullWords.disabled = false;
        caseSensitive.disabled = false;
        matchWhere.disabled = false;
        concordanceDisplay.disabled = false;
        searchButton.disabled = false;
    }
});


// ~~~~~~~~~~ SEARCH 2 ~~~~~~~~~~

// ~~~ Search Type ~~~
// Switching search-type to "Regex"... 
// - selects "Case-sensitive"
// - deselects and disables "Full word(s)"
regexSelection.addEventListener('change', function() {
    if (this.checked) {
        caseSensitive2.checked = true;
        fullWords2.checked = false;
        fullWords2.disabled = true;
        matchWhere2.disabled = true;
    }
});
// Switching search-type to "Keyword" reverses above actions
keywordSelection.addEventListener('change', function() {
    if (this.checked) {
        caseSensitive2.checked = false;
        fullWords2.checked = true;
        fullWords2.disabled = false;
        matchWhere2.disabled = false;
    }
});

// ~~~ Column Selection ~~~
columnSelection2.addEventListener('change', function() {
    if (this.value == "(none)") {
        // Diable all selections
        searchInput2.value = "";
        searchInput2.disabled = true;
        regexSelection2.disabled = true;
        keywordSelection2.disabled = true;
        fullWords2.disabled = true;
        caseSensitive2.disabled = true;
        matchWhere2.disabled = true;
        concordanceDisplay2.disabled = true;
        if (columnSelection.value == "(none)") {
            searchButton.disabled = true;
        }
    } else {
        // Enable all selections
        searchInput2.disabled = false;
        regexSelection2.disabled = false;
        keywordSelection2.disabled = false;
        fullWords2.disabled = false;
        caseSensitive2.disabled = false;
        matchWhere2.disabled = false;
        concordanceDisplay2.disabled = false;
        searchButton.disabled = false;
    }
});

