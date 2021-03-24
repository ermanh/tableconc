const fileInput = document.getElementById("csv");

const readFile = function () {
    var reader = new FileReader();
    reader.onload = function () {    
        var data = $j.csv.toArrays(reader.result);
        var columns = data[0].join(", ");
        
        // display all column names
        d3.select("#column-names")
            .selectAll("text")
            .data(columns)
            .enter().append("text")
                .text(function(d) { return d; });

        // populate drop-down menu
        d3.select("#column-selection")
            .selectAll("option")
            .data(data[0])
            .enter().append("option")
                .attr("value", function(d) { return d; })
                .text(function(d) { return d; });
        
        // columns to show
        var columnsToShow = d3.select("#columns-to-show").selectAll("input")
            .data(data[0]).enter();
        columnsToShow.append("input")
            .attr("id", function(d) { return "to-show-" + d; })
            .attr("type", function () { return "checkbox"; });
        columnsToShow.insert("label")
            .attr("for", function(d) { return "to-show-" + d; })
            .text(function(d) { return d + " "; });

    };
    reader.readAsBinaryString(fileInput.files[0]);
};

fileInput.addEventListener('change', readFile);


