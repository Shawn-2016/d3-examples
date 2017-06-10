var margin = {
    left: 30,
    top: 20,
    right: 20,
    bottom: 20
};

var width = Math.min($('#vis').width(), 800) - margin.left - margin.right;
var height = width * 2 / 3;

var vis = d3.select('#vis').insert('svg', ':first-child')
    .attr({
        width: width + margin.left + margin.right,
        height: height + margin.top + margin.bottom
    });

var wrapper = vis.append('g')
    .attr('class', 'chordWrapper')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

var opacityCircles = 0.7; 

var color = d3.scale.ordinal()
    .domain(['Deposit', 'Receive', 'Spend', 'Withdrawal'])
    .range(['#00986F', '#41A5D1', '#695998', '#CD5053']);

var xScale = d3.scale.log()
    .domain(d3.extent(countries, function(d) {
        return d.create_date;
    }))
    .range([0, width])
    .nice();

var xAxis = d3.svg.axis()
    .orient('bottom')
    .ticks(2)
    .tickFormat(function (d) {
        return xScale.tickFormat(8, function(d) {
            var prefix = d3.formatPrefix(d);
            return "$" + prefix.scale(d) + prefix.symbol;
        })(d);
    })
    .scale(xScale);

wrapper.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(' + 0 + ',' + height + ')')
    .call(xAxis);

var yScale = d3.scale.linear()
    .range([height, 0])
    .domain(d3.extent(countries, function(d) {
        return d.usd_value;
    }))
    .nice();

var yAxis = d3.svg.axis()
    .orient('left')
    .ticks(6)
    .scale(yScale);

wrapper.append('g')
    .attr('class', 'y axis')
    .attr('transform', 'translate(' + 0 + ',' + 0 + ')')
    .call(yAxis);

var circleGroup = wrapper.append('g')
    .attr('class', 'circleWrapper');

circleGroup.selectAll('countries')
    .data(countries.sort(function(a, b) {
        return b.risk_score > a.risk_score;
    }))
    .enter().append('circle')
        .attr('class', function(d, i) {
            return 'countries ' + d.id;
        })
        .style('opacity', opacityCircles)
        .style('fill', function(d) {
            return color(d.activity);
        })
        .attr('cx', function(d) {
            return xScale(d.create_date);
        })
        .attr('cy', function(d) {
            return yScale(d.usd_value);
        })
        .attr('r', 9);

var voronoi = d3.geom.voronoi()
    .x(function(d) {
        return xScale(d.create_date);
    })
    .y(function(d) {
        return yScale(d.usd_value);
    })
    .clipExtent([[0, 0], [width, height]]);

var voronoiGroup = wrapper.append('g')
    .attr('class', 'voronoiWrapper');

voronoiGroup.selectAll('path')
    .data(voronoi(countries))
    .enter().append('path')
    .attr('d', function(d, i) {
        return 'M' + d.join('L') + 'Z';
    })
    .datum(function(d, i) {
        return d.point;
    })
    .attr('class', function(d, i) {
        return 'voronoi ' + d.id;
    })
    .style('fill', 'none')
    .style('pointer-events', 'all')
    .on('mouseover', showTooltip)
    .on('mouseout',  removeTooltip);

wrapper.append('g')
    .append('text')
        .attr('class', 'x title')
        .attr('text-anchor', 'end')
        .style('font-size', '12px')
        .attr('transform', 'translate(' + width + ',' + (height - 10) + ')')
        .text('Date');

wrapper.append('g')
    .append('text')
        .attr('class', 'y title')
        .attr('text-anchor', 'end')
        .style('font-size', '12px')
        .attr('transform', 'translate(18, 0) rotate(-90)')
        .text('Transaction Amount');

var legendMargin = {
    left: 5,
    top: 10,
    right: 5,
    bottom: 10
};
var legendWidth = 145;
var legendHeight = 270;

