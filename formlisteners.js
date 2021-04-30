// ~~~~~~~~~~ All Elements ~~~~~~~~~~
const controls = document.getElementById("controls");
const hideControls = document.getElementById("hide-controls");
const columnControls = document.getElementById("columnselect");
const hideColumnControls = document.getElementById("hide-column-controls");
const chooseFile = document.getElementById("choose-file");
const columnHeaders = document.getElementById("column-headers");
const searchButton = document.getElementById("search-button");
const searchButtonOutside = document.getElementById("search-button-outside");
const secondSearch = document.getElementById("second-search");
const secondSearchHider = document.getElementById("second-search-hider");

const columnSelection = document.getElementById("column-selection");
const searchInput = document.getElementById("search-input");
const regexSelection = document.getElementById("regex");
const fullWords = document.getElementById("full-words");
const caseSensitive = document.getElementById("case-sensitive");
const matchWhere = document.getElementById("match-where");
const findall = document.getElementById("findall");
const concordanceDisplay = document.getElementById("concordance-display");
const concordanceCutoff = document.getElementById("concordance-cutoff");
const colorPicker1 = document.getElementById("picker-1");
const colorPickerDiv1 = document.getElementById("picker-div-1");
const bgColorPicker1 = document.getElementById("bg-picker-1");
const bgColorPickerDiv1 = document.getElementById("bg-picker-div-1");

const columnSelection2 = document.getElementById("column-selection2");
const searchInput2 = document.getElementById("search-input2");
const regexSelection2 = document.getElementById("regex2");
const fullWords2 = document.getElementById("full-words2");
const caseSensitive2 = document.getElementById("case-sensitive2");
const matchWhere2 = document.getElementById("match-where2");
const findall2 = document.getElementById("findall2");
const concordanceDisplay2 = document.getElementById("concordance-display2");
const concordanceCutoff2 = document.getElementById("concordance-cutoff2");
const colorPicker2 = document.getElementById("picker-2");
const colorPickerDiv2 = document.getElementById("picker-div-2");
const bgColorPicker2 = document.getElementById("bg-picker-2");
const bgColorPickerDiv2 = document.getElementById("bg-picker-div-2");


// ~~~~~~~~~~ Hide Controls ~~~~~~~~~~
hideControls.addEventListener('click', function() {
    if (controls.style.display != 'none') {
        controls.style.display = 'none';
        hideControls.innerHTML = 'S H O W&nbsp;&nbsp;&nbsp;S E A R C H';
    } else {
        controls.style.display = 'block';
        hideControls.innerHTML = 'H I D E&nbsp;&nbsp;&nbsp;S E A R C H';
    }
    
});
hideColumnControls.addEventListener('click', function() {
    if (columnControls.style.display != 'none') {
        columnControls.style.display = 'none';
        hideColumnControls.innerHTML = 'S H O W&nbsp;&nbsp;&nbsp;C O L U M N S';
    } else {
        columnControls.style.display = 'block';
        hideColumnControls.innerHTML = 'H I D E&nbsp;&nbsp;&nbsp;C O L U M N S';
    }
});

// ~~~ Second Search Hider ~~~
secondSearchHider.addEventListener('click', function(e) {
    e.preventDefault();
    if (secondSearch.style.display == "none") {
        secondSearch.style.display = "block";
        this.innerHTML = '<path d="M1,6 L11,6" stroke="#384a73" stroke-width="2" />';
    } else {
        secondSearch.style.display = "none";
        this.innerHTML = '<path d="M1,6 L11,6 M6,1 L6,11" stroke="#384a73" stroke-width="2" />';
    }
});


// ~~~~~~~~~~ Columns to display ~~~~~~~~~~
columnHeaders.addEventListener('change', function() {
    if (chooseFile.value) { readFile(); }
});

// ~~~~~~~~~~ SEARCH 1 ~~~~~~~~~~

// ~~~ Search Type 1 ~~~
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

// ~~~ Concordance Cutoff 1 ~~~
concordanceDisplay.addEventListener('change', function() {
    if (this.checked) {
        concordanceCutoff.disabled = false;
    } else {
        concordanceCutoff.disabled = true;
    }
});

