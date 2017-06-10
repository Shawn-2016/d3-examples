const margin = {top: 20, right: 20, bottom: 20, left: 100};
const heightTop = 300 - margin.top - margin.bottom;
const height = 200 - margin.top - margin.bottom;
const width = 960 - margin.left - margin.right;

const dataset = d3.range(20).map(d3.random.normal(20, 5));
const max = d3.max(dataset)/1.5;
const datasetTop = dataset.map((d) => d < max ? 0 : d );
const datasetLength = dataset.length;
const shift = 50;

const svgTop = d3.select("#chartArea").append('svg')
    .attr("width", width + margin.left + margin.right)
    .attr("height", heightTop + margin.top)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
const svg = d3.select("#chartArea").append('svg')
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + ",0)");

const x = d3.scale.ordinal()
    .domain(d3.range(dataset.length))
    .rangeRoundBands([0, width/2], .4);

const y = d3.scale.linear()
    .domain([0, max])
    .range([0, height]);

const xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

const yAxis = d3.svg.axis()
    .scale(y)
    .tickSize(-width)
    .orient("left");

svg.selectAll("rect")
    .data(dataset)
  .enter()
    .append("rect")
    .attr("x", (d, i) => x(i) + shift)
    .attr("y", (d) => height - y(d))
    .attr("width", x.rangeBand())
    .attr("height", (d) => y(d))
    .attr("transform", (d, i) => {
      is = i - (datasetLength - 1)/2
      return "translate(" + (shift -i*1.8) + ",0) skewX(" + is*3.5 + ")"
    })
    .attr("fill", 'maroon');

svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
  .selectAll('text')
    .attr('x', (d,i) => d*9.5) // How to shift the tick marks?

svg.append("g")
    .attr("class", "y axis")
    .call(yAxis);

const yTop = d3.scale.linear()
    .domain([0, d3.max(dataset)])
    .range([0, heightTop]);
const yAxisTop = d3.svg.axis()
    .scale(yTop)
    .tickSize(-width)
    .orient("left");

svgTop.selectAll("rect")
    .data(datasetTop)
  .enter()
    .append("rect")
    .attr("x", (d, i) => x(i) + shift)
    .attr("y", (d) => heightTop - yTop(d))
    .attr("width", x.rangeBand())
    .attr("height", (d) => yTop(d))
    .attr("transform", (d, i) => "translate(" + (shift -i*1.8) + ",0)")
    .attr("fill", 'maroon');

svgTop.append("g")
    .attr("class", "y axis")
    .call(yAxisTop);
