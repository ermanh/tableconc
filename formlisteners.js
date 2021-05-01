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
const thirdSearch = document.getElementById("third-search");
const thirdSearchHider = document.getElementById("third-search-hider");
const lightControl = document.getElementById("light-control");
const darkControl = document.getElementById("dark-control");

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

const columnSelection3 = document.getElementById("column-selection3");
const searchInput3 = document.getElementById("search-input3");
const regexSelection3 = document.getElementById("regex3");
const fullWords3 = document.getElementById("full-words3");
const caseSensitive3 = document.getElementById("case-sensitive3");
const matchWhere3 = document.getElementById("match-where3");
const findall3 = document.getElementById("findall3");
const concordanceDisplay3 = document.getElementById("concordance-display3");
const concordanceCutoff3 = document.getElementById("concordance-cutoff3");
const colorPicker3 = document.getElementById("picker-3");
const colorPickerDiv3 = document.getElementById("picker-div-3");
const bgColorPicker3 = document.getElementById("bg-picker-3");
const bgColorPickerDiv3 = document.getElementById("bg-picker-div-3");


// ~~~ Columns to display ~~~
columnHeaders.addEventListener('change', function() {
    if (chooseFile.value) { readFile(); }
});

// ~~~ Hide Controls ~~~
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

// ~~~ Second & Third Search Hiders ~~~
secondSearchHider.addEventListener('click', function() {
    if (secondSearch.style.display == "none") {
        secondSearch.style.display = "block";
        this.innerHTML = '<path d="M2,6 L10,6" stroke="#384a73" stroke-width="2" />';
    } else {
        secondSearch.style.display = "none";
        this.innerHTML = '<path d="M2,6 L10,6 M6,2 L6,10" stroke="#384a73" stroke-width="2" />';
    }
});
thirdSearchHider.addEventListener('click', function() {
    if (thirdSearch.style.display == "none") {
        thirdSearch.style.display = "block";
        this.innerHTML = '<path d="M2,6 L10,6" stroke="#384a73" stroke-width="2" />';
    } else {
        thirdSearch.style.display = "none";
        this.innerHTML = '<path d="M2,6 L10,6 M6,2 L6,10" stroke="#384a73" stroke-width="2" />';
    }
});

// ~~~ Light and Dark Mode Controls ~~~
lightControl.addEventListener("mouseover", function() {
    if (lightControl.classList.contains("is-dark")) {
        lightControl.style.opacity = "1";
    }
});
lightControl.addEventListener("mouseout", function() {
    if (lightControl.classList.contains("is-dark")) {
        lightControl.style.opacity = "0.5";
    }
});
lightControl.addEventListener("click", function() {
    if (lightControl.classList.contains("is-dark")) {
        lightControl.classList.replace("is-dark", "is-light");
        lightControl.style.backgroundColor = "steelblue";
        lightControl.style.stroke = "khaki";
        lightControl.style.fill = "khaki";
        lightControl.style.opacity = "1";
        darkControl.classList.replace("is-dark", "is-light");
        darkControl.style.backgroundColor = "#384a73";
        darkControl.style.fill = "orange";
        darkControl.style.opacity = "0.5";
        enforceLightDarkMode();
        enforceHilites();
    }
});

