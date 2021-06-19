// search.js
showingStart.value = 1;
showTotalResults(matchedRows.length);
const concordanceColumns = getConcordanceColumns(
    searchColumnIndex1, searchColumnIndex2, searchColumnIndex3);
const [selectedColumns, selectedConcordColumns, columnsToDisplay] = 
    prepareColumns(columnNames, concordanceColumns);
insertColumnHeaders(columnsToDisplay, selectedConcordColumns);
matchedData = setMatchedData(matchedRows, selectedColumns);
const [showStart, showEnd] = determineRowsToShow(matchedData.length);
insertResults(matchedData.slice(showStart, showEnd));


// filehandler.js
function addColumnsToDisplayListeners(columnNames) {
    let columnsToShowNodes = document.getElementsByClassName("column-to-show");
    Array.from(columnsToShowNodes).forEach((node) => {
        node.addEventListener("change", () => {
            let columnNames = getColumnNames();
            let [searchColumnIndex1, searchColumnIndex2, searchColumnIndex3] =
                getSearchColumnIndices(columnNames); 
            let concordanceColumns = getConcordanceColumns(
                searchColumnIndex1, searchColumnIndex2, searchColumnIndex3);
            let [selectedColumns, selectedConcordColumns, columnsToDisplay] = 
                prepareColumns(columnNames, concordanceColumns);
            insertColumnHeaders(columnsToDisplay, selectedConcordColumns);
            matchedData = setMatchedData(matchedRows, selectedColumns);
            let [showStart, showEnd] = determineRowsToShow(matchedData.length);
            insertResults(matchedData.slice(showStart, showEnd));
        });
    });
}