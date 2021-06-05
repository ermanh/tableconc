// CAN BE MOVED TO GLOBALS FILE, "clashing" with `chooseFile` in formlisteners.js
const fileInput = document.getElementById("choose-file");
let data;
let newData;
let matchedData = Array();
let matchedRows;

function processJSON(json) {
    let tempData;
    let errorMessage = `<text style='color:crimson'>
        JSON file must be an array of objects.<br>For example:<br><br>
        &nbsp;&nbsp;[<br>
        &nbsp;&nbsp;&nbsp;&nbsp;{<br>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"Column 1": "one",<br>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"Column 2": "two"<br>
        &nbsp;&nbsp;&nbsp;&nbsp;},<br>
        &nbsp;&nbsp;&nbsp;&nbsp;{<br>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"Column 1": "alpha",<br>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"Column 2": "beta"<br>
        &nbsp;&nbsp;&nbsp;&nbsp;}<br>
        &nbsp;&nbsp;]<br>
        </text>`;
    if (!Array.isArray(json)) {
        resultsNumber.innerHTML = errorMessage;
        return false;
    }
    let jsonSet = json.reduce((set, item) => { return set.add(typeof(item)); }, 
                              new Set());
    if(!(jsonSet.size == 1 && jsonSet.has("object"))) {
        resultsNumber.innerHTML = errorMessage;
        return false;
    }
    let fields = Array();
    json.forEach((rowObject) => {
        Object.keys(rowObject).forEach((key) => {
            if (!fields.includes(key)) { fields.push(key); }
        });
    });
    tempData = json.map((row) => {
        return fields.map((fieldName) => { 
            if (row[fieldName]) {
                if (typeof(row[fieldName]) == "string") {
                    return row[fieldName];
                } else {
                    return JSON.stringify(row[fieldName]);
                }
            } else {
                return ""; 
            }
        }); 
    });
    tempData.unshift(fields);
    return tempData;
}

function readFile() {
    let reader = new FileReader();
    let columnHeaders = document.getElementById("column-headers").checked;
    filetype = fileInput.files[0].type;

    reader.onload = () => {    
        if (filetype == "text/csv") {
            data = d3.csvParseRows(reader.result);
        } else if (filetype == "text/tab-separated-values") {
            data = d3.tsvParseRows(reader.result);
        } else if (filetype == "application/json") {
            data = processJSON(JSON.parse(reader.result));
        } else if (filetype == "text/plain") {
            data = reader.result.split('\n');
            data = data.map((line) => [line]);
        }
        if (!data) { return false; }

        let columnNames = columnHeaders ? 
            data[0] : data[0].map((d, i) =>`Column ${i + 1}`);
        
        columnNames = renameColumnNames(columnNames);
        while (columnNamesHaveDuplicates(columnNames)) {  // Rename duplicates 
            columnNames = renameColumnNames(columnNames); 
        }

        // Replace null or undefined values with empty strings
        data.forEach((row, i) => {
            row.forEach((item, j) => { if (!item) { data[i][j] = ""; } });
        });

        // populate drop-down menu
        d3.select("#column-selection-1").html("").selectAll("option")
            .data(["(none)"].concat(columnNames)).enter()
                .append("option")
                .attr("value", (d) => d)
                .text((d) => d);
        d3.select("#column-selection-2").html("").selectAll("option")
            .data(["(none)"].concat(columnNames)).enter()
                .append("option")
                .attr("value", (d) => d)
                .text((d) => d);
        d3.select("#column-selection-3").html("").selectAll("option")
            .data(["(none)"].concat(columnNames)).enter()
                .append("option")
                .attr("value", (d) => d)
                .text((d) => d);

        // columns to display
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
        
        // add column listeners
        columnsToShowNodes = document.getElementsByClassName("column-to-show");
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
    };
    reader.readAsText(fileInput.files[0]);
}

fileInput.addEventListener('change', () => {
    let filetype = fileInput.files[0].type;
    if (filetype == "application/json") {
        columnHeaders.checked = true;
        columnHeaders.disabled = true;
    } else {
        columnHeaders.disabled = false;
    }
    // Clear selections and results
    filterSelection1.innerHTML = "";
    filterSelection2.innerHTML = "";
    filterSelection3.innerHTML = "";
    resultsNumber.innerHTML = "";
    resultsTable.innerHTML = "";

    readFile();    
});