darkControl.addEventListener("mouseover", function() {
    if (darkControl.classList.contains("is-light")) {
        darkControl.style.opacity = "1";
    }
});
darkControl.addEventListener("mouseout", function() {
    if (darkControl.classList.contains("is-light")) {
        darkControl.style.opacity = "0.5";
    }
});
darkControl.addEventListener("click", function() {
    if (darkControl.classList.contains("is-light")) {
        darkControl.classList.replace("is-light", "is-dark");
        darkControl.style.backgroundColor = "steelblue";
        darkControl.style.fill = "khaki";
        darkControl.style.opacity = "1";
        lightControl.classList.replace("is-light", "is-dark");
        lightControl.style.backgroundColor = "#384a73";
        lightControl.style.stroke = "orange";
        lightControl.style.fill = "orange";
        lightControl.style.opacity = "0.5";
        enforceLightDarkMode();
        enforceHilites();
    }
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
    var columnSelectionValue2 = columnSelection2.value;
    var columnSelectionValue3 = columnSelection3.value;
    if (columnSelectionValue == "(None)") {
        // Enable all selections in the other column selection
        columnSelection2.childNodes.forEach(function(node) { node.disabled = false; });
        columnSelection3.childNodes.forEach(function(node) { node.disabled = false; });
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
        bgColorPicker1.disabled = true;
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
        bgColorPicker1.disabled = false;
        searchButton.disabled = false;
        searchButtonOutside.disabled = false;
        columnSelection2.childNodes.forEach(function(node) {
            if (![columnSelectionValue, columnSelectionValue3].includes(node.value)) {
                // Enable all options in the other search
                node.disabled = false;
            } else {
                // Disable the selected option in the other search
                node.disabled = true;
            }
        });
        columnSelection3.childNodes.forEach(function(node) {
            if (![columnSelectionValue, columnSelectionValue2].includes(node.value)) {
                node.disabled = false;
            } else {
                node.disabled = true;
            }
        });
    }
});

// ~~~ Color Pickers 1 ~~~
colorPicker1.addEventListener('change', function() {
    let newColor = colorPicker1.value;
    colorPickerDiv1.style.backgroundColor = newColor;
    var hilitedOnes = document.getElementsByClassName("hilite1");
    Array.from(hilitedOnes).forEach((el) => {
        el.style.color = newColor;
    });
});
colorPickerDiv1.style.backgroundColor = colorPicker1.value;

