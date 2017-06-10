var margin = {t:30, r:20, b:30, l:50 },
	w = 600 - margin.l - margin.r,
	h = 450 - margin.t - margin.b;

var trans = 1500;

var color = d3.scale.ordinal().range(['#880000','#325C74']);
var	radius = 6;

var transparency = d3.scale.sqrt().range([1,1]);

var svg = d3.select("#scatterChart").append("svg")
	.attr("width", w + margin.l + margin.r)
	.attr("height", h + margin.t + margin.b);

var xAxis = d3.svg.axis()
	.ticks(6)
	.tickSubdivide(4)
	.tickSize(6, 4, 0)
	.orient("bottom");

var yAxis = d3.svg.axis()
	.ticks(10)
	.tickSubdivide(4)
	.tickSize(6, 4, 0)
	.orient("left");

var plus = d3.format("+");
var comma = d3.format(",");
var percent = d3.format("+%f");

var groups = svg.append("g").attr("transform", "translate(" + margin.l + "," + margin.t + ")");

var scatter_data;
d3.csv("analysis.csv", function(data) {
	window.scatter_data=data;
	initialize(scatter_data);
});

var guide_data = [
{x_adjust:20, y_adjust:1.99, text:"+99%"},
{x_adjust:20, y_adjust:1.95, text:"+95%"},
{x_adjust:20, y_adjust:1.9, text:"+90%"},
{x_adjust:20, y_adjust:1.8,	text:"+80%"},
{x_adjust:20, y_adjust:1.6, text:"+60%"},
{x_adjust:20, y_adjust:1.4, text:"+40%"},
{x_adjust:20, y_adjust:1.2, text:"+20%"},
{x_adjust:30, y_adjust:1, text:"+0%"},
{x_adjust:20, y_adjust:.8, text:"-20%"},
{x_adjust:20, y_adjust:.6, text:"-40%"},
{x_adjust:20, y_adjust:.4, text:"-60%"},
{x_adjust:20, y_adjust:.2, text:"-80%"},
{x_adjust:20, y_adjust:.1, text:"-90%"},
{x_adjust:20, y_adjust:.05, text:"-95%"},
{x_adjust:20, y_adjust:.01, text:"-99%"}
];


