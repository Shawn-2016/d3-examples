function updateHeatmap(x){
	svg.selectAll(".legend").attr("opacity", 0);
	d3.csv(x, function(d){
		return {
			day:+d.day2,
			hour:+d.hour,
			value:+d.per_day_per_hour
			};
		},
		
		function(error, data){
		

		colorScale = d3.scale.quantile()
			.domain([0, (d3.max(data, function(d){return d.value;})/2), d3.max(data, function(d){return d.value;})])
			.range(colors);
			
			
		var heatMap = svg.selectAll(".hour")
			.data(data)
			.transition().duration(1000)
			.style("fill", function(d){ return colorScale(d.value);});
			
		heatMap.selectAll("title").text(function(d) {return d.value;});
		
		var legend = svg.selectAll(".legend")
			.data([0].concat(colorScale.quantiles()), function(d) {return d;})
			.enter().append("g")
			.attr("class", "legend");
		
		legend.append("rect")
			.attr("x", function(d, i){ return legendElementWidth * i;})
			.attr("y", height)
			.attr("width", legendElementWidth)
			.attr("height", gridSize/2)
			.style("fill", function(d, i) {return colors[i]; });
		
		legend.append("text")
			.attr("class", "mono")
			.text(function(d) {return "≥ "+d.toString().substr(0,4);})
			.attr("x", function(d, i){ return legendElementWidth *i;})
			.attr("y", height+ gridSize);
			
			
			
		}
	)
}