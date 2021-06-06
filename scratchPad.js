
function populateColumnDropdowns(columnNames) {
    ["1", "2", "3"].forEach((i) => {
        d3.select(`#column-selection-${i}`).html("").selectAll("option")
            .data(["(none)"].concat(columnNames)).enter()
            .append("option")
            .attr("value", (d) => d)
            .text((d) => d);
    });
}

function populateColumnsToDisplay(columnNames) {
    d3.select("#columns-to-show").html("");  // clear checkboxes
    let columnsToShow = d3.select("#columns-to-show").selectAll("input")
        .data(columnNames).enter().append("span");
    columnsToShow.append("input")
        .attr("id", (d) => `to-show-${d}`)
        .attr("class", () => "column-to-show")
        .attr("type", "checkbox")
        .property("checked", true);
    columnsToShow.insert("label")
        .attr("for", (d) => `to-show-${d}`)
        .html((d) => ` ${d}&nbsp;&nbsp;&nbsp;`);
}

function addColumnsToDisplayListeners(columnNames) {
    let columnsToShowNodes = document.getElementsByClassName("column-to-show");
    Array.from(columnsToShowNodes).forEach((node) => {
        node.addEventListener("change", () => {
            let [selectedColumns, 
                    columnsToDisplay] = prepareColumns(columnNames);
            insertColumnHeaders(columnsToDisplay);
            matchedData = setMatchedData(matchedRows, selectedColumns);
            let [showStart, 
                    showEnd] = determineRowsToShow(matchedData.length);
            insertResults(matchedData.slice(showStart, showEnd));
        });
    });
}