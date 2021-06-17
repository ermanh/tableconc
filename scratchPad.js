function determineThInnerHTML(d, i, totalColumns, concordanceColumns) {
    // TODO: Add argument for the concordance column
    let isFinalColumn = (i == totalColumns - 1);
    let resizerLeft = `<div class="resize-left"></div>`;
    let taggedData = `<pre>${d}</pre>`;
    let sorter = `<div class="sort" id="i${i}">&equiv;</div>`;
    if (concordanceColumns.includes(i)) {
        sorter += `<input id="concord-column-sort-${i}" 
                    type="number" value="-1" max="10" min="-10">`;
    }
    let resizerRight = `<div class="resize-right"></div>`;

    if (i > 2) {
        return (isFinalColumn) ?
            `${resizerLeft}${taggedData}${sorter}` :
            `${resizerLeft}${taggedData}${sorter}${resizerRight}`;
    } else if (i == 2) {
        return (isFinalColumn) ? 
            `${taggedData}${sorter}` :
            `${taggedData}${sorter}${resizerRight}`;
    } else if (i == 1) {  // return sorter for original-index column
        return `<div class="sort line-number" id="i${i}">&#x25B2;</div>`;
    } else if (i == 0) {  // return text aligner
        return `<svg id="text-align-control" class="align-left" 
                 height="13", width="15">
                    <path d="M0,3 L8,3 M0,6 L13,6 M0,9 L8,9 M0,12 L13,12"/>
                </svg>`;
    }
}

function insertColumnHeaders(columnsToDisplay, concordanceColumns) {
    resultsTable.innerHTML = "";
    resultsTableD3.append("tr")
        .attr("id", "sticky")
        .selectAll("th")
        .data(columnsToDisplay).enter()
        .append("th")
        .attr("class", (d, i) => determineThClasses(i))
        .html((d, i) => determineThInnerHTML(d, i, columnsToDisplay.length,
                                             concordanceColumns));
}

function concordSearch() {
    // ...
    // Show results
    if (matchedRows.length > 0) {
        showingStart.value = 1;
        showTotalResults(matchedRows.length);
        const [selectedColumns, columnsToDisplay] = prepareColumns(columnNames);
        const concordanceColumns = returnConcordanceColumns(
            searchColumnIndex1,searchColumnIndex2, searchColumnIndex3);
        insertColumnHeaders(columnsToDisplay, concordanceColumns);
        matchedData = setMatchedData(matchedRows, selectedColumns);
        const [showStart, showEnd] = determineRowsToShow(matchedData.length);
        insertResults(matchedData.slice(showStart, showEnd));
    } else {
        showNoResults();
    }
}

function returnConcordanceColumns(
    searchColumnIndex1, searchColumnIndex2, searchColumnIndex3
) {
    let concordanceColumns = Array();
    if (searchInput1.value !== "" && concordanceDisplay1.checked) {
        concordanceColumns.push(searchColumnIndex1 + 2);
    }
    if (searchInput2.value !== "" && concordanceDisplay2.checked) {
        concordanceColumns.push(searchColumnIndex2 + 2);
    }
    if (searchInput3.value !== "" && concordanceDisplay3.checked) {
        concordanceColumns.push(searchColumnIndex3 + 2);
    }
}