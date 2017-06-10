// LOAD DATA
d3.csv("data.csv",function(csv) {
  initialData = csv;
  console.log("initialData:\n", initialData);

  makeBars();
});


// DETERMINE size, y0 OF EACH BAR
function barStack(d) {
  console.log("d:\n", d);

  var l = d[0].length
  while (l--) {
    var positiveBase = 0, negativeBase = 0;
    d.forEach(function(d) {
      d = d[l]
      d.size = Math.abs(d.y)
      if (d.y < 0)  {
        d.y0 = negativeBase
        negativeBase -= d.size
      }
      else {
        d.y0 = positiveBase = positiveBase + d.size
      }
    })
  };

  d.extent = d3.extent(d3.merge(d3.merge(d.map(function(e) { 
          return e.map(function(f) { 
            return [f.y0,f.y0-f.size]
          })
        }))));

  return d;
};


function makeBars() {

  // REMOVE CHART SVG 1ST EVERYTIME YOU MAKE BARS
  d3.select("#chart svg").remove();

  // GET SELECTED OPTION VALUE
  var selectedNAICS = document.getElementById("menu").value;

  // GET SELECTED VALUE DATA
  var filteredData = initialData.filter(d => (d.naics == selectedNAICS) );
  console.log("selectedNAICS:\n", selectedNAICS);
  console.log("filteredData:\n", filteredData);


  // ARRANGE DATA
  var data = ["exports","imports"].map(function(v) {
                return filteredData.map(function(d) {
                      return  {y: d[v]}
                });
              });
  console.log("data:\n", data);


  var margin = {top: 0, right: 0, bottom: 0, left: 50},
      height = 400,
      width = 745,
      color = d3.scale.ordinal().range(["#3498DB","#2980B9"]);

  // UPDATE X SCALE WITH SELECTED DATA
  x = d3.scale.ordinal()
      .domain(filteredData.map(d => d.year))
      .rangeRoundBands([0, width - margin.left - margin.right], .1);
  console.log("x.domain():\n", x.domain());


  y = d3.scale.linear()
    .range([height - margin.top - margin.bottom,0]);

  var xAxis = d3.svg.axis().scale(x).orient("bottom");
  var yAxis = d3.svg.axis().scale(y).orient("right")
              .tickSize(width - margin.left - margin.right);

  barStack(data);
  y.domain(data.extent);
  console.log("data.extent:\n", data.extent);
  console.log("y.domain():\n", y.domain());


  var line = d3.svg.line()
    .x(d => (x(d.year) + x.rangeBand()/2) ) // THIS IS GOOD
    .y(d => y(d.netexports));

  var svg = d3.select("#chart")
      .append("svg")
      .style("padding","5px")
      .attr("height",height)
      .attr("width",width);

  svg.selectAll(".series")
    .data(data)
    .enter().append("g")
    .attr("class", "series")
    .style("fill", (d,i) => color(i));

  var bars = svg.selectAll(".series").selectAll("rect")
        .data(Object);

  bars.enter().append("rect")
    .attr("x", (d,i) => x(x.domain()[i]))
    .attr("y", d => (y(d.y0) + 0) )
    .attr("height", d => (y(0) - y(d.size)) )
    .attr("width", x.rangeBand())
    .attr("class", "bar");

  svg.append("g")
    .attr("class","x axis")
    .attr("transform","translate (0 " + y(0) + ")")
    .call(xAxis);

  svg.append("g")
    .attr("class","y axis")
    .attr("transform", "translate(0," + y.range()[1] + 0 + ")")
    .call(yAxis)
    .append("text")
      .attr("class", "ylabel")
      .attr("transform", "rotate(-90)")
      .attr("y", width - 10)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("$US Billions");

  svg.selectAll("g")
    .classed("g-baseline", d => (d == 0) );

  svg.append("path")
    .datum(filteredData)
    .attr("class", "line")
    .attr("d", line);

  svg.append("text")
    .attr("class", "keylabel")
    .attr("x", 15)
    .attr("y", -5)
    .attr("dy", ".71em")
    .text("Exports");

  svg.append("rect")
    .attr("width", 11)
    .attr("height", 11)
    .attr("x", 0)
    .attr("y", -5)
    .style("fill", "#3498DB");

  svg.append("text")
    .attr("class", "keylabel")
    .attr("x", 87)
    .attr("y", -5)
    .attr("dy", ".71em")
    .text("Imports");

  svg.append("rect")
    .attr("width", 11)
    .attr("height", 11)
    .attr("x", 72)
    .attr("y", -5)
    .style("fill", "#2980B9");

};

d3.select(self.frameElement).style("height", "585px");