bgColorPicker1.addEventListener('change', function() {
    let newColor = bgColorPicker1.value;
    bgColorPickerDiv1.style.backgroundColor = newColor;
    var hilitedOnes = document.getElementsByClassName("hilite1");
    Array.from(hilitedOnes).forEach((el) => {
        el.style.backgroundColor = newColor; 
    });
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
    var columnSelectionValue = columnSelection.value;
    var columnSelectionValue2 = this.value;
    var columnSelectionValue3 = columnSelection3.value;
    if (columnSelectionValue2 == "(None)") {
        // Enable all selections in the other column selection
        columnSelection.childNodes.forEach(function(node) { node.disabled = false; });
        columnSelection3.childNodes.forEach(function(node) { node.disabled = false; });
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
        bgColorPicker2.disabled = true;
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
        bgColorPicker2.disabled = false;
        searchButton.disabled = false;
        columnSelection.childNodes.forEach(function(node) {
            if (![columnSelectionValue2, columnSelectionValue3].includes(node.value)) {
                // Enable all options in the other search
                node.disabled = false;
            } else {
                // Disable the selected option in the other search
                node.disabled = true;
            }
        });
        columnSelection3.childNodes.forEach(function(node) {
            if (![columnSelectionValue, columnSelectionValue2].includes(node.value)) {
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
    var hilitedTwos = document.getElementsByClassName("hilite2");
    Array.from(hilitedTwos).forEach((el) => {
        el.style.color = newColor;
    });
});
colorPickerDiv2.style.backgroundColor = colorPicker2.value;

bgColorPicker2.addEventListener('change', function() {
    let newColor = bgColorPicker2.value;
    bgColorPickerDiv2.style.backgroundColor = newColor;
    var hilitedTwos = document.getElementsByClassName("hilite2");
    Array.from(hilitedTwos).forEach((el) => {
        el.style.backgroundColor = newColor;
    });
});
bgColorPickerDiv2.style.backgroundColor = bgColorPicker2.value;


// ~~~~~~~~~~ SEARCH 3 ~~~~~~~~~~

// ~~~ Search Type 3 ~~~
// Selecting "Regex"... 
// - selects "Case-sensitive"
// - deselects and disables "Full word(s)"
regexSelection3.addEventListener('change', function() {
    if (this.checked) {
        caseSensitive3.checked = true;
        fullWords3.checked = false;
        fullWords3.disabled = true;
        matchWhere3.disabled = true;
    } else {
        caseSensitive3.checked = false;
        fullWords3.checked = true;
        fullWords3.disabled = false;
        matchWhere3.disabled = false;
    }
});

// ~~~ Concordance Cutoff 3 ~~~
concordanceDisplay3.addEventListener('change', function() {
    if (this.checked) {
        concordanceCutoff3.disabled = false;
    } else {
        concordanceCutoff3.disabled = true;
    }
});

// ~~~ Findall 3 ~~~
findall3.addEventListener('change', function() {
    if (this.checked) {
        concordanceDisplay3.checked = false;
        concordanceDisplay3.disabled = true;
        concordanceCutoff3.disabled = true;
        matchWhere3.value = "match-anywhere2";
        matchWhere3.disabled = true;
    } else {
        concordanceDisplay3.disabled = false;
        concordanceCutoff3.disabled = false;
        matchWhere3.disabled = false;
    }
});

// ~~~ Column Selection 3 ~~~
columnSelection3.addEventListener('change', function() {
    var columnSelectionValue = columnSelection.value;
    var columnSelectionValue2 = columnSelection2.value;
    var columnSelectionValue3 = this.value;
    if (columnSelectionValue3 == "(None)") {
        // Enable all selections in the other column selection
        columnSelection.childNodes.forEach(function(node) { node.disabled = false; });
        columnSelection2.childNodes.forEach(function(node) { node.disabled = false; });
        // Disable all selections
        searchInput3.value = "";
        searchInput3.disabled = true;
        regexSelection3.disabled = true;
        fullWords3.disabled = true;
        caseSensitive3.disabled = true;
        matchWhere3.disabled = true;
        findall3.disabled = true;
        concordanceDisplay3.disabled = true;
        concordanceCutoff3.disabled = true;
        colorPickerDiv3.style.opacity = "0.3";
        bgColorPickerDiv3.style.opacity = "0.3";
        colorPicker3.disabled = true;
        bgColorPicker3.disabled = true;
        if (columnSelection.value == "(None)") { searchButton.disabled = true; }
    } else {
        // Enable all selections
        searchInput3.disabled = false;
        regexSelection3.disabled = false;
        fullWords3.disabled = false;
        caseSensitive3.disabled = false;
        matchWhere3.disabled = false;
        findall3.disabled = false;
        concordanceDisplay3.disabled = false;
        if (concordanceDisplay3.checked) { concordanceCutoff3.disabled = false; }
        colorPickerDiv3.style.opacity = "1";
        bgColorPickerDiv3.style.opacity = "1";
        colorPicker3.disabled = false;
        bgColorPicker3.disabled = false;
        searchButton.disabled = false;
        columnSelection.childNodes.forEach(function(node) {
            if (![columnSelectionValue2, columnSelectionValue3].includes(node.value)) {
                // Enable all options in the other search
                node.disabled = false;
            } else {
                // Disable the selected option in the other search
                node.disabled = true;
            }
        });
        columnSelection2.childNodes.forEach(function(node) {
            if (![columnSelectionValue, columnSelectionValue3].includes(node.value)) {
                // Enable all options in the other search
                node.disabled = false;
            } else {
                // Disable the selected option in the other search
                node.disabled = true;
            }
        });
    }
});

// ~~~ Color Pickers 3 ~~~
colorPicker3.addEventListener('change', function() {
    let newColor = colorPicker3.value;
    colorPickerDiv3.style.backgroundColor = newColor;
    var hilitedThrees = document.getElementsByClassName("hilite3");
    Array.from(hilitedThrees).forEach((el) => {
        el.style.color = newColor;
    });
});
colorPickerDiv3.style.backgroundColor = colorPicker3.value;

bgColorPicker3.addEventListener('change', function() {
    let newColor = bgColorPicker3.value;
    bgColorPickerDiv3.style.backgroundColor = newColor;
    var hilitedThrees = document.getElementsByClassName("hilite3");
    Array.from(hilitedThrees).forEach((el) => {
        el.style.backgroundColor = newColor;
    });
});
bgColorPickerDiv3.style.backgroundColor = bgColorPicker3.value;
