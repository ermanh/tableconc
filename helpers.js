function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function columnNamesHaveDuplicates(columnNames) {
    let columnNamesSet = new Set();
    columnNames.forEach((name) => columnNamesSet.add(name));
    return columnNamesSet.size !== columnNames.length;
}

function renameColumnNames(columnNames) {
    let newColumnNames = Array();
    let dictionary = {};
    columnNames.forEach((name) => {
        let newName = name;
        if (RegExp(/^\s*$/).exec(newName)) { newName = "Unnamed"; }
        if (!dictionary[newName]) {
            dictionary[newName] = 1;
            newColumnNames.push(newName);
        } else {
            dictionary[newName] += 1;
            newColumnNames.push(`${newName} (${dictionary[newName]})`);
        }
    });
    return newColumnNames;
}

function populateFilterValues(whichFilter, minQuantity) {
    let filterValueMaxLength = 200;
    var columnValue = document.getElementById(
        `column-selection-${whichFilter}`).value;
    if (columnValue == "(none)") { return null; }

    var columnIndex;
    if (columnHeaders.checked) {
        var columnObject = {};  // {column name: index}
        for (let i = 0; i < data[0].length; i++) { 
            columnObject[data[0][i]] = i; 
        }
        columnIndex = columnObject[columnValue];
    } else {
        columnIndex = RegExp(/\d+/).exec(columnValue)[0] - 1;
    }

    var startingRowIndex = columnHeaders.checked ? 1 : 0;
    var valueCount = {};
    for (i = startingRowIndex; i < data.length; i++) {
        let datum = data[i][columnIndex];
        if (Object.keys(valueCount).includes(datum)) {
            valueCount[datum] += 1;
        } else {
            valueCount[datum] = 1;
        }
    }
    var values = Object.keys(valueCount).sort((a, b) => { 
        return a.toLowerCase() > b.toLowerCase(); 
    });
    values = values.filter((value) => valueCount[value] >= Number(minQuantity));

    var filterSelection = d3.select(`#filter-selection-${whichFilter}`);
    filterSelection.html(""); // clear menu
    filterSelection.selectAll("option")
        .data(values).enter()
        .append("option")
        .attr("value", (d) => d)
        .text((d) => {
            if (d.length > filterValueMaxLength) {
            return `${d.slice(0,filterValueMaxLength)}&hellip; ` +
                `(${valueCount[d]})`;
            }
            if (d === "") { return `(empty) (${valueCount[d]})`; } 
            return `${d} (${valueCount[d]})`; 
        });
}