function scatterplot(data, signal) {

	data = dataPrepare(data,signal);

	if(signal ===1) {
		var x = d3.scale.sqrt().range([0, w]),
	    	y = d3.scale.sqrt().range([h - margin.b - 10,0]);
		    x.domain([0, d3.max(data, function(d) { return parseFloat(d.x_plot); }) * 1.15]);
			y.domain([0, d3.max(data, function(d) { return parseFloat(d.y_plot); }) * 1.1]);
			yAxis.scale(y).tickFormat(comma);
	} else {
		var x = d3.scale.sqrt().range([0, w]),
	    	y = d3.scale.linear().range([h - margin.b - 10,0]);
	    	x.domain([0, d3.max(data, function(d) { return parseFloat(d.x_plot); }) * 1.15]);
			y.domain([-1,1]);
			yAxis.scale(y).tickFormat(percent);
};


var expect_max = d3.max(data, function(d) { return parseFloat(d.x_plot); });

xAxis.scale(x);

transparency.domain([d3.min(data, function(d) { return parseFloat(d.x_plot); }), 
	d3.max(data, function(d) { return parseFloat(d.x_plot); })])

guides
	.transition().duration(trans)
	.attr("class", function(d){return d.y_adjust === 1 ? "trendline guides" :"compline guides"})
	.attr('x1', x(0))
    .attr('x2', x(expect_max))
    .attr('y1', function(d){return signal===1 ? y(0) : y((1-d.y_adjust)*-1); })
    .attr('y2', function(d){return signal===1 ? y(expect_max * d.y_adjust) : y((1-d.y_adjust)*-1); });


var guide_text = svg.selectAll(".guide_text").data(guide_data);

guide_text.enter().append("text")
	.attr("class","guide_text")
	.attr("x", function(d){return w+d.x_adjust})
	.text(function(d){return d.text;});
guide_text
	.transition().duration(trans)
	.attr("y", function(d){ return y(expect_max * d.y_adjust) + 30; }); 


svg.selectAll(".guide_text.spare")
.transition().duration(trans)
.attr("y",function(){return signal ===1 ? 10 :-1000 ;});

	// style the circles, set their locations based on data
	var circles =
	groups.selectAll("circle");

	circles
		.transition().duration(trans)
		.attr({
			cx: function(d) { return x(+d.x_plot); },
	    	cy: function(d) { return y(+d.y_plot); },
		})
		.style("fill", function(d) { return color(d.union); })
		.style("opacity",function(d){
			if(signal ===1){
				return 1;
			}else{
				return transparency(d.x_plot);
			} })
		;


	circles.on("mouseover",mouseOn)
		.on("mouseout",mouseOff);
	
	// what to do when we mouse over a bubble
	function mouseOn() { 
		var circle = d3.select(this);

	// transition to increase size/opacity of bubble
		circle.transition()
		.duration(800).style("opacity", 1)
		.attr("r", 20).ease("elastic");

		// append lines to bubbles that will be used to show the precise data points.
		// translate their location based on margins
		svg.append("g")
			.attr("class", "guide")
			.append("line")
				.attr("x1", circle.attr("cx"))
				.attr("x2", circle.attr("cx"))
				.attr("y1", +circle.attr("cy") )
				.attr("y2", h-30)
				.attr("transform", "translate(50,20)")
				.style("stroke", circle.style("fill"))
				.transition().delay(200).duration(400).styleTween("opacity", 
					function() { return d3.interpolate(0, .5); });

		svg.append("g")
			.data(data)
			.attr("class", "guide")
			.append("line")
				.attr("x1", +circle.attr("cx") )
				.attr("x2", 0)
				.attr("y1", circle.attr("cy"))
				.attr("y2", circle.attr("cy"))
				.attr("transform", "translate(50,30)")
				.style("stroke", circle.style("fill"))
				.transition().delay(200).duration(400).styleTween("opacity", 
					function() { return d3.interpolate(0, .5); });


	// function to move mouseover item to front of SVG stage, in case
	// another bubble overlaps it
		d3.selection.prototype.moveToFront = function() { 
		  return this.each(function() { 
			this.parentNode.appendChild(this); 
		  }); 
		};
	};

	// what happens when we leave a bubble?
	function mouseOff() {
		var circle = d3.select(this);

		// go back to original size and opacity
		circle.transition()
		.duration(800)
		.style("opacity",function(d){
			if(scatterClicker ===1){
				return 1;
			}else{
				return transparency(d.x_plot);
			} })
		.attr("r", radius).ease("elastic");

		// fade out guide lines, then remove them
		d3.selectAll(".guide").transition().duration(100)
			.styleTween("opacity", function() { return d3.interpolate(.5, 0); })
			.remove()
	};


	// tooltips (using jQuery plugin tipsy)
	circles;

	$(".circles").tipsy({ 
		gravity: 's',
		html: 'true'
		});

	xxAxis.transition()
        .duration(trans).call(xAxis);
	yyAxis.transition()
        .duration(trans).call(yAxis);

};

function initialize(scatter_data){

var data=dataPrepare(scatter_data,1);

var circles =
groups.selectAll("circle")
	.data(data);

circles.enter().append("circle")
  .attr({
  	class: function(d){return  "circles "+d.state;},
  	r: radius,
    id: function(d) { return d.state; },
    cy:2000,
  })
	.append("title")
	.attr("class","tipsies")
	.text(function(d) { return '<font size="5px">'+d.state+'</font>' + '<br/><font size="2px">' +'Actual: '+ comma(d.y_plot)+ '<br/>' +"Expected: "+comma(d.x_plot) +'<br/>'+'Rate: '+ plus(d3.round((1- (+d.perform))*-100,2))+'%'; });
	scatterplot(data,1);
}


function dataPrepare(data,signal){
if(signal ===1){
	for(d in data){
		data[d].x_plot = Math.round(data[d].expected_fatal);
		data[d].y_plot = data[d].actual_fatal;
		data[d].perform = Math.round(data[d].perform*100)/100;
	}
}else{
	for(d in data){
		data[d].x_plot = Math.round(data[d].expected_fatal);
		data[d].y_plot = data[d].perform-1;
		data[d].perform = Math.round(data[d].perform*100)/100;
	}
}
return data;
}


// draw axes and axis labels
var xxAxis = svg.append("g")
	.attr("class", "x axis")
	.attr("transform", "translate(" + margin.l  + "," + (h-10) + ")");
var yyAxis = svg.append("g")
	.attr("class", "y axis")
	.attr("transform", "translate(" + margin.l + "," + margin.t + ")");

var guides = svg.selectAll(".complines.guides")
				.data(guide_data);
guides.enter().append("line")
	.attr("transform", "translate(" + margin.l + "," + margin.t + ")");


