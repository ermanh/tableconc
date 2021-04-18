function padConcordance(concordanceColumn, redOrBlue, concordCutoffValue) {
    // concordCutoffValue: the number of char spaces to each side of the searched pattern
    let beforeRE;
    if (redOrBlue == "red") {
        beforeRE = RegExp(/^(.*?)<text style='color:darkred;'>/);
    } else if (redOrBlue == "blue") {
        beforeRE = RegExp(/^(.*?)<text style='color:blue;'>/);
    }
    let afterRE = RegExp(/.*?<\/text>(.*)$/);
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
        newColumn.push(`${padStart}${newHtml}${padEnd}`);
    }
    return newColumn;
}

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
        document.removeEventListener('mousemove', mousemoveListener);
        document.removeEventListener('mouseup', mouseupListener);
    };

    div.addEventListener('mousedown', function (e) {
        e.preventDefault();
        position = e.pageX;
        thisColumn = div.parentElement;
        nextColumn = thisColumn.nextElementSibling;
        thisWidth = thisColumn.offsetWidth;
        nextWidth = nextColumn.offsetWidth;
        document.addEventListener('mousemove', mousemoveListener);
        document.addEventListener('mouseup', mouseupListener);
    });

}