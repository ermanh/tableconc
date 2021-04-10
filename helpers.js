function padConcordance(concordanceColumn, redOrBlue) {
    console.log(JSON.stringify(concordanceColumn));
    // TODO: need to limit padding length (for strings that are absolutely too long)
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
        var padStart = '&nbsp;'.repeat(maxBefore - beforeLengths[i]);
        var padEnd = '&nbsp;'.repeat(maxAfter - afterLengths[i]);
        newColumn.push(`${padStart}${concordanceColumn[i]}${padEnd}`);
    }
    return newColumn;
}