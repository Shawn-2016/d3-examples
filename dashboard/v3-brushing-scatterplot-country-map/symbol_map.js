if(!d3.chart) d3.chart = {};

d3.chart.symbol_map = function() {
  var g;
  var data;
  var width = 400;
  var height = 400;
  var cx = 10;
    var size_scale = 30;
  var dispatch = d3.dispatch(chart, "hover");
    
    var projection = d3.geo.albersUsa()
    .translate([700, 230])
    .scale([500]);

    
  function chart(container) {
    g = container;
    update();
  }
  chart.update = update;

    function update() {
      
     var symbols = g.selectAll("circle")
      .data(data.sort(function(a, b) { return b.agprod - a.agprod; }), key);

      symbols.enter().append("circle");
      
     
      symbols
      .transition()
      .attr("cx", function(d) {
            return projection([d.lon, d.lat])[0];
            })
      .attr("cy", function(d) {
            return projection([d.lon, d.lat])[1];
            })
      .attr("r", function(d) {
            return Math.sqrt(parseFloat(d.agprod) * size_scale);
            })
      .style("fill", function(d) {
             return d.color;
             })
      .style("opacity", 0.75)
      .attr("class", "symbol")
      .attr("title", function(d) { return "Productivity for " + d.id + ": " + d.agprod; });
  
    
    symbols.exit()
      //.transition()
      .remove();
     

    symbols.on("mouseover", function(d) {
      d3.select(this).style("stroke", "black")
      dispatch.hover([d])
    })

    symbols.on("mouseout", function(d) {
      d3.select(this).style("stroke", "")
      dispatch.hover([])
    })
  }

    chart.highlight = function(data) {
        var symbols = g.selectAll("circle.symbol")
        .style("stroke", "")
        .style("stroke-width", "")
        
        symbols.data(data, key)
        .style("stroke", "black")
        .style("stroke-width", 3)
    }
  
    
    
  chart.data = function(value) {
    if(!arguments.length) return data;
    data = value;
    return chart;
  }
  chart.width = function(value) {
    if(!arguments.length) return width;
    width = value;
    return chart;
  }
  chart.height = function(value) {
    if(!arguments.length) return height;
    height = value;
    return chart;
  }
    
   var key = function(d) {
        return d.id;
   };

  return d3.rebind(chart, dispatch, "on");
}