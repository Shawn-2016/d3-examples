var margin = {top: 20, right: 20, bottom: 20, left: 60}, // margins around the graph
    width = 880 - margin.left - margin.right, // width of the graph
    height = 590 - margin.top - margin.bottom; // height of the graph


var x = d3.scale.ordinal().rangeBands([margin.left, width-margin.right]), // x range function
    y = d3.scale.linear().range([height - margin.top, margin.bottom]); // y range function

var color = d3.scale.category10();

var  currentDataset,// name of the current data set. Used to track when the dataset changes
  data;

var vis = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);
  
var  xAxis = d3.svg.axis().scale(x).tickSize(16).tickSubdivide(true).orient("bottom"), // x axis function
    yAxis = d3.svg.axis().scale(y).tickSize(10).tickSubdivide(true).orient("left"); // y axis function
 
 
 
// runs once when the visualisation loads
function init () {
  vis = d3.select("#visualisation");
 
	// add in the x axis
	vis.append("g") // container element
		.attr("class", "x axis") // so we can style it with CSS
		.attr("transform", "translate(0," + height + ")") // move into position
		.call(xAxis); // add to the visualisation
 
	// add in the y axis
	vis.append("g") // container element
		.attr("class", "y axis") // so we can style it with CSS
		.attr("transform", "translate(" + margin.left + ", 0)")
    .call(yAxis); // add to the visualisation
 
	// load data, process it and draw it
	update ();
  
}
 
// this redraws the graph based on the data in the rawData variable
function redraw () {
	var plot = vis.selectAll ("circle").data(drawingData, function (d) { return d.id;}), // select the data points and set their data
		axes = getAxes (); // object containing the axes we'd like to use
 
	// add new points if they're needed
	plot.enter()
		.insert("circle")
			.attr("cx", function (d) { return x(d[axes.xAxis])+x.rangeBand()/2; })
			.attr("cy", function (d) { return y(d[axes.yAxis]); })
			.attr("r", 5)
      .style("opacity", .5)
			.style("fill", function (d) { return color(d[axes.colorAxis]); }); // set fill colour 
 
	// the data domains or desired axes might have changed, so update them all
	x.domain(rawData.map(function(d) { return d[axes.xAxis]; }));
	y.domain([
		d3.min(rawData, function (d) { return +d[axes.yAxis]; }),
		d3.max(rawData, function (d) { return +d[axes.yAxis]; })
	]);
	color.domain([
		d3.min(rawData, function (d) { return +d[axes.colorAxis]; }),
		d3.max(rawData, function (d) { return +d[axes.colorAxis]; })
	]);
 
	// transition function for the axes
    var t = vis.transition().duration(1500).ease("exp-in-out");
    t.select(".x.axis").call(xAxis);
    t.select(".y.axis").call(yAxis);
 
	// transition the points
	plot.transition().duration(1500).ease("exp-in-out")
		.attr("cx", function (d) { return x(d[axes.xAxis])+x.rangeBand()/2; })
		.attr("cy", function (d) { return y(d[axes.yAxis]); })
    .attr("r", 5)
    .style("opacity", 0.5)
  	.style("fill", function (d) { return color(d[axes.colorAxis]); }); // set fill colour
 
 
	// remove points if we don't need them anymore
	plot.exit()
		.transition().duration(1500).ease("exp-in-out")
		.attr("cx", function (d) { return x(d[axes.xAxis])+x.rangeBand()/2; })
		.attr("cy", function (d) { return y(d[axes.yAxis]); })
		.style("opacity", 0.5)
		.attr("r", 0)
				.remove();
        
}
 
// initiate
init ();
 
 
 
 
//////////////////////
// helper functions //
//////////////////////
 