// ~~~ Findall 1 ~~~
findall.addEventListener('change', function() {
    if (this.checked) {
        concordanceDisplay.checked = false;
        concordanceDisplay.disabled = true;
        concordanceCutoff.disabled = true;
        matchWhere.value = 'match-anywhere';
        matchWhere.disabled = true;
    } else {
        concordanceDisplay.disabled = false;
        concordanceCutoff.disabled = false;
        matchWhere.disabled = false;
    }
});

// ~~~ Column Selection 1 ~~~
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
        colorPickerDiv1.style.opacity = "0.3";
        bgColorPickerDiv1.style.opacity = "0.3";
        colorPicker1.disabled = true;
        bgColorPickerDiv1.disabled=true;
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
        colorPickerDiv1.style.opacity = "1";
        bgColorPickerDiv1.style.opacity = "1";
        colorPicker1.disabled = false;
        bgColorPickerDiv1.disabled=false;
        searchButton.disabled = false;
        searchButtonOutside.disabled = false;
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

// ~~~ Color Pickers 1 ~~~
colorPicker1.addEventListener('change', function() {
    let newColor = colorPicker1.value;
    colorPickerDiv1.style.backgroundColor = newColor;
    hilitedOnes = document.getElementsByClassName("hilite1");
    Array.from(hilitedOnes).forEach((el) => {
        el.style.color = newColor;
    });
});
colorPickerDiv1.style.backgroundColor = colorPicker1.value;

bgColorPicker1.addEventListener('change', function() {
    let newColor = bgColorPicker1.value;
    bgColorPickerDiv1.style.backgroundColor = newColor;
    hilitedOnes = document.getElementsByClassName("hilite1");
    Array.from(hilitedOnes).forEach((el) => {
        el.style.backgroundColor = newColor; 
    })
});
bgColorPickerDiv1.style.backgroundColor = bgColorPicker1.value;


// ~~~~~~~~~~ SEARCH 2 ~~~~~~~~~~

// ~~~ Search Type 2 ~~~
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

// ~~~ Concordance Cutoff 2 ~~~
concordanceDisplay2.addEventListener('change', function() {
    if (this.checked) {
        concordanceCutoff2.disabled = false;
    } else {
        concordanceCutoff2.disabled = true;
    }
});

// ~~~ Findall 2 ~~~
findall2.addEventListener('change', function() {
    if (this.checked) {
        concordanceDisplay2.checked = false;
        concordanceDisplay2.disabled = true;
        concordanceCutoff2.disabled = true;
        matchWhere2.value = "match-anywhere2";
        matchWhere2.disabled = true;
    } else {
        concordanceDisplay2.disabled = false;
        concordanceCutoff2.disabled = false;
        matchWhere2.disabled = false;
    }
});

// ~~~ Column Selection 2 ~~~
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
        colorPickerDiv2.style.opacity = "0.3";
        bgColorPickerDiv2.style.opacity = "0.3";
        colorPicker2.disabled = true;
        bgColorPickerDiv2.disabled=true;
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
        colorPickerDiv2.style.opacity = "1";
        bgColorPickerDiv2.style.opacity = "1";
        colorPicker2.disabled = false;
        bgColorPickerDiv2.disabled=false;
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

// ~~~ Color Pickers 2 ~~~
colorPicker2.addEventListener('change', function() {
    let newColor = colorPicker2.value;
    colorPickerDiv2.style.backgroundColor = newColor;
    hilitedTwos = document.getElementsByClassName("hilite2");
    Array.from(hilitedTwos).forEach((el) => {
        el.style.color = newColor;
    });
});
colorPickerDiv2.style.backgroundColor = colorPicker2.value;

bgColorPicker2.addEventListener('change', function() {
    let newColor = bgColorPicker2.value;
    bgColorPickerDiv2.style.backgroundColor = newColor;
    hilitedTwos = document.getElementsByClassName("hilite2");
    Array.from(hilitedTwos).forEach((el) => {
        el.style.backgroundColor = newColor;
    });
});
bgColorPickerDiv2.style.backgroundColor = bgColorPicker2.value;
