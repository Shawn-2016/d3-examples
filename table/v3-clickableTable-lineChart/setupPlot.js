// This function does the one-time setup for the plot - which is basically
// just setting up this g.#lineplot

var setupPlot = function(height, width, margin) {
    
    // Create an svg element for the plot
   d3.select("#plot").append("svg:svg")
       .attr("width", width)
       .attr("height", height)
     .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")")
        .attr("id", "lineplot");

    // Create global variables for the axes - no need to populate them just yet
    xAxisGroup = null;
    yAxisGroup = null;

};

