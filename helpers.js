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

function padConcordance(concordanceColumn, redOrBlue, concordCutoffValue) {
    // concordCutoffValue: the number of char spaces to each side of the searched pattern
    let beforeRE;
    let hilitedRE;
    if (redOrBlue == "red") {
        beforeRE = RegExp(/^(.*?)<text style='color:darkred;'>/);
        hilitedRE = RegExp(/<text style='color:darkred;'>.+?<\/text>/);
    } else if (redOrBlue == "blue") {
        beforeRE = RegExp(/^(.*?)<text style='color:blue;'>/);
        hilitedRE = RegExp(/<text style='color:blue;'>.+?<\/text>/);
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

        console.log('=== padConcordance ===');
        console.log('html', html);
        console.log('newHtml', newHtml);
        console.log(`${beforeHilited}${hilited[0]}${afterHilited}`);
        console.log('padStart', padStart);
        console.log('padEnd', padEnd);
        // console.log();
    }
    return newColumn;
}
