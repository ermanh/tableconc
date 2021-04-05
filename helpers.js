function padConcordance(concordanceColumn) {
    let beforeRE = RegExp(/^(.*?)<text style='color:darkred;'>/);
    let afterRE = RegExp(/.*?<\/text>(.+)$/);
    var beforeLengths = concordanceColumn.map((el) => {
        return beforeRE.exec(el).pop().length;
    });
    var afterLengths = concordanceColumn.map((el) => {
        return afterRE.exec(el).pop().length;
    });
    console.log(JSON.stringify(beforeLengths));
    console.log(JSON.stringify(afterLengths));
    var maxBefore = Math.max(beforeLengths);
    var maxAfter = Math.max(afterLengths);
    var newColumn = Array();
    for (let i = 0; i < concordanceColumn.length; i++) {
        padStart = '&nbsp;'.repeat(maxBefore - beforeLengths[i]);
        padEnd = '&nbsp;'.repeat(maxAfter - afterLengths[i]);
        newColumn.push(`${padStart}${concordanceColumn[i]}${padEnd}`);
    }
    return newColumn;
};