var svgLegend = d3.select('#legend').append('svg')
    .attr('width', (legendWidth + legendMargin.left + legendMargin.right))
    .attr('height', (legendHeight + legendMargin.top + legendMargin.bottom));

var legendWrapper = svgLegend.append('g')
    .attr('class', 'legendWrapper')
    .attr('transform', 'translate(' + legendMargin.left + ',' + legendMargin.top +')');

var rectSize = 15;
var rowHeight = 20;
var maxWidth = 144;

var legend = legendWrapper.selectAll('.legendSquare')   
    .data(color.range())                              
    .enter().append('g')   
    .attr('class', 'legendSquare') 
    .attr('transform', function(d, i) {
        return 'translate(' + 0 + ',' + (i * rowHeight) + ')';
    })
    .style('cursor', 'pointer')
    .on('mouseover', selectLegend(0.02))
    .on('mouseout', selectLegend(opacityCircles))
    .on('click', clickLegend);

legend.append('rect')                                     
    .attr('width', maxWidth) 
    .attr('height', rowHeight)                    
    .style('fill', 'white');

legend.append('rect')                                     
    .attr('width', rectSize) 
    .attr('height', rectSize)                     
    .style('fill', function(d) {
        return d;
    });                                 

legend.append('text')                                     
    .attr('transform', 'translate(' + 22 + ',' + (rectSize / 2) + ')')
    .attr('class', 'legendText')
    .style('font-size', '10px')
    .attr('dy', '.35em')          
    .text(function(d, i) {
        return color.domain()[i];
    });

function bubbleLegend(wrapperVar, scale, sizes, titleName) {
    var legendSize1 = sizes[0];
    var legendSize2 = sizes[1];
    var legendSize3 = sizes[2];
    var legendCenter = 0;
    var legendBottom = 50;
    var legendLineLength = 25;
    var textPadding = 5;
    var numFormat = d3.format(',');

    wrapperVar.append('text')
        .attr('class','legendTitle')
        .attr('transform', 'translate(' + legendCenter + ',' + 0 + ')')
        .attr('x', 0 + 'px')
        .attr('y', 0 + 'px')
        .attr('dy', '1em')
        .text(titleName);

    wrapperVar.append('circle')
        .attr('r', scale(legendSize1))
        .attr('class','legendCircle')
        .attr('cx', legendCenter)
        .attr('cy', (legendBottom-scale(legendSize1)));
    wrapperVar.append('circle')
        .attr('r', scale(legendSize2))
        .attr('class','legendCircle')
        .attr('cx', legendCenter)
        .attr('cy', (legendBottom-scale(legendSize2)));
    wrapperVar.append('circle')
        .attr('r', scale(legendSize3))
        .attr('class','legendCircle')
        .attr('cx', legendCenter)
        .attr('cy', (legendBottom-scale(legendSize3)));

    wrapperVar.append('line')
        .attr('class','legendLine')
        .attr('x1', legendCenter)
        .attr('y1', (legendBottom - 2 * scale(legendSize1)))
        .attr('x2', (legendCenter + legendLineLength))
        .attr('y2', (legendBottom - 2 * scale(legendSize1)));   
    wrapperVar.append('line')
        .attr('class','legendLine')
        .attr('x1', legendCenter)
        .attr('y1', (legendBottom - 2 * scale(legendSize2)))
        .attr('x2', (legendCenter + legendLineLength))
        .attr('y2', (legendBottom - 2 * scale(legendSize2)));
    wrapperVar.append('line')
        .attr('class','legendLine')
        .attr('x1', legendCenter)
        .attr('y1', (legendBottom - 2 * scale(legendSize3)))
        .attr('x2', (legendCenter + legendLineLength))
        .attr('y2', (legendBottom - 2 * scale(legendSize3)));

    wrapperVar.append('text')
        .attr('class','legendText')
        .attr('x', (legendCenter + legendLineLength + textPadding))
        .attr('y', (legendBottom - 2 * scale(legendSize1)))
        .attr('dy', '0.25em')
        .text('$ ' + numFormat(Math.round(legendSize1 / 1e9)) + ' B');
    wrapperVar.append('text')
        .attr('class','legendText')
        .attr('x', (legendCenter + legendLineLength + textPadding))
        .attr('y', (legendBottom - 2 * scale(legendSize2)))
        .attr('dy', '0.25em')
        .text('$ ' + numFormat(Math.round(legendSize2 / 1e9)) + ' B');
    wrapperVar.append('text')
        .attr('class','legendText')
        .attr('x', (legendCenter + legendLineLength + textPadding))
        .attr('y', (legendBottom - 2 * scale(legendSize3)))
        .attr('dy', '0.25em')
        .text('$ ' + numFormat(Math.round(legendSize3 / 1e9)) + ' B');
}

