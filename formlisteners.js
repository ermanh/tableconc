// ~~~~~~~~~~ All Elements ~~~~~~~~~~
const controls = document.getElementById("controls");
const hideControls = document.getElementById("hide-controls");
const chooseFile = document.getElementById("choose-file");
const columnHeaders = document.getElementById("column-headers");
const searchButton = document.getElementById("search-button");

const columnSelection = document.getElementById("column-selection");
const searchInput = document.getElementById("search-input");
const regexSelection = document.getElementById("regex");
const fullWords = document.getElementById("full-words");
const caseSensitive = document.getElementById("case-sensitive");
const matchWhere = document.getElementById("match-where");
const findall = document.getElementById("findall");
const concordanceDisplay = document.getElementById("concordance-display");
const concordanceCutoff = document.getElementById("concordance-cutoff");

const columnSelection2 = document.getElementById("column-selection2");
const searchInput2 = document.getElementById("search-input2");
const regexSelection2 = document.getElementById("regex2");
const fullWords2 = document.getElementById("full-words2");
const caseSensitive2 = document.getElementById("case-sensitive2");
const matchWhere2 = document.getElementById("match-where2");
const findall2 = document.getElementById("findall2");
const concordanceDisplay2 = document.getElementById("concordance-display2");
const concordanceCutoff2 = document.getElementById("concordance-cutoff2");

// ~~~~~~~~~~ Hide Controls ~~~~~~~~~~
hideControls.addEventListener('click', function() {
    // controls.style.display = (controls.style.display != 'none') ? 'none' : 'block';
    if (controls.style.display != 'none') {
        controls.className = 'slideClose';
        // controls.style.display = 'none';
    } else {
        controls.className = 'slideOpen';
    }
});

// ~~~~~~~~~~ Columns to display ~~~~~~~~~~
columnHeaders.addEventListener('change', function() {
    if (chooseFile.value) { readFile(); }
});

// ~~~~~~~~~~ SEARCH 1 ~~~~~~~~~~

// ~~~ Search Type ~~~
// Selecting "Regex"... 
// - selects "Case-sensitive"
// - deselects and disables "Full word(s)"
regexSelection.addEventListener('change', function() {
    if (this.checked) {
        caseSensitive.checked = true;
        fullWords.checked = false;
        fullWords.disabled = true;
        matchWhere.disabled = true;
    } else {
        caseSensitive.checked = false;
        fullWords.checked = true;
        fullWords.disabled = false;
        matchWhere.disabled = false;
    }
});

// ~~~ Concordance Cutoff ~~~
concordanceDisplay.addEventListener('change', function() {
    if (this.checked) {
        concordanceCutoff.disabled = false;
    } else {
        concordanceCutoff.disabled = true;
    }
});

// ~~~ Findall ~~~
findall.addEventListener('change', function() {
    if (this.checked) {
        concordanceDisplay.checked = false;
        concordanceDisplay.disabled = true;
        concordanceCutoff.disabled = true;
    } else {
        concordanceDisplay.disabled = false;
        concordanceCutoff.disabled = false;
    }
});

// ~~~ Column Selection ~~~
columnSelection.addEventListener('change', function() {
    var columnSelectionValue = this.value;
    if (columnSelectionValue == "(None)") {
        // Enable all selections in the other column selection
        columnSelection2.childNodes.forEach(function(node) { node.disabled = false; });
        // Disable all selections
        searchInput.value = "";
        searchInput.disabled = true;
        regexSelection.disabled = true;
        fullWords.disabled = true;
        caseSensitive.disabled = true;
        matchWhere.disabled = true;
        findall.disabled = true;
        concordanceDisplay.disabled = true;
        concordanceCutoff.disabled = true;
        if (columnSelection2.value == "(None)") { searchButton.disabled = true; }
    } else {
        // Enable all selections
        searchInput.disabled = false;
        regexSelection.disabled = false;
        fullWords.disabled = false;
        caseSensitive.disabled = false;
        matchWhere.disabled = false;
        findall.disabled = false;
        concordanceDisplay.disabled = false;
        if (concordanceDisplay.checked) { concordanceCutoff.disabled = false; }
        searchButton.disabled = false;
        columnSelection2.childNodes.forEach(function(node) {
            if (node.value !== columnSelectionValue) {
                // Enable all options in the other search
                node.disabled = false;
            } else {
                // Disable the selected option in the other search
                node.disabled = true;
            }
        });
    }
});


// ~~~~~~~~~~ SEARCH 2 ~~~~~~~~~~

// ~~~ Search Type ~~~
// Selecting "Regex"... 
// - selects "Case-sensitive"
// - deselects and disables "Full word(s)"
regexSelection2.addEventListener('change', function() {
    if (this.checked) {
        caseSensitive2.checked = true;
        fullWords2.checked = false;
        fullWords2.disabled = true;
        matchWhere2.disabled = true;
    } else {
        caseSensitive2.checked = false;
        fullWords2.checked = true;
        fullWords2.disabled = false;
        matchWhere2.disabled = false;
    }
});

// ~~~ Concordance Cutoff ~~~
concordanceDisplay2.addEventListener('change', function() {
    if (this.checked) {
        concordanceCutoff2.disabled = false;
    } else {
        concordanceCutoff2.disabled = true;
    }
});

// ~~~ Findall ~~~
findall2.addEventListener('change', function() {
    if (this.checked) {
        concordanceDisplay2.checked = false;
        concordanceDisplay2.disabled = true;
        concordanceCutoff2.disabled = true;
    } else {
        concordanceDisplay2.disabled = false;
        concordanceCutoff2.disabled = false;
    }
});

// ~~~ Column Selection ~~~
columnSelection2.addEventListener('change', function() {
    var columnSelectionValue2 = this.value;
    if (columnSelectionValue2 == "(None)") {
        // Enable all selections in the other column selection
        columnSelection.childNodes.forEach(function(node) { node.disabled = false; });
        // Disable all selections
        searchInput2.value = "";
        searchInput2.disabled = true;
        regexSelection2.disabled = true;
        fullWords2.disabled = true;
        caseSensitive2.disabled = true;
        matchWhere2.disabled = true;
        findall2.disabled = true;
        concordanceDisplay2.disabled = true;
        concordanceCutoff2.disabled = true;
        if (columnSelection.value == "(None)") { searchButton.disabled = true; }
    } else {
        // Enable all selections
        searchInput2.disabled = false;
        regexSelection2.disabled = false;
        fullWords2.disabled = false;
        caseSensitive2.disabled = false;
        matchWhere2.disabled = false;
        findall2.disabled = false;
        concordanceDisplay2.disabled = false;
        if (concordanceDisplay2.checked) { concordanceCutoff2.disabled = false; }
        searchButton.disabled = false;
        columnSelection.childNodes.forEach(function(node) {
            if (node.value !== columnSelectionValue2) {
                // Enable all options in the other search
                node.disabled = false;
            } else {
                // Disable the selected option in the other search
                node.disabled = true;
            }
        });
    }
});