function makeResizable(div, adjacentIsRight) {
    var position, thisColumn, adjacentColumn, thisWidth, adjacentWidth;

    var mousemoveListener = (e) => {
        var traveled = adjacentIsRight ? 
            e.pageX - position : 
            position - e.pageX;
        thisColumn.style.width = `${thisWidth + traveled}px`;
        adjacentColumn.style.width = `${adjacentWidth - traveled}px`; 
    };

    var mouseupListener = () => {
        document.getElementsByTagName("body")[0].style.cursor = "auto";
        document.removeEventListener('mousemove', mousemoveListener);
        document.removeEventListener('mouseup', mouseupListener);
    };

    div.addEventListener('mousedown', (e) => {
        e.preventDefault();
        document.getElementsByTagName("body")[0].style.cursor = "col-resize";
        position = e.pageX;
        thisColumn = div.parentElement;
        adjacentColumn = adjacentIsRight ? 
            thisColumn.nextElementSibling : 
            thisColumn.previousElementSibling;
        thisWidth = thisColumn.offsetWidth;
        adjacentWidth = adjacentColumn.offsetWidth;
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
        newString += `${escapeHTML(preMatch)}` +
                     `${tagOpen}${escapeHTML(match)}${tagClose}`;
        prevIndex = index;
        prevMatchLength = match.length;
    }
    newString += escapeHTML(
        string.slice(prevIndex + prevMatchLength, string.length));
    return newString;
}

function fullwordBoundaries(pattern, searchInputValue) {
    var beginning = searchInputValue.match(/^\w/) ? "\\b" : "";
    var end = searchInputValue.match(/\w$/) ? "\\b" : "";
    return `${beginning}${pattern}${end}`;
}

function padConcordance(concordanceColumn, oneTwoOrThree, concordCutoffValue) {
    // concordCutoffValue: no. of spaces to each side of the searched pattern
    let beforeRE;
    let hilitedRE;
    if (oneTwoOrThree == "one") {
        beforeRE = RegExp(/^(.*?)<text class='hilite1'>/);
        hilitedRE = RegExp(/<text class='hilite1'>.+?<\/text>/);
    } else if (oneTwoOrThree == "two") {
        beforeRE = RegExp(/^(.*?)<text class='hilite2'>/);
        hilitedRE = RegExp(/<text class='hilite2'>.+?<\/text>/);
    } else if (oneTwoOrThree == "three") {
        beforeRE = RegExp(/^(.*?)<text class='hilite3'>/);
        hilitedRE = RegExp(/<text class='hilite3'>.+?<\/text>/);
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
        var sliceStartIndex = 0;
        var sliceEndIndex = html.length;
        var startCutoffDiff;  // number of &nbps; to add at the beginning
        var endCutoffDiff;  // number of &nbps; to add at the end
        var padStart;
        var padEnd;
        var ellipsisHTML = '<text style="color:gray">&hellip;</text>';
        var ellipsisRegExp = RegExp(escapeRegExp(ellipsisHTML));

        if (concordCutoffValue < maxBefore && concordCutoffValue > 0) {
            startCutoffDiff = concordCutoffValue - beforeLengths[i];
            if (startCutoffDiff < 0) { startCutoffDiff = 0; }               
            padStart = '&nbsp;'.repeat(startCutoffDiff);
            let cutIntoStart = (concordCutoffValue < beforeLengths[i]);
            if (concordCutoffValue < maxBefore) {
                padStart = cutIntoStart ? 
                    padStart + ellipsisHTML : padStart + '&nbsp;';
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
                padEnd = cutIntoEnd ?
                    ellipsisHTML + padEnd : '&nbsp;' + padEnd;
            }
            if (cutIntoEnd) {
                sliceEndIndex -= (afterLengths[i] - concordCutoffValue);
            }
        } else {
            padEnd = '&nbsp;'.repeat(maxAfter - afterLengths[i]);
        }
        
        // Add breaking space
        if (ellipsisRegExp.exec(padStart)) {
            padStart = padStart.replace(ellipsisRegExp, " " + ellipsisHTML);
        } else {
            padStart += " "; 
        }
        if (ellipsisRegExp.exec(padEnd)) {
            padEnd = padEnd.replace(ellipsisRegExp, ellipsisHTML + " ");
        } else {
            padEnd = " &nbsp;" + padEnd; 
        }

        newHtml = html.slice(sliceStartIndex, sliceEndIndex);
        hilited = hilitedRE.exec(newHtml);
        beforeHilited = escapeHTML(newHtml.slice(0, hilited.index));
        afterHilited = escapeHTML(newHtml.slice(
            hilited.index + hilited[0].length, newHtml.length));
        newColumn.push(`${padStart}${beforeHilited}${hilited[0]}` + 
                       `${afterHilited}${padEnd}`);
    }
    return newColumn;
}

function sortRows(columnToSort, order) {
    rows = document.querySelectorAll('tr.sortable-row');
    newRows = Array();
    Array.from(rows).forEach((row) => {
        newRow = Array.from(row.children);
        newRows.push(newRow);
    });
    console.log(JSON.stringify(newRows));
    newRows = newRows.sort((a, b) => {
        let aString = a[columnToSort].__data__;
        let bString = b[columnToSort].__data__;
        if (order == "ascending") {
            return aString.localeCompare(bString);
        } else if (order == "descending") {
            return bString.localeCompare(aString);
        }
    });
    console.log(JSON.stringify(newRows));
    newRows = newRows.map((row, i) => {
        return row.map((item, j) => { 
            return (j == 0) ? String(i + 1) : item.__data__; 
        });
    });
    d3.selectAll('tr.sortable-row')
        .data(newRows)
        .selectAll('td')
            .data((d) => d)
            .html((d) => `<pre>${d}</pre>`);
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
    document.body.style.backgroundColor = isDark ? 
        colors.dark.back : colors.light.back;
    document.body.style.color = isDark ? colors.dark.fore : colors.light.fore;
    resultsDiv.style.color = isDark ? colors.dark.fore : colors.light.fore;
    resultsHeader.style.color = isDark ? "#b8ffff" : "#0047ab";
    resultsHeader.style.backgroundColor = isDark ? 
        colors.dark.back : colors.light.back;
    resultsHeader.style.borderBottom = isDark ? 
        "1px solid gray" : "1px solid white";
    
    sortableTH = document.getElementsByClassName("sortable");
    Array.from(sortableTH).forEach((th) => {
        th.style.backgroundColor = isDark ? 
            colors.dark.thBack : colors.light.thBack;
        th.style.color = isDark ? 
            colors.dark.thFore : colors.light.thFore;
        th.style.border = isDark ? 
            `2px solid ${colors.dark.thBorder}` : 
            `1px solid ${colors.light.thBorder}`;
    });
    resultsTD = document.getElementsByClassName("results-td");
    Array.from(resultsTD).forEach((cell) => {
        cell.style.backgroundColor = isDark ? 
            colors.dark.tdBack : colors.light.tdBack;
        cell.style.color = isDark ? 
            colors.dark.fore : colors.light.fore;
        cell.style.border = isDark? 
            "0.5px solid gray" : "0.5px solid lightgray";
    });
    if (isDark) {
        // pickers 1
        if (colorPicker1.value == colors.light.picker1) {
            colorPicker1.value = colors.dark.picker1; 
            colorPickerDiv1.style.backgroundColor = colors.dark.picker1;
        }
        if (bgColorPicker1.value == colors.light.bgPicker1) { 
            bgColorPicker1.value = colors.dark.bgPicker1; 
            bgColorPickerDiv1.style.backgroundColor = colors.dark.bgPicker1;
        }
        // pickers 2, second search hider
        if (colorPicker2.value == colors.light.picker2) {
            colorPicker2.value = colors.dark.picker2; 
            colorPickerDiv2.style.backgroundColor = colors.dark.picker2;
            secondSearchHider.style.stroke = colors.dark.picker2;
        }
        if (bgColorPicker2.value == colors.light.bgPicker2) { 
            bgColorPicker2.value = colors.dark.bgPicker2; 
            bgColorPickerDiv2.style.backgroundColor = colors.dark.bgPicker2;
            secondSearchHider.style.backgroundColor = colors.dark.bgPicker2;
        }
        // pickers 3, third search hider
        if (colorPicker3.value == colors.light.picker3) {
            colorPicker3.value = colors.dark.picker3; 
            colorPickerDiv3.style.backgroundColor = colors.dark.picker3;
            thirdSearchHider.style.stroke = colors.dark.picker3;
        }
        if (bgColorPicker3.value == colors.light.bgPicker3) { 
            bgColorPicker3.value = colors.dark.bgPicker3; 
            bgColorPickerDiv3.style.backgroundColor = colors.dark.bgPicker3;
            thirdSearchHider.style.backgroundColor = colors.dark.bgPicker3;
        }
    } else {
        // pickers 1
        if (colorPicker1.value == colors.dark.picker1) {
            colorPicker1.value = colors.light.picker1; 
            colorPickerDiv1.style.backgroundColor = colors.light.picker1;
        }
        if (bgColorPicker1.value == colors.dark.bgPicker1) { 
            bgColorPicker1.value = colors.light.bgPicker1; 
            bgColorPickerDiv1.style.backgroundColor = colors.light.bgPicker1;
        }
        // pickers 2, second search hider
        if (colorPicker2.value == colors.dark.picker2) {
            colorPicker2.value = colors.light.picker2; 
            colorPickerDiv2.style.backgroundColor = colors.light.picker2;
            secondSearchHider.style.stroke = colors.light.picker2;
        }
        if (bgColorPicker2.value == colors.dark.bgPicker2) { 
            bgColorPicker2.value = colors.light.bgPicker2; 
            bgColorPickerDiv2.style.backgroundColor = colors.light.bgPicker2;
            secondSearchHider.style.backgroundColor = colors.light.bgPicker2;
        }
        // pickers 3, third search hider
        if (colorPicker3.value == colors.dark.picker3) {
            colorPicker3.value = colors.light.picker3;
            colorPickerDiv3.style.backgroundColor = colors.light.picker3;
            thirdSearchHider.style.stroke = colors.light.picker3;
        }
        if (bgColorPicker3.value == colors.dark.bgPicker3) { 
            bgColorPicker3.value = colors.light.bgPicker3; 
            bgColorPickerDiv3.style.backgroundColor = colors.light.bgPicker3;
            thirdSearchHider.style.backgroundColor = colors.light.bgPicker3;
        }
    }
}