function selectLegend(opacity) {
    return function(d, i) {
        var chosen = color.domain()[i];

        wrapper.selectAll('.countries')
            .filter(function(d) {
                return d.activity !== chosen;
            })
            .transition()
            .style('opacity', opacity);
    };
}

function clickLegend(d, i) {
    event.stopPropagation();

    d3.selectAll('.legendSquare')
        .on('mouseover', null)
        .on('mouseout', null);

    var chosen = color.domain()[i];

    wrapper.selectAll('.countries')
        .style('opacity', opacityCircles)
        .style('visibility', function(d) {
            if (d.activity !== chosen) {
                return 'hidden';
            } else {
                return 'visible';
            }
        });

    wrapper.selectAll('.voronoi')
        .on('mouseover', function(d, i) {
            if(d.activity !== chosen) {
                return null;
            } else {
                return showTooltip.call(this, d, i);
            }
        })
        .on('mouseout', function(d, i) {
            if(d.activity !== chosen) {
                return null;
            } else {
                return removeTooltip.call(this, d, i);
            }
        });
}

function resetClick() {
    d3.selectAll('.legendSquare')
        .on('mouseover', selectLegend(0.02))
        .on('mouseout', selectLegend(opacityCircles));

    wrapper.selectAll('.countries')
        .style('opacity', opacityCircles)
        .style('visibility', 'visible');

    wrapper.selectAll('.voronoi')
        .on('mouseover', showTooltip)
        .on('mouseout',  function (d, i) {
            removeTooltip.call(this, d, i);
        });
}

d3.select('body').on('click', resetClick);

function removeTooltip (d, i) {
    var element = d3.selectAll('.countries.' + d.id);

    element.style('opacity', opacityCircles);

    $('.popover').each(function() {
        $(this).remove();
    }); 

    d3.selectAll('.guide')
        .transition().duration(200)
        .style('opacity', 0)
        .remove();
}

function showTooltip (d, i) {
    var element = d3.selectAll('.countries.' + d.id);

    $(element).popover({
        placement: 'auto top',
        container: '#vis',
        trigger: 'manual',
        html : true,
        content: function() { 
            return '<span style="font-size: 11px; text-align: center;">' + d.activity + ": $" + d.usd_value + '</span>';
        }
    });

    $(element).popover('show');

    element.style('opacity', 1);

    wrapper.append('g')
        .attr('class', 'guide')
        .append('line')
            .attr('x1', element.attr('cx'))
            .attr('x2', element.attr('cx'))
            .attr('y1', element.attr('cy'))
            .attr('y2', (height))
            .style('stroke', element.style('fill'))
            .style('opacity', 0)
            .style('pointer-events', 'none')
            .transition().duration(200)
            .style('opacity', 0.5);

    wrapper.append('g')
        .attr('class', 'guide')
        .append('line')
            .attr('x1', +element.attr('cx'))
            .attr('x2', 0)
            .attr('y1', element.attr('cy'))
            .attr('y2', element.attr('cy'))
            .style('stroke', element.style('fill'))
            .style('opacity',  0)
            .style('pointer-events', 'none')
            .transition().duration(200)
            .style('opacity', 0.5);     
}
