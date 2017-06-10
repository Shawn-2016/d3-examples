// This function creates a table with a row for each statistic in a flat data
// object and a column for each time period in the data object.

var makeMultiTable = function(stats) {

    // Set up the column names
    // One set for the year supercolumns
    var yrCols = d3.nest()
        .key(function(d) { return d.stat_year; })
        .rollup(function(d) { return d.length; })
        .entries(stats.filter(function(d) { return d.stat_name == "Visits"; }));


    // And one for the quarter columns
    var qtrCols = d3.keys(
        d3.nest()
            .key(function(d) { return d.datestring; })
            .map(stats)
    );

    // Add an empty column for the statistic name
    yrCols.unshift("");
    qtrCols.unshift("");




    // Nest data within each statistic
    var aggstats = d3.nest()
        .key(function(d) { return d.stat_name; })
        .entries(stats)

    // Create the table
    var table = d3.select("#table").append("table");
    var thead = table.append("thead");
    var tbody = table.append("tbody");

    // Append the year headers
    thead.append("tr")
        .selectAll("th")
        .data(yrCols)
      .enter()
        .append("th")
            .text(function(d) { return d.key; })
            .attr("colspan", function(d) { return d.values; })

    // Append the quarter headers
    thead.append("tr")
        .selectAll("th")
        .data(qtrCols)
      .enter()
        .append("th")
            .text(function(column) { return column.substr(4, 6); })


    // Bind each statistic to a line of the table
    var rows = tbody.selectAll("tr")
        .data(aggstats)
      .enter()
        .append("tr")
            .attr("rowstat", function(d) { return d.key; })
            .attr("chosen", false)
            .attr("onclick", function(d) { 
                return "toggleStat('" + d.key + "')"; })


    // Add statistic names to each row
    var stat_cells = rows.append("td")
            .text(function(d) { return d.key; })
            .attr("class", "rowkey")


    // Fill in the cells.  The data -> d.values pulls the value arrays from
    // the data assigned above to each row.
    // The unshift crap bumps the data cells over one - otherwise, the first
    // result value falls under the statistic labels.
    var res_cells = rows.selectAll("td")
        .data(function(d) { 
            var x = d.values;
            x.unshift({ qtr_result: ""} );
            return x; })
      .enter()
        .append("td")
          .text(function(d) { return d3.format(",d")(d.qtr_result); })




};
