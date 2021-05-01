const colors = {
    "light": {
        "fore": "#000000",          // black
        "back": "#b0c4de",          // lightsteelblue
        "thFore": "#2a3347",        // --banner-bg-color
        "thBack": "#b0c4de",        // lightsteelblue
        "thBorder": "#d3d3d3",      // lightgray
        "tdBack": "#ffffff",        // white
        "picker1": "#ff0000",       // red
        "picker2": "#0c5eec",       // medium blue
        "picker3": "#00FF7F",       // spring green
        "bgPicker": "#ffffff",      // white
    }, 
    "dark": {
        "fore": "#ffffff",          // white
        "back": "#363636",          // darker gray
        "thFore": "#b0c4de",        // lightsteelblue
        "thBack": "#363636",        // darker gray
        "thBorder": "#808080",      // gray
        "tdBack": "#444444",        // dark gray
        "picker1": "#ffff00",       // yellow
        "picker2": "#00ffff",       // cyan
        "picker3": "#ff00ff",       // magenta
        "bgPicker": "#444444",      // dark gray
    }
};

function makeResizable(div) {
    // TODO: Can improve to prevent non-party columns from auto-resizing
    //       when past point of being able to resize current column
    var position, thisColumn, nextColumn, thisWidth, nextWidth;

    var mousemoveListener = function(e) {
        var traveled = e.pageX - position;
        thisColumn.style.width = `${thisWidth + traveled}px`;
        nextColumn.style.width = `${nextWidth - traveled}px`; 
    };

    var mouseupListener = function() {
        document.getElementsByTagName("body")[0].style.cursor = "auto";
        document.removeEventListener('mousemove', mousemoveListener);
        document.removeEventListener('mouseup', mouseupListener);
    };

    div.addEventListener('mousedown', function (e) {
        e.preventDefault();
        document.getElementsByTagName("body")[0].style.cursor = "col-resize";
        position = e.pageX;
        thisColumn = div.parentElement;
        nextColumn = thisColumn.nextElementSibling;
        thisWidth = thisColumn.offsetWidth;
        nextWidth = nextColumn.offsetWidth;
        document.addEventListener('mousemove', mousemoveListener);
        document.addEventListener('mouseup', mouseupListener);
    });

}

