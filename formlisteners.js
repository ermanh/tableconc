
// ~~~ Columns to display ~~~
columnHeaders.addEventListener('change', function() {
    if (chooseFile.value) { readFile(); }
    filterSelection1.innerHTML = "";
    filterSelection2.innerHTML = "";
    filterSelection3.innerHTML = "";
});

// ~~~ Hide Controls ~~~
hideControls.addEventListener('click', function() {
    if (controls.style.display != 'none') {
        controls.style.display = 'none';
    } else {
        controls.style.display = 'block';
    }
    
});
hideColumnControls.addEventListener('click', function() {
    if (columnControls.style.display != 'none') {
        columnControls.style.display = 'none';
    } else {
        columnControls.style.display = 'block';
    }
});

// ~~~ Second & Third Search Hiders ~~~
secondSearchHider.addEventListener('click', function() {
    if (secondSearch.style.display == "block") {
        secondSearch.style.display = "none";
        this.innerHTML = '<path d="M1,6 L11,6 M6,1 L6,11" />';
    } else {
        secondSearch.style.display = "block";
        this.innerHTML = '<path d="M1,6 L11,6" />';
    }
});
thirdSearchHider.addEventListener('click', function() {
    if (thirdSearch.style.display == "block") {
        thirdSearch.style.display = "none";
        this.innerHTML = '<path d="M1,6 L11,6 M6,1 L6,11" />';
    } else {
        thirdSearch.style.display = "block";
        this.innerHTML = '<path d="M1,6 L11,6" />';
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

// ~~~ Filter Control 1 ~~~
filterControl1.addEventListener('change', function() {
    if (this.checked) {
        searchRow1.style.display = "none";
        filterRow1.style.display = "inline-block";
        if (columnSelection1.innerHTML !== "") { populateFilterValues("1"); }
    } else {
        searchRow1.style.display = "block";
        filterRow1.style.display = "none";
    }
});

// ~~~ Search Type 1 ~~~
// Selecting "Regex"... 
// - selects "Case-sensitive"
// - deselects and disables "Full word(s)"
regexSelection1.addEventListener('change', function() {
    if (this.checked) {
        caseSensitive1.checked = true;
        fullWords1.checked = false;
        fullWords1.disabled = true;
        matchWhere1.disabled = true;
    } else {
        caseSensitive1.checked = false;
        fullWords1.checked = true;
        fullWords1.disabled = false;
        matchWhere1.disabled = false;
    }
});

// ~~~ Concordance Cutoff 1 ~~~
concordanceDisplay1.addEventListener('change', function() {
    if (this.checked) {
        concordanceCutoff1.disabled = false;
    } else {
        concordanceCutoff1.disabled = true;
    }
});

// ~~~ Findall 1 ~~~
findall1.addEventListener('change', function() {
    if (this.checked) {
        concordanceDisplay1.checked = false;
        concordanceDisplay1.disabled = true;
        concordanceCutoff1.disabled = true;
        matchWhere1.value = 'match-anywhere-1';
        matchWhere1.disabled = true;
    } else {
        concordanceDisplay1.disabled = false;
        concordanceCutoff1.disabled = false;
        matchWhere1.disabled = false;
    }
});

// ~~~ Column Selection 1 ~~~
columnSelection1.addEventListener('change', function() {
    var columnSelectionValue1 = this.value;
    var columnSelectionValue2 = columnSelection2.value;
    var columnSelectionValue3 = columnSelection3.value;
    if (columnSelectionValue1 == "(none)") {
        // Enable all selections in the other column selection
        columnSelection2.childNodes.forEach(node => { node.disabled = false; });
        columnSelection3.childNodes.forEach(node => { node.disabled = false; });
        // Clear filter values
        filterSelection1.innerHTML = "";
        // Disable all selections
        searchInput1.value = "";
        searchInput1.disabled = true;
        regexSelection1.disabled = true;
        fullWords1.disabled = true;
        caseSensitive1.disabled = true;
        matchWhere1.disabled = true;
        findall1.disabled = true;
        concordanceDisplay1.disabled = true;
        concordanceCutoff1.disabled = true;
        colorPickerDiv1.style.opacity = "0.3";
        bgColorPickerDiv1.style.opacity = "0.3";
        colorPicker1.disabled = true;
        bgColorPicker1.disabled = true;
        if (columnSelection2.value == "(none)") { searchButton.disabled = true; }
    } else {
        // Populate filter values if "Filter by value" checked
        if (filterControl1.checked) { populateFilterValues("1"); }
        // Enable all selections
        searchInput1.disabled = false;
        regexSelection1.disabled = false;
        fullWords1.disabled = false;
        caseSensitive1.disabled = false;
        matchWhere1.disabled = false;
        findall1.disabled = false;
        concordanceDisplay1.disabled = false;
        if (concordanceDisplay1.checked) { concordanceCutoff1.disabled = false; }
        colorPickerDiv1.style.opacity = "1";
        bgColorPickerDiv1.style.opacity = "1";
        colorPicker1.disabled = false;
        bgColorPicker1.disabled = false;
        searchButton.disabled = false;
        columnSelection2.childNodes.forEach(function(node) {
            if (![columnSelectionValue1, columnSelectionValue3].includes(node.value)) {
                // Enable all options in the other search
                node.disabled = false;
            } else {
                // Disable the selected option in the other search
                node.disabled = true;
            }
        });
        columnSelection3.childNodes.forEach(function(node) {
            if (![columnSelectionValue1, columnSelectionValue2].includes(node.value)) {
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

// ~~~ Filter Control 2 ~~~
filterControl2.addEventListener('change', function() {
    if (this.checked) {
        searchRow2.style.display = "none";
        filterRow2.style.display = "inline-block";
        if (columnSelection2.innerHTML !== "") { populateFilterValues("2"); }
    } else {
        searchRow2.style.display = "block";
        filterRow2.style.display = "none";
    }
});

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
        matchWhere2.value = "match-anywhere-2";
        matchWhere2.disabled = true;
    } else {
        concordanceDisplay2.disabled = false;
        concordanceCutoff2.disabled = false;
        matchWhere2.disabled = false;
    }
});

// ~~~ Column Selection 2 ~~~
columnSelection2.addEventListener('change', function() {
    var columnSelectionValue1 = columnSelection1.value;
    var columnSelectionValue2 = this.value;
    var columnSelectionValue3 = columnSelection3.value;
    if (columnSelectionValue2 == "(none)") {
        // Enable all selections in the other column selection
        columnSelection1.childNodes.forEach(node => { node.disabled = false; });
        columnSelection3.childNodes.forEach(node => { node.disabled = false; });
        // Clear filter values
        filterSelection2.innerHTML = "";
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
        if (columnSelection1.value == "(none)") { searchButton.disabled = true; }
    } else {
        // Populate filter values if "Filter by value" checked
        if (filterControl2.checked) { populateFilterValues("2"); }
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
        columnSelection1.childNodes.forEach(function(node) {
            if (![columnSelectionValue2, columnSelectionValue3].includes(node.value)) {
                // Enable all options in the other search
                node.disabled = false;
            } else {
                // Disable the selected option in the other search
                node.disabled = true;
            }
        });
        columnSelection3.childNodes.forEach(function(node) {
            if (![columnSelectionValue1, columnSelectionValue2].includes(node.value)) {
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
    secondSearchHider.style.stroke = newColor;
});
colorPickerDiv2.style.backgroundColor = colorPicker2.value;

bgColorPicker2.addEventListener('change', function() {
    let newColor = bgColorPicker2.value;
    bgColorPickerDiv2.style.backgroundColor = newColor;
    var hilitedTwos = document.getElementsByClassName("hilite2");
    Array.from(hilitedTwos).forEach((el) => {
        el.style.backgroundColor = newColor;
    });
    secondSearchHider.style.backgroundColor = newColor;
});
bgColorPickerDiv2.style.backgroundColor = bgColorPicker2.value;


// ~~~~~~~~~~ SEARCH 3 ~~~~~~~~~~

// ~~~ Filter Control 3 ~~~
filterControl3.addEventListener('change', function() {
    if (this.checked) {
        searchRow3.style.display = "none";
        filterRow3.style.display = "inline-block";
        if (columnSelection3.innerHTML !== "") { populateFilterValues("3"); }
    } else {
        searchRow3.style.display = "block";
        filterRow3.style.display = "none";
    }
});

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
        matchWhere3.value = "match-anywhere-3";
        matchWhere3.disabled = true;
    } else {
        concordanceDisplay3.disabled = false;
        concordanceCutoff3.disabled = false;
        matchWhere3.disabled = false;
    }
});

// ~~~ Column Selection 3 ~~~
columnSelection3.addEventListener('change', function() {
    var columnSelectionValue1 = columnSelection1.value;
    var columnSelectionValue2 = columnSelection2.value;
    var columnSelectionValue3 = this.value;
    if (columnSelectionValue3 == "(none)") {
        // Enable all selections in the other column selection
        columnSelection1.childNodes.forEach(node => { node.disabled = false; });
        columnSelection2.childNodes.forEach(node => { node.disabled = false; });
        // Clear filter values
        filterSelection3.innerHTML = "";
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
        if (columnSelection1.value == "(none)") { searchButton.disabled = true; }
    } else {
        // Populate filter values if "Filter by value" checked
        if (filterControl3.checked) { populateFilterValues("3"); }
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
        columnSelection1.childNodes.forEach(function(node) {
            if (![columnSelectionValue2, columnSelectionValue3].includes(node.value)) {
                // Enable all options in the other search
                node.disabled = false;
            } else {
                // Disable the selected option in the other search
                node.disabled = true;
            }
        });
        columnSelection2.childNodes.forEach(function(node) {
            if (![columnSelectionValue1, columnSelectionValue3].includes(node.value)) {
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
    Array.from(hilitedThrees).forEach(el => { 
        el.style.color = newColor; 
    });
    thirdSearchHider.style.stroke = newColor;
});
colorPickerDiv3.style.backgroundColor = colorPicker3.value;

bgColorPicker3.addEventListener('change', function() {
    let newColor = bgColorPicker3.value;
    bgColorPickerDiv3.style.backgroundColor = newColor;
    var hilitedThrees = document.getElementsByClassName("hilite3");
    Array.from(hilitedThrees).forEach(el => { 
        el.style.backgroundColor = newColor;
    });
    thirdSearchHider.style.backgroundColor = newColor;
});
bgColorPickerDiv3.style.backgroundColor = bgColorPicker3.value;


// ~~~ Showing controls ~~~
const updatePageView = () => {
    if (resultsTable.innerHTML !== "") {
        let showStart = Number(showingStart.value);
        let showEnd = showStart + Number(showRows.value) - 1;
        if (showEnd > matchedData.length && matchedData.length > 0) { 
            showEnd = matchedData.length; 
        }
        showingEnd.textContent = String(showEnd);
        insertResults(matchedData.slice(showStart - 1, showEnd));
    }
};

showingStart.addEventListener("keypress", function(e) {
    if (!/^\d$/.test(e.key)) { e.preventDefault(); } 
});
showingStart.addEventListener("focusout", function() {
    value = Number(showingStart.value);
    if (value <= 0) {
        showingStart.value = 1;
    } else {
        if (resultsNumber.textContent !== "" && 
            value > Number(resultsNumber.textContent)) 
        {
            showingStart.value = resultsNumber.textContent;
        }
    }
});
showingStart.addEventListener('input', () => {
    previousPage.disabled = (Number(showingStart.value) <= 1) ? true : false;
    updatePageView();
});

showRows.addEventListener("keypress", function(e) {
    if (!/^\d$/.test(e.key)) { e.preventDefault(); }
});
showRows.addEventListener("focusout", function() {
    value = Number(showRows.value);
    if (value > 5000) { 
        showRows.value = "5000"; 
    } else if (value <= 0) {
        showRows.value = "1";
    }
});
showRows.addEventListener('input', () => {
    nextPage.disabled = (Number(showingStart.value) + Number(showRows.value) >=
        matchedData.length) || 
        (Number(showingEnd.textContent) >= matchedData.length);
    updatePageView();
});

// MutationObserver for showingEnd
const showingEndConfig = { 
    characterData: false, attributes: false, childList: true, subtree: false };
const showingEndCallback = (mutations, observer) => {
    nextPage.disabled = Number(showingEnd.textContent) >= matchedData.length;
};
const showingEndObserver = new MutationObserver(showingEndCallback);
showingEndObserver.observe(showingEnd, showingEndConfig);

previousPage.addEventListener('click', () => {
    let underThreshold = Number(showingStart.value) - Number(showRows.value) < 1;
    let showStart = underThreshold ? 
        1 : Number(showingStart.value) - Number(showRows.value);
    let aboveThreshold = showStart + Number(showRows.value) > matchedData.length;
    let showEnd = aboveThreshold ? 
        matchedData.length : showStart + Number(showRows.value) - 1;
    showingStart.value = String(showStart);
    showingEnd.textContent = String(showEnd);
    insertResults(matchedData.slice(showStart - 1, showEnd));

    previousPage.disabled = showStart <= 1;
    nextPage.disabled = showEnd >= matchedData.length;
});
nextPage.addEventListener('click', () => {
    let showStart = Number(showingStart.value) + Number(showRows.value);
    let showEnd = showStart + Number(showRows.value) - 1;
    if (showStart > matchedData.length) { 
        showStart = matchedData.length;
    }
    if (showEnd > matchedData.length) {
        showEnd = matchedData.length;
    }
    showingStart.value = String(showStart);
    showingEnd.textContent = String(showEnd);
    insertResults(matchedData.slice(showStart - 1, showEnd));

    previousPage.disabled = showStart <= 1;
    nextPage.disabled = showEnd >= matchedData.length;
});