function generateTypesList (data) {
  var i = data.length,
		typeNames = {},
		select = document.getElementById("Q10-temp"),
		list = "";
 
	// loop though each coaster and check it's type's name. If we haven't seen
	// it before, add it to an object so that we can use it to build the list
	while (i--) {
		if (typeof typeNames[data[i].Q10round.name] == "undefined") {
			typeNames[data[i].Q10round.name] = data[i].Q10round.className;
		}
	}
	// loop through the array to generate the list of types
	for (var key in typeNames) {
		if (typeNames.hasOwnProperty(key)) {
			list += '<li class="' + typeNames[key] + '"><label><input type="checkbox" checked="checked" value="' + slugify(key) + '">' + key + '</label></li>';
		}
	}
	// update the form
	select.innerHTML = list;
}
 
 
// return the name of the dataset which is currently selected
function getChosenDataset () {
	var select = document.getElementById("dataset");
	return select.options[select.selectedIndex].value;
}
 
 
// take a string and turn it into a WordPress style slug
function slugify (string) {
  return string.replace (/([^a-z0-9])/ig, '-').toLowerCase ();
}
 
 
function plottableTypes () {
  var types = [].map.call (document.querySelectorAll ("#Q10-temp input:checked"), function (checkbox) { return checkbox.value;} );
	return types;
}
 
 
 
// return an object containing the currently selected axis choices
function getAxes () {
	var xaxis = document.querySelector("#x-axis input:checked").value,
		yaxis = document.querySelector("#y-axis input:checked").value,
		col = document.querySelector("#color-axis input:checked").value;
	return {
		xAxis: xaxis,
		yAxis: yaxis,
		colorAxis: col
	};
}
 
 
 
// return a list of types which are currently selected
function plottableTypes () {
	var types = [].map.call (document.querySelectorAll ("#Q10-temp input:checked"), function (checkbox) { return checkbox.value;} );
	return types;
}
 
// take a raw dataset and remove coasters which shouldn't be displayed
// (i.e. if it is "dirty" or it's type isn't selected)
function processData (data) {
	var processed = [],
		Q10Levels = {},
		counter = 1;
 
	data.forEach (function (data, index) {
		var Q10,
			className = "";
		if (data == data) { // don't process it if it's dirty and we want to cull dirty data
				Q10 = {
					id: index // so that the coasters can animate
				};
			for (var attribute in data) {
				if (data.hasOwnProperty (attribute)) {
					Q10[attribute] = data[attribute]; // populate the coaster object
				}
			}
			if (typeof Q10Levels[data.Q10round] == "undefined") { // generate a classname for the coaster based on it's type (used for styling)
				Q10Levels[data.Q10round] = {
					id: counter - 1,
					className: 'Q10Level-' + counter,
					name: data.Q10round,
					slug: slugify(data.Q10round)
				};
				counter = counter + 1;
			}
			Q10.Q10round = Q10Levels[data.Q10round];
			processed.push (Q10); // add the coaster to the output
		}
	});
 
	return processed; // only contains coasters we're interested in visualising
}
 
// remove coasters whose type is not selected from a dataset
function cullUnwantedTypes (Q10) {
	var typesToDisplay = plottableTypes ();
 
	return Q10.filter (function (Q10) {
		return typesToDisplay.indexOf(Q10.Q10round.slug) !== -1;
	});
}
 
// called every time a form field has changed
function update () {
	var dataset = getChosenDataset(), // filename of the chosen dataset csv
		processedData; // the data while will be visualised
	// if the dataset has changed from last time, load the new csv file
	if (dataset != currentDataset) {
		d3.csv("scatterplot.csv", function (data) {
			// process new data and store it in the appropriate variables
			rawData = data;
			processedData = processData(data);
			currentDataset = dataset;
			generateTypesList(processedData);
			drawingData = cullUnwantedTypes(processedData);
			redraw();
		});
	} else {
		// process data based on the form fields and store it in the appropriate variables
		processedData = processData(rawData);
		drawingData = cullUnwantedTypes(processedData);
		redraw();
	}
}
 
 
// listen to the form fields changing
document.getElementById("dataset").addEventListener ("change", update, false);
document.getElementById("controls").addEventListener ("click", update, false);
document.getElementById("controls").addEventListener ("keyup", update, false);