function escapeHTML(string) {
    newstring = string.replace(RegExp(/&/, 'g'), '&amp;');
    newstring = newstring.replace(RegExp(/</, 'g'), '&lt;');
    newstring = newstring.replace(RegExp(/>/, 'g'), '&gt;');
    newstring = newstring.replace(RegExp(/\"/, 'g'), '&quot;');
    newstring = newstring.replace(RegExp(/\'/, 'g'), '&#39;');
    return newstring;
}

function unescapeHTML(string) {
    newstring = string.replace(RegExp(/&lt;/, 'g'), '<');
    newstring = newstring.replace(RegExp(/&gt;/, 'g'), '>');
    newstring = newstring.replace(RegExp(/&quot;/, 'g'), '"');
    newstring = newstring.replace(RegExp(/&#39;/, 'g'), "'");
    newstring = newstring.replace(RegExp(/&amp;/, 'g'), '&');
    return newstring;
}

function iterHtmlSafeReplace(string, re, tagOpen, tagClose) {
    var newString = '';
    var myArray;
    var prevIndex = 0;
    var prevMatchLength = 0;
    while ((myArray = re.exec(string)) !== null) {
        match = myArray[0];
        index = myArray.index;
        preMatch = string.slice(prevIndex + prevMatchLength, index);
        newString += `${escapeHTML(preMatch)}${tagOpen}${escapeHTML(match)}${tagClose}`;
        prevIndex = index;
        prevMatchLength = match.length;
    }
    newString += `${escapeHTML(string.slice(prevIndex + prevMatchLength, string.length))}`;
    return newString;
}

function fullwordBoundaries(pattern, searchInputValue) {
    var beginning = searchInputValue.match(/^\w/) ? "\\b" : "";
    var end = searchInputValue.match(/\w$/) ? "\\b" : "";
    return `${beginning}${pattern}${end}`;
}

function padConcordance(concordanceColumn, oneOrTwo, concordCutoffValue) {
    // concordCutoffValue: the number of char spaces to each side of the searched pattern
    let beforeRE;
    let hilitedRE;
    if (oneOrTwo == "one") {
        beforeRE = RegExp(/^(.*?)<text class='hilite1'>/);
        hilitedRE = RegExp(/<text class='hilite1'>.+?<\/text>/);
    } else if (oneOrTwo == "two") {
        beforeRE = RegExp(/^(.*?)<text class='hilite2'>/);
        hilitedRE = RegExp(/<text class='hilite2'>.+?<\/text>/);
    }
    let afterRE = RegExp(/.*?<\/text>(.*)$/);
    var beforeLengths = concordanceColumn.map((el) => {
        return unescapeHTML(beforeRE.exec(el).pop()).length;
    });
    var afterLengths = concordanceColumn.map((el) => {
        return unescapeHTML(afterRE.exec(el).pop()).length;
    });
    var maxBefore = beforeLengths.reduce((a, b) => { return Math.max(a, b); });
    var maxAfter = afterLengths.reduce((a, b) => { return Math.max(a, b); });
    var newColumn = Array();
    for (let i = 0; i < concordanceColumn.length; i++) {
        htmlOriginal = concordanceColumn[i];
        hilited = hilitedRE.exec(htmlOriginal);
        beforeHilited = unescapeHTML(htmlOriginal.slice(0, hilited.index));
        afterHilited = unescapeHTML(htmlOriginal.slice(
            hilited.index + hilited[0].length, htmlOriginal.length));
        var html = `${beforeHilited}${hilited[0]}${afterHilited}`;
        // var html = concordanceColumn[i];
        var sliceStartIndex = 0;
        var sliceEndIndex = html.length;
        var startCutoffDiff;  // number of &nbps; to add at the beginning
        var endCutoffDiff;  // number of &nbps; to add at the end
        var padStart;
        var padEnd;

        if (concordCutoffValue < maxBefore && concordCutoffValue > 0) {
            startCutoffDiff = concordCutoffValue - beforeLengths[i];
            if (startCutoffDiff < 0) { startCutoffDiff = 0; }               
            padStart = '&nbsp;'.repeat(startCutoffDiff);
            let cutIntoStart = (concordCutoffValue < beforeLengths[i]);
            if (concordCutoffValue < maxBefore) {
                if (cutIntoStart) {
                    padStart = padStart + '<text style="color:gray">&hellip;</text>';
                } else {
                    padStart = padStart + '&nbsp;';
                }
            } 
            if (cutIntoStart) {
                sliceStartIndex = beforeLengths[i] - concordCutoffValue;
            }
        } else {
            padStart = '&nbsp;'.repeat(maxBefore - beforeLengths[i]);
        }
        
        if (concordCutoffValue < maxAfter && concordCutoffValue > 0) {
            endCutoffDiff = concordCutoffValue - afterLengths[i];
            if (endCutoffDiff < 0) { endCutoffDiff = 0; }
            padEnd = '&nbsp;'.repeat(endCutoffDiff);
            let cutIntoEnd = (concordCutoffValue < afterLengths[i]);
            if (concordCutoffValue < maxAfter) {
                if (cutIntoEnd) {
                    padEnd = '<text style="color:gray">&hellip;</text>' + padEnd;
                } else {
                    padEnd = '&nbsp;' + padEnd;
                }
            }
            if (cutIntoEnd) {
                sliceEndIndex = sliceEndIndex - (afterLengths[i] - concordCutoffValue);
            }
        } else {
            padEnd = '&nbsp;'.repeat(maxAfter - afterLengths[i]);
        }
        
        newHtml = html.slice(sliceStartIndex, sliceEndIndex);
        hilited = hilitedRE.exec(newHtml);
        beforeHilited = escapeHTML(newHtml.slice(0, hilited.index));
        afterHilited = escapeHTML(newHtml.slice(
            hilited.index + hilited[0].length, newHtml.length));
        newColumn.push(`${padStart}${beforeHilited}${hilited[0]}${afterHilited}${padEnd}`);
    }
    return newColumn;
}

function sortRows(columnToSort, order) {
    rows = document.querySelectorAll('tr.sortable-row');
    // rows = d3.selectAll('tr.sortable-row');
    newRows = Array();
    Array.from(rows).forEach((row) => {
        newRow = Array.from(row.children);
        newRows.push(newRow);
    });
    newRows = newRows.sort((a, b) => {
        if (order == "ascending") {
            return a[columnToSort].__data__ > b[columnToSort].__data__;
        } else if (order == "descending") {
            return a[columnToSort].__data__ < b[columnToSort].__data__; 
        }
    });
    newRows = newRows.map((row, i) => {
        return row.map((item, j) => { 
            return (j == 0) ? String(i + 1) : item.__data__; 
        });
    });
    d3.selectAll('tr.sortable-row')
        .data(newRows)
        .selectAll('td')
            .data(function(d) { return d; })
            .html(function(d) { return `<pre>${d}</pre>`; });
    enforceHilites();
}

function enforceHilites() {
    var hilitedOnes = document.getElementsByClassName("hilite1");
    Array.from(hilitedOnes).forEach((el) => {
        el.style.color = colorPicker1.value;
        el.style.backgroundColor = bgColorPicker1.value;
    });
    var hilitedTwos = document.getElementsByClassName("hilite2");
    Array.from(hilitedTwos).forEach((el) => {
        el.style.color = colorPicker2.value;
        el.style.backgroundColor = bgColorPicker2.value;
    });
    var hilitedThrees = document.getElementsByClassName("hilite3");
    Array.from(hilitedThrees).forEach((el) => {
        el.style.color = colorPicker3.value;
        el.style.backgroundColor = bgColorPicker3.value;
    });
}

function enforceLightDarkMode() {
    isDark = darkControl.classList.contains("is-dark");
    document.body.style.backgroundColor = isDark ? colors.dark.back : colors.light.back;
    document.body.style.color = isDark ? colors.dark.fore : colors.light.fore;
    document.getElementById("results").style.color = isDark ? colors.dark.fore : colors.light.fore;
    sortableTH = document.getElementsByClassName("sortable");
    Array.from(sortableTH).forEach((th) => {
        th.style.backgroundColor = isDark ? colors.dark.thBack : colors.light.thBack;
        th.style.color = isDark ? colors.dark.thFore : colors.light.thFore;
        th.style.border = isDark ? `0.5px solid ${colors.dark.thBorder}` : `0.5px solid ${colors.light.thBorder}`;
    });
    resultsTD = document.getElementsByClassName("results-td");
    Array.from(resultsTD).forEach((cell) => {
        cell.style.backgroundColor = isDark ? colors.dark.tdBack : colors.light.tdBack;
        cell.style.color = isDark ? colors.dark.fore : colors.light.fore;
        cell.style.border = isDark? "0.5px solid gray" : "0.5px solid lightgray";
    });
    if (isDark) {
        // pickers 1
        if (colorPicker1.value == colors.light.picker1) {
            colorPicker1.value = colors.dark.picker1; 
            colorPickerDiv1.style.backgroundColor = colors.dark.picker1;
        }
        if (bgColorPicker1.value == colors.light.bgPicker) { 
            bgColorPicker1.value = colors.dark.bgPicker; 
            bgColorPickerDiv1.style.backgroundColor = colors.dark.bgPicker;
        }
        // pickers 2
        if (colorPicker2.value == colors.light.picker2) {
            colorPicker2.value = colors.dark.picker2; 
            colorPickerDiv2.style.backgroundColor = colors.dark.picker2;
        }
        if (bgColorPicker2.value == colors.light.bgPicker) { 
            bgColorPicker2.value = colors.dark.bgPicker; 
            bgColorPickerDiv2.style.backgroundColor = colors.dark.bgPicker;
        }
        // pickers 3
        if (colorPicker3.value == colors.light.picker3) {
            colorPicker3.value = colors.dark.picker3; 
            colorPickerDiv3.style.backgroundColor = colors.dark.picker3;
        }
        if (bgColorPicker3.value == colors.light.bgPicker) { 
            bgColorPicker3.value = colors.dark.bgPicker; 
            bgColorPickerDiv3.style.backgroundColor = colors.dark.bgPicker;
        }
    } else {
        // pickers 1
        if (colorPicker1.value == colors.dark.picker1) {
            colorPicker1.value = colors.light.picker1; 
            colorPickerDiv1.style.backgroundColor = colors.light.picker1;
        }
        if (bgColorPicker1.value == colors.dark.bgPicker) { 
            bgColorPicker1.value = colors.light.bgPicker; 
            bgColorPickerDiv1.style.backgroundColor = colors.light.bgPicker;
        }
        // pickers 2
        if (colorPicker2.value == colors.dark.picker2) {
            colorPicker2.value = colors.light.picker2; 
            colorPickerDiv2.style.backgroundColor = colors.light.picker2;
        }
        if (bgColorPicker2.value == colors.dark.bgPicker) { 
            bgColorPicker2.value = colors.light.bgPicker; 
            bgColorPickerDiv2.style.backgroundColor = colors.light.bgPicker;
        }
        // pickers 3
        if (colorPicker3.value == colors.dark.picker3) {
            colorPicker3.value = colors.light.picker3; 
            colorPickerDiv3.style.backgroundColor = colors.light.picker3;
        }
        if (bgColorPicker3.value == colors.dark.bgPicker) { 
            bgColorPicker3.value = colors.light.bgPicker; 
            bgColorPickerDiv3.style.backgroundColor = colors.light.bgPicker;
        }
    }
}
