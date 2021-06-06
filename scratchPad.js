

function padEachSearch(i, searchColumnIndex, matchedRows, newData) {
    let filterControl = document.getElementById(`filter-control-${i}`);
    let concordDisplay = document.getElementById(`concordance-display-${i}`);
    let searchInput = document.getElementById(`search-input-${i}`);
    let concordCutoff = document.getElementById(`concordance-cutoff-${i}`);
    if (!filterControl.checked && concordDisplay.checked && 
        searchInput.value !== "")
    {
        let concordStrings = matchedRows.map((j) => {
            return newData[j][searchColumnIndex]; 
        });
        concordStrings = padConcordance(concordStrings, i, concordCutoff);
        matchedRows.forEach((j) => {
            newData[j][searchColumnIndex] = concordStrings.shift();
        });
    }
}

function padResults(searchColumnIndex1, searchColumnIndex2, searchColumnIndex3,
                    matchedRows, newData) {
    if (matchedRows.length > 0) {
        padEachSearch("1", searchColumnIndex1, matchedRows, newData);
        padEachSearch("2", searchColumnIndex2, matchedRows, newData);
        padEachSearch("3", searchColumnIndex3, matchedRows, newData);
    }
}