// CAN BE MOVED TO GLOBALS FILE, "clashing" with `chooseFile` in formlisteners.js
const fileInput = document.getElementById("choose-file");
var data;

const readFile = function () {
    var reader = new FileReader();
    var columnHeaders = document.getElementById("column-headers").checked;
    filetype = fileInput.files[0].type;

    reader.onload = function () {    
        if (filetype == "text/csv") {
            data = d3.csv.parseRows(reader.result);
        } else if (["text/tab-separated-values", "text/tsv"].includes(filetype)) {
            data = d3.tsv.parseRows(reader.result);
        } else if (["application/json", "text/json"].includes(filetype)) {
            var json = JSON.parse(reader.result);
            
            // Validate json file first
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
            let jsonSet = json.reduce(
                (set, item) => { return set.add(typeof(item)); }, 
                new Set());
            if(!(jsonSet.size == 1 && jsonSet.has("object"))) {
                resultsNumber.innerHTML = errorMessage;
                return false;
            }

            var fields = Array();
            json.forEach((rowObject) => {
                Object.keys(rowObject).forEach((key) => {
                    if (!fields.includes(key)) { fields.push(key); }
                });
            });
            data = json.map(function(row) {
                return fields.map(function(fieldName) { 
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
            data.unshift(fields);
        } else if (filetype == "text/plain") {
            data = reader.result.split('\n');
            data = data.map((line) => { return [line]; });
        }
            
        var columnNames = columnHeaders ? data[0] : data[0].map((d, i) => { 
            return `Column ${i + 1}`; 
        });
        
        // Rename empty column names
        columnNames = renameColumnNames(columnNames);

        // Rename duplicate column names
        while (columnNamesHaveDuplicates(columnNames)) { 
            columnNames = renameColumnNames(columnNames); 
        }
        // if (columnHeaders) { data[0] = columnNames; }
        // data[0] = columnNames;

        // Replace null or undefined values with empty strings
        data.forEach((row, i) => {
            row.forEach((item, j) => { if (!item) { data[i][j] = ""; } });
        });

        // populate drop-down menu
        d3.select("#column-selection-1").html("");  // clear menu
        d3.select("#column-selection-2").html("");  // clear menu
        d3.select("#column-selection-3").html("");  // clear menu
        d3.select("#column-selection-1").selectAll("option")
            .data(["(none)"].concat(columnNames)).enter()
                .append("option")
                .attr("value", function(d) { return d; })
                .text(function(d) { return d; });
        d3.select("#column-selection-2").selectAll("option")
            .data(["(none)"].concat(columnNames)).enter()
                .append("option")
                .attr("value", function(d) { return d; })
                .text(function(d) { return d; });
        d3.select("#column-selection-3").selectAll("option")
            .data(["(none)"].concat(columnNames)).enter()
                .append("option")
                .attr("value", function(d) { return d; })
                .text(function(d) { return d; });

        // columns to display
        d3.select("#columns-to-show").html("");  // clear checkboxes
        var columnsToShow = d3.select("#columns-to-show").selectAll("input")
            .data(columnNames).enter();
        columnsToShow.append("input")
            .attr("id", function(d) { return "to-show-" + d; })
            .attr("type", "checkbox")
            .property("checked", true);
        columnsToShow.insert("label")
            .attr("for", function(d) { return "to-show-" + d; })
            .html(function(d) { return d + "&nbsp;&nbsp;"; });
    };
    reader.readAsText(fileInput.files[0]);
};

fileInput.addEventListener('change', function() {
    let filetype = fileInput.files[0].type;
    if (["application/json", "text/json"].includes(filetype)) {
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


