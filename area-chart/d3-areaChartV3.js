/**
* Copyright (c) 2018-present, Shawn Ng
* D3js version: 3.x
**/

'use strict';


/**
LAYOUT
margin2 and height2 are variables of brush area
**/
function createLayout(width=960, height=500,
  top=10, right=10, bottom=100, left=40,
  top2=430, right2=10, bottom2=20, left2=40) {
  var margin = {top:top, right:right, bottom:bottom, left:left};
  var margin2 = {top:top2, right:right2, bottom:bottom2, left:left2};
  var width = width - margin.right - margin.left;
  var height = height - margin.top - margin.bottom;
  var height2 = height - margin2.top - margin2.bottom;
  return {margin:margin, margin2:margin2, width:width, height:height, height2:height2};
};

/**
AXES
**/
function createAxes() {
  // function to parse date
  var parseDate = d3.time.format("%b %Y").parse;
  // x & x2 have same time scale
  var x,x2;
  x,x2 = d3.time.scale().range([0, width]);
  var y = d3.scale.linear().range([height, 0]);
  var y2 = d3.scale.linear().range([height2, 0]);

  var xAxis = d3.svg.axis().scale(x).orient("bottom");
  var xAxis2 = d3.svg.axis().scale(x2).orient("bottom");
  var yAxis = d3.svg.axis().scale(y).orient("left");

};

/**
SVG
**/
function createSVG() {
  var svg = d3.select("body").append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom);

  // https://developer.mozilla.org/en/docs/Web/SVG/Element/clipPath
  svg.append("defs")
    .append("clipPath")
      .attr("id", "clip")
    .append("rect")
      .attr("width", width)
      .attr("height", height);

  var focus = svg.append("g").attr("class", "focus")
                .attr("transform",
                  "translate(" + margin.left + "," + margin.top + ")");

  var context = svg.append("g").attr("class", "focus")
                .attr("transform",
                  "translate(" + margin2.left + "," + margin2.top + ")");
};

// ===== FUNCTIONS CALLED INSIDE DATA =====
/**
AREA
var area = areaTemplate(x,y,height);
var area2 = areaTemplate(x2,y2,height2);
**/
function createAreaSVG(xScale, yScale, height, style="monotone") {
  return d3.svg.area().interpolate(style)
            .x(d => xScale(d.date); )
            .y0(height).y1(d => yScale(d.price); );
};

/**
BRUSH
**/
function createBrush() {
  var brush = d3.svg.brush().x(x2).on("brush", brushed);

  function brushed() {
    x.domain(brush.empty() ? x2.domain() : brush.extent());
    focus.select(".area").attr("d", area);
    focus.select(".x.axis").call(xAxis);
  };
};
