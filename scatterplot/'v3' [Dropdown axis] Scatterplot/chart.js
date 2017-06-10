var body = d3.select('body'),
	menu = d3.select("#menu"),
	margin = { top: 0, right: 0, bottom: 30, left: 40 },
	height = 500 - margin.top - margin.bottom,
	width = 550 - margin.left - margin.right,
	formatNumber = d3.format(',.1f'),
	formatCurrency = d3.format('$,.0f'),
	tooltip = d3.select("body").append("div")
			.attr("class", "tooltip")
			.style("opacity", 0);

d3.csv('data.csv', function (data) {

	var xVars = [{"variable":"Household Income"},{"variable":"Poverty Rate"}];
	var yVars = [{"variable":"Infant Mortality Rate"},{"variable":"Male Life Expectancy"},{"variable":"Female Life Expectancy"}];

	console.log("xVars: ", xVars);
	console.log("yVars: ", yVars);


	menu.append('span')
		.text('X-axis: ');

	menu.append('select')
		.on('change',xChange)
		.selectAll('option')
		.data(xVars)
		.enter()
		.append('option')
		.attr('value', function (d) { return d.variable })
		.text(function (d) { return d.variable ;});

	menu.append('br');

	menu.append('span')
		.text('Y-axis: ');

	menu.append('select')
		.on('change',yChange)
		.selectAll('option')
		.data(yVars)
		.enter()
		.append('option')
		.attr('id', function (d) { return d.variable })
		.attr('value', function (d) { return d.variable })
		.text(function (d) { return d.variable ;});

	d3.select("[id='Infant Mortality Rate']")
		.attr("selected", "selected");

	var xScale = d3.scale.linear()
		.domain([d3.min(data,function (d) { return 0.93*d['Household Income']}),d3.max(data,function (d) { return 1.07*d['Household Income']})])
		.range([0,width]);

	var yScale = d3.scale.linear()
		.domain([d3.min(data,function (d) { return 0.98*d['Infant Mortality Rate']}),d3.max(data,function (d) { return 1.02*d['Infant Mortality Rate']})])
		.range([height,0]);


	var svg = d3.select("#chart").append('svg')
		.attr('height', 1.01 * height + margin.top + margin.bottom)
		.attr('width', width + margin.left + margin.right)
		.append('g')
		.attr('transform','translate(' + margin.left + ',' + margin.top + ')');

	var xAxis = d3.svg.axis()
		.scale(xScale)
		.tickFormat(d3.format(',.0f'))
		.ticks(5)
		.orient('bottom')
		.tickSize(-height);

	var yAxis = d3.svg.axis()
		.scale(yScale)
		.tickFormat(d3.format(',.0f'))
		.ticks(5)
		.orient('left')
		.tickSize(-width - margin.left - margin.right);


	svg.append('g')
		.attr('class','axis')
		.attr('id','xAxis')
		.attr('transform', 'translate(-1,' + height + ')')
		.call(xAxis)
		.append('text')
			.attr('id','xAxisLabel')
			.attr("dy", "2em")
    		.attr("dx", width/1.6)
			.style('text-anchor','end')
			.text('Household Income');

	svg.append('g')
		.attr('class','axis')
		.attr('id','yAxis')
		.call(yAxis)
		.append('text')
			.attr('id', 'yAxisLabel')
			.attr('transform','rotate(-90)')
			.attr("dy", "-1.6em")
			.attr("dx", -height/2.5)
			.style('text-anchor','end')
			.text('Infant Mortality Rate');

	var circles = svg.selectAll('circle')
		.data(data)
		.enter()
		.append('circle')
			.attr('cx',function (d) { return xScale(d['Household Income']) })
			.attr('cy',function (d) { return yScale(d['Infant Mortality Rate']) })
			.attr('r','5')
		.on("mouseover", function(d) {
			tooltip.transition()
			.duration(250)
			.style("opacity", .9);
			tooltip.html(
	          "<p><strong>Household Income:  </strong>" + formatCurrency(d['Minimum Household Income']) + "&ndash;" + formatCurrency(d['Maximum Household Income']) + "</p>" +
	          "<p><strong>Poverty Rate:  </strong>" + formatNumber(d['Poverty Rate']) + "%</p>" +
	          "<p><strong>Infant Mortality:  </strong>" + formatNumber(d['Infant Mortality Rate']) + " per 1,000 live births</p>" +
	          "<p><strong>Male Life Expectancy:  </strong>" + formatNumber(d['Male Life Expectancy']) + " years</p>" +
	          "<p><strong>Female Life Expectancy:  </strong>" + formatNumber(d['Female Life Expectancy']) + " years</p>"
			)
			.style("left", (d3.event.pageX + 15) + "px")
			.style("top", (d3.event.pageY - 28) + "px");
		})
		.on("mouseout", function(d) {
			tooltip.transition()
			.duration(250)
			.style("opacity", 0);
		});

	function xChange() {

		var value = this.value;
		xScale.domain([d3.min(data,function (d) { return 0.93*d[value]}),d3.max(data,function (d) { return 1.07*d[value]})]);
		xAxis.scale(xScale);

		d3.select('#xAxis')
			.transition()
			.duration(750)
			.call(xAxis);

		d3.select('#xAxisLabel')
			.text(value);

		d3.selectAll('circle')
			.transition()
			.duration(750)
			.attr('cx',function (d) { return xScale(d[value]) })
	};

	function yChange() {

		var value = this.value;
		yScale.domain([d3.min(data,function (d) { return 0.98*d[value]}),d3.max(data,function (d) { return 1.02*d[value]})]);
		yAxis.scale(yScale);

		d3.select('#yAxis')
			.transition()
			.duration(750)
			.call(yAxis);

		d3.select('#yAxisLabel')
			.text(value);

		d3.selectAll('circle')
			.transition()
			.duration(750)
			.attr('cy',function (d) { return yScale(d[value]) });
	}
});

d3.select(self.frameElement).style("height", "715px");