svg.append("text")
	.attr("class", "x label")
	.attr("text-anchor", "end")
	.attr("x", w + 50)
	.attr("y", h - 15)
	.text("Expected Deaths");
svg.append("text")
	.attr("class", "y label")
	.attr("text-anchor", "end")
	.attr("x", -20)
	.attr("y", 55)
	.attr("dy", ".75em")
	.attr("transform", "rotate(-90)")
	.text("Actual Deaths");
svg.append("text")
	.text("Below Expected")
	.attr("class","scatter_lab")
	.attr("x", 280)
	.attr("y", 325);
/*svg.append("rect")
	.attr("class","rectback")
	.attr("transform", "translate(" + margin.l + "," + margin.t + ")")
	.attr("x", 100)
	.attr("y", 80)
	.attr("width",140)
	.attr("height",19)
	.style({
		fill:"white",
		opacity:.5
	});*/
svg.append("text")
 	.text("Above Expected")
 	.attr("class","scatter_lab")
	.attr("x", 220)
	.attr("y", 90);
svg.append("line")
	.attr("transform", "translate(" + margin.l + "," + margin.t + ")")
	.attr("class", "trendlinekey")
	.attr('x1',0)
    .attr('x2',30)
    .attr('y1',h-10)
    .attr('y2',h-10);
svg.append("text")
	.attr("class","chartkey")
 	.text("Expected workplace deaths based on national averages.")
	.attr("transform", "translate(" + margin.l + "," + margin.t + ")")
	.attr("x", 32)
	.attr("y", h-6);

svg.append("circle")
	.attr("class","chartkey")
	.attr("transform", "translate(" + margin.l + "," + margin.t + ")")
	.attr("cx", 10)
	.attr("cy", h+8)
	.attr("r",5)
	.style("fill","#880000")
	.style("stroke","black");
svg.append("circle")
	.attr("class","chartkey")
	.attr("transform", "translate(" + margin.l + "," + margin.t + ")")
	.attr("cx", 140)
	.attr("cy", h+8)
	.attr("r",5)
	.style("fill","#325C74")
	.style("stroke","black");

svg.append("text")
	.attr("class","chartkey")
 	.text("Right-to-work state")
	.attr("transform", "translate(" + margin.l + "," + margin.t + ")")
	.attr("x", 20)
	.attr("y", h+12);
svg.append("text")
	.attr("class","chartkey")
 	.text("Closed-shop state")
	.attr("transform", "translate(" + margin.l + "," + margin.t + ")")
	.attr("x", 150)
	.attr("y", h+12);

/*Spares along the top*/
svg.append("rect")

	.attr("x",400)
	.attr("y",0)
	.attr("width",150)
	.attr("height",12)
	.style("fill","white");
svg.append("text")
	.attr("class","guide_text spare")
 	.text("+20%")
 	.style("font-size","11px")
	.attr("x", w-5);
svg.append("text")
	.attr("class","guide_text spare")
 	.text("+40%")
 	.style("font-size","11px")
	.attr("x", w-40);
svg.append("text")
	.attr("class","guide_text spare")
 	.text("+60%")
 	.style("font-size","11px")
	.attr("x", w-70);
svg.append("text")
	.attr("class","guide_text spare")
 	.text("+99%")
	.attr("x", w-115)
	.style("font-size","10px");

svg.append("circle")
	.attr("cx",463)
	.attr("cy",h+20)
	.attr("r",5)
	.style("fill","#880000")
	.style("stroke","black")
	.style("stroke-width",1);
svg.append("image")
	.attr("xlink:href", "cursor.png")
	.attr("x",436)
	.attr("y",h+18)
	.attr("width",30)
	.attr("height",30);

svg.append("text")
	.attr("class","chartkey")
 	.text("Touch for")
	.attr("transform", "translate(" + margin.l + "," + margin.t + ")")
	.attr("x", 420)
	.attr("y", h);
svg.append("text")
	.attr("class","chartkey")
 	.text("more info.")
	.attr("transform", "translate(" + margin.l + "," + margin.t + ")")
	.attr("x", 422)
	.attr("y", h+12);


var scatterClicker =1;
$('.scatterSelect').click(function(){
	if(scatterClicker===1){
		scatterplot(scatter_data,0);
		scatterClicker = 0;
		$('.scatterSelect').text("View Totals");
	}else{
		scatterplot(scatter_data,1);
		scatterClicker = 1;
		$('.scatterSelect').text("View Rates");
	}

}	);
	
