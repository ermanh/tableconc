function padConcordance(concordanceColumn, redOrBlue, concordCutoffValue) {
    let beforeRE;
    if (redOrBlue == "red") {
        beforeRE = RegExp(/^(.*?)<text style='color:darkred;'>/);
    } else if (redOrBlue == "blue") {
        beforeRE = RegExp(/^(.*?)<text style='color:blue;'>/);
    }
    let afterRE = RegExp(/.*?<\/text>(.+)$/);
    var beforeLengths = concordanceColumn.map((el) => {
        return beforeRE.exec(el).pop().length;
    });
    var afterLengths = concordanceColumn.map((el) => {
        return afterRE.exec(el).pop().length;
    });
    var maxBefore = beforeLengths.reduce((a, b) => { return Math.max(a, b); });
    var maxAfter = afterLengths.reduce((a, b) => { return Math.max(a, b); });
    var newColumn = Array();
    for (let i = 0; i < concordanceColumn.length; i++) {
        var html = concordanceColumn[i];
        var sliceStartIndex = 0;
        var sliceEndIndex = html.length;
        var startCutoffDiff;
        var endCutoffDiff;
        var padStart;
        var padEnd;

        if (concordCutoffValue < maxBefore && concordCutoffValue > 0) {
            startCutoffDiff = maxBefore - concordCutoffValue;
            if (concordCutoffValue > beforeLengths[i]) { 
                startCutoffDiff = startCutoffDiff + (concordCutoffValue - beforeLengths[i]);
            }
            if (startCutoffDiff < 0) { startCutoffDiff = 0; }
            padStart = '&nbsp;'.repeat(startCutoffDiff);
            let cutIntoStart = (beforeLengths[i] > (maxBefore - concordCutoffValue));
            if (concordCutoffValue < maxBefore) {
                if (cutIntoStart) {
                    padStart = padStart + '...';
                } else {
                    padStart = padStart + '&nbsp;'.repeat(3);
                }
            } 
            if (cutIntoStart) {
                sliceStartIndex = maxBefore - concordCutoffValue;
            }
        } else {
            padStart = '&nbsp;'.repeat(maxBefore - beforeLengths[i]);
        }
        
        if (concordCutoffValue < maxAfter && concordCutoffValue > 0) {
            endCutoffDiff = maxAfter - concordCutoffValue;
            padEnd = '&nbsp;'.repeat(endCutoffDiff);
            let cutIntoEnd = (concordCutoffValue < afterLengths[i]);
            if (concordCutoffValue < maxAfter) {
                if (cutIntoEnd) {
                    padEnd = '...' + padEnd;
                } else {
                    padEnd = '&nbsp;'.repeat(3) + padEnd;
                }
            }
            if (cutIntoEnd) {
                sliceEndIndex = sliceEndIndex - (afterLengths[i] - concordCutoffValue);
            }
        } else {
            padEnd = '&nbsp;'.repeat(maxAfter - afterLengths[i]);
        }
        
        newHtml = html.slice(sliceStartIndex, sliceEndIndex);
        newColumn.push(`${padStart}${newHtml}${padEnd}`);
    }
    return newColumn;
}