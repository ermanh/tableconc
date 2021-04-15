const fileInput = document.getElementById("csv");
var data;

const readFile = function () {
    var reader = new FileReader();
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

        // populate drop-down menu
        d3.select("#column-selection").selectAll("option")
            .data(["(None)"].concat(data[0])).enter()
                .append("option")
                .attr("value", function(d) { return d; })
                .text(function(d) { return d; });
        d3.select("#column-selection2").selectAll("option")
            .data(["(None)"].concat(data[0])).enter()
                .append("option")
                .attr("value", function(d) { return d; })
                .text(function(d) { return d; });

        // columns to display
        var columnsToShow = d3.select("#columns-to-show").selectAll("input")
            .data(data[0]).enter();
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


