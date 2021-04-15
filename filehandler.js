// CAN BE MOVED TO GLOBALS FILE, "clashing" with `chooseFile` in formlisteners.js
const fileInput = document.getElementById("choose-file");
var data;

const readFile = function () {
    var reader = new FileReader();
    var columnHeaders = document.getElementById("column-headers").checked;

    reader.onload = function () {    
        filetype = fileInput.files[0].type;
        if (filetype == "text/csv") {
            data = d3.csv.parseRows(reader.result);
        } else if (["text/tab-separated-values", "text/tsv"].includes(filetype)) {
            data = d3.tsv.parseRows(reader.result);
        } else if (filetype == "text/plain") {
            data = reader.result.split('\n');
            data = data.map((line) => { return [line]; });
        }
        // THIS CAN BE MOVED TO A GLOBALS FILE
        var columnNames = columnHeaders ? data[0] : data[0].map((d, i) => { return `Column ${i + 1}`; });

        // populate drop-down menu
        d3.select("#column-selection").html("");  // clear menu
        d3.select("#column-selection2").html("");  // clear menu
        d3.select("#column-selection").selectAll("option")
            .data(["(None)"].concat(columnNames)).enter()
                .append("option")
                .attr("value", function(d) { return d; })
                .text(function(d) { return d; });
        d3.select("#column-selection2").selectAll("option")
            .data(["(None)"].concat(columnNames)).enter()
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
            .text(function(d) { return d + " "; });

    };
    reader.readAsText(fileInput.files[0]);
};

fileInput.addEventListener('change', readFile);


