const fileInput = document.getElementById("csv");
var data;

const readFile = function () {
    var reader = new FileReader();
    reader.onload = function () {    
        data = $j.csv.toArrays(reader.result);
        
        // populate drop-down menu
        d3.select("#column-selection").selectAll("option")
            .data(data[0]).enter()
                .append("option")
                .attr("value", function(d) { return d; })
                .text(function(d) { return d; });
        d3.select("#column-selection2").selectAll("option")
            .data(data[0]).enter()
                .append("option")
                .attr("value", function(d) { return d; })
                .text(function(d) { return d; });

        // columns to show
        var columnsToShow = d3.select("#columns-to-show").selectAll("input")
            .data(data[0]).enter();
        columnsToShow.append("input")
            .attr("id", function(d) { return "to-show-" + d; })
            .attr("type", function () { return "checkbox"; })
            .property("checked", true);
        columnsToShow.insert("label")
            .attr("for", function(d) { return "to-show-" + d; })
            .text(function(d) { return d + " "; });

    };
    reader.readAsBinaryString(fileInput.files[0]);
};

fileInput.addEventListener('change', readFile);


