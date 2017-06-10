/* ranges from http://www.heart.org/HEARTORG/Conditions/HighBloodPressure/AboutHighBloodPressure/Understanding-Blood-Pressure-Readings_UCM_301764_Article.jsp */
/* adapted from http://bl.ocks.org/mbostock/1667367 Focus+Context via Brushing */
(function () {
    'use strict';

    var svg = d3.select('svg'),
        svgDims = svg.node().getBoundingClientRect(),
        margin = { top: 30, right: 10, bottom: 20, left: 40 },
        margin2 = { top: 0, right: 10, bottom: 20, left: 40 },
        width = svgDims.width - margin.left - margin.right,
        chartHeights = svgDims.height - margin.top,
        height = ( 0.7 * chartHeights ) - margin.bottom,
        height2 = chartHeights - height - margin.bottom - margin2.bottom - 10,
        timeFormat = d3.time.format("%-I:​%M %p %a, %b %-d '%y");

    margin2.top = height + margin.bottom + margin2.bottom + 10;

    var x = d3.time.scale().range([width, 0]),
        x2 = d3.time.scale().range([width, 0]),
        y = d3.scale.linear().range([height, 0]),
        y2 = d3.scale.linear().range([height2, 0]);

    var xAxis = d3.svg.axis().scale(x).orient('bottom'),
        xAxis2 = d3.svg.axis().scale(x2).orient('bottom'),
        yAxis = d3.svg.axis().scale(y).orient('left');

    var brush = d3.svg.brush()
        .x(x2)
        .on('brush', brushed)
        .on('brushend', function () {
            showFocusInfo(avgExtent);
            addUX();
        });

    svg.select('defs #focus-clip rect')
        .attr('width', width)
        .attr('height', height);

    /* position context info on top of chart */
    var focusInfo = svg.append('g')
                    .attr('class', 'focus-info')
                    .attr('transform', 'translate(' + margin.left + ',' + '0)');

    var focus = svg.append('g')
                .attr('class', 'focus')
                .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    var context = svg.append('g')
                .attr('class', 'context')
                .attr('transform', 'translate(' + margin2.left + ',' + margin2.top + ')');

    var bpData = [];
    var timeExtent = [];
    var avgExtent = [];

    d3.json('bp.json', function(err, data) {

        bpData = data;

        var sysExtent = d3.extent(data, function(d) {
            return d.systolic;
        });

        var diaExtent = d3.extent(data, function(d) {
            return d.diastolic;
        });

        var bpExtent = d3.extent(sysExtent.concat(diaExtent));
        bpExtent[0] -= 10;
        bpExtent[1] += 10;
        // -10 & +10 added so dots, lines don't occupy full height of group.

        y.domain(bpExtent);

        timeExtent = d3.extent(data, function(d) { return d.ts })
        avgExtent[0] = timeExtent[0];
        avgExtent[1] = timeExtent[1];

        x.domain(timeExtent);
        x2.domain(x.domain());
        y2.domain(y.domain());

console.log("data:", data);
console.log("sysExtent:", sysExtent);
console.log("diaExtent:", diaExtent);
console.log("sysExtent.concat(diaExtent):", sysExtent.concat(diaExtent));
console.log("bpExtent:", bpExtent);
console.log("timeExtent:", timeExtent);
console.log("x.domain()/x2.domain():", x.domain());
console.log("y.domain()/y2.domain():", y.domain());


        focus.append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0,' + height + ')')
            .call(xAxis);

        focus.append('g')
            .attr('class', 'y axis')
            .call(yAxis);

        genBpChart ( focus, x, y, bpData, 4 );

        showFocusInfo([ timeExtent[0], timeExtent[1] ]);

        context.append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0,' + height2 + ')')
            .call(xAxis2);

        genBpChart ( context, x2, y2, bpData, 3 );

        context.append('g')
                .attr('class', 'x brush')
                .call(brush)
            .selectAll('rect')
                .attr('y', 2)
                .attr('height', height2 );
    });

    /* return color and type based on range */
    function getRange (key, val) {
        var rx = 0,
            ranges = [
                /* #1ebc16: green; #ff9315: orange */
                { systolic : 120, diastolic :  80, fill : '#1ebc16', color: '#fff', title : 'Normal' },
                { systolic : 140, diastolic :  90, fill : 'gold',    color: '#fff', title : 'Prehypertension' },
                { systolic : 160, diastolic : 100, fill : '#ff9315', color: '#000', title : 'Stage 1 Hypertension' },
                { systolic : 180, diastolic : 110, fill : 'tomato',  color: '#fff', title : 'Stage 2 Hypertension' },
                { systolic : 999, diastolic : 999, fill : 'crimson', color: '#fff', title : 'Hypertensive Crisis' }
            ],
            /* range length */
            rlen = ranges.length;

        /* systolic = 148, fill = #ff9315; diastolic = 112, fill = crimson; */
        for ( rx; rx < rlen; rx += 1 ) {
            if ( val < ranges[rx][key] ) {
                return ranges[rx];
            }
        };
    };

    /* generate path */
    function genPath ( grp, val, xScale, yScale, data ) {

        var line = d3.svg.line()
                .x(function(d) { return xScale( d.ts ) })
                .y(function(d) { return yScale( d[val] ) });

        grp.append('path')
            .attr('class', 'bp-line ' + val)
            .attr('stroke', '#ddd')
            .attr('fill', 'none')
            .attr('stroke-width', '.5')
            .attr('d', line(data));
    };

    /* generate dots */
    function genDots ( grp, val, xScale, yScale, data, dotRadius) {

        grp.append('circle')
            .attr('class', val)
            .attr('r', dotRadius)
            .attr('stroke', 'none')
            .attr('fill', function (d) { return getRange( val, d[val] ).fill })
            .attr('cx', function(d) { return xScale( d.ts ) })
            .attr('cy', function(d) { return yScale( d[val] ) });
    };

    /* generate chart */
    function genBpChart ( grp, xScale, yScale, data, dotRadius ) {
        var sys = 'systolic',
            dia = 'diastolic';

        genPath( grp, sys, xScale, yScale, data );
        genPath( grp, dia, xScale, yScale, data );

        var bpGrp = grp.selectAll('bp-grp')
                    .data(data)
                    .enter()
                    .append('g')
                    .attr('class', 'bp-grp');

        genDots( bpGrp, sys, xScale, yScale, data, dotRadius );
        genDots( bpGrp, dia, xScale, yScale, data, dotRadius );
        addUX();
    };


    function addUX() {
        var sys = 'systolic',
            dia = 'diastolic',
            rad = 4;

        focus.selectAll('.bp-grp')
            .each(function () {

                var dis = d3.select(this);
                var sysDot = dis.select('.systolic');
                var sysX = sysDot.attr('cx');
                var sysY = sysDot.attr('cy');

                // add first rect so that mouseover works for bp group
                dis.append('rect')
                    .attr('x', function(d) { return x( d.ts ) - rad } )
                    .attr('y', function(d) { return y( d.systolic ) })
                    .attr('width', 8)
                    .attr('height', function(d) { return y( d.diastolic ) - y( d.systolic ) })
                    .attr('fill', 'transparent')
                    .attr('stroke', 'none');

                    dis.on('mouseenter', function(d) {
                                dis.append('rect') // add second rect on mouseenter to highlight bp group
                                    .attr('x', function(d) { return ( x( d.ts ) - rad ) - 1 })
                                    .attr('rx', rad + 1 )
                                    .attr('y', function(d) { return y( d[sys] ) - ( rad + 1 ) })
                                    .attr('ry', rad + 1 )
                                    .attr('width', ( rad * 2 ) + 2 )
                                    .attr('height', function(d) { return ( y( d[dia] ) - y( d[sys]) ) + ( rad * 2 ) + 2 })
                                    .attr('stroke', '#ddd')
                                    .attr('stroke-width', '.5')
                                    .attr('fill', 'rgba(220,220,220,0.2)')
                                    .attr('class', 'bp-outline');
                            })
                        .on('mouseleave', function(d) {
                            d3.select(this).select('.bp-outline').remove();
                        })
                        .on('mousedown', function(d) {
                            popupBp(d, sysX, sysY)
                        });
            });
    };

    function getFocusInfo(extent) {

        var daysLen = 0;
        var evesLen = 0;

        var daySumSys = 0;
        var daySumDia = 0;
        var eveSumSys = 0;
        var eveSumDia = 0;

        var daysAvg = '';
        var evesAvg = '';


        bpData.forEach(function(d) {
            var hr;
            if ( d.ts >= extent[0] && d.ts <= extent[1] ) {
                hr = d.time.substring(11,13);
                if ( hr > '06' && hr < '18' ) {
                    daysLen += 1;
                    daySumSys += d.systolic;
                    daySumDia += d.diastolic;
                } else {
                    evesLen += 1;
                    eveSumSys += d.systolic;
                    eveSumDia += d.diastolic;
                }
            }
        });

        daysAvg = daysLen ? Math.round( daySumSys / daysLen ) + '/' + Math.round( daySumDia / daysLen ) : 'none'
        evesAvg = evesLen ? Math.round( eveSumSys / evesLen ) + '/' + Math.round( eveSumDia / evesLen ) : 'none'

        return {
            range : {
                from: showDate(extent[0]),
                to: showDate(extent[1])
            },
            days  : {
                avg: daysAvg,
                samples: daysLen
            },
            eves  : {
                avg: evesAvg,
                samples: evesLen
            }
        }
    };

    function showFocusInfo(extent) {
        var periodText, bpText,
                info = getFocusInfo(extent),
                // ugghh! no padding or margins for svg text
                periodSpans = [
                    { txt : 'Period', dx : 0, hasCss : 'bold' },
                    { txt : 'To: ' + info.range.to, dx : 30 },
                    { txt : 'From: ' + info.range.from, dx : 12 },
                ],
                bpSpans = [
                    { txt : 'Blood Pressure Averages ', dx : 0, hasCss : 'bold' },
                    { txt : 'Days: ' + info.days.avg, dx : 12 },
                    { txt : 'Samples: ' + info.days.samples, dx : 12 },
                    { txt : 'Eves: ' + info.eves.avg, dx : 20 },
                    { txt : 'Samples: ' + info.eves.samples, dx : 12 }
                ];

        focusInfo.selectAll('text').remove();
        focusInfo.selectAll('.line-arrow').remove();

        periodText = focusInfo.append('text')
            .attr('x', (width * .5) - 12.5 ) // offset for width of one arrow
            .attr('y', 15)
            .attr('text-anchor', 'middle');

        appendSpans(periodText, periodSpans);

        bpText = focusInfo.append('text')
            .attr('x', width * .5)
            .attr('y', 35)
            .attr('text-anchor', 'middle');

        appendSpans(bpText, bpSpans);

        appendArrow(focusInfo.select('tspan'), '#line-arrow-left')
        appendArrow(focusInfo.select('text'), '#line-arrow-right')

        function appendSpans(el, spans) {
            spans.forEach(function (span) {
                var tspan = el.append('tspan')
                            .text(span.txt)
                            .attr('dx', span.dx);

                if ( span.hasCss ) { tspan.attr('class', span.hasCss ) }
            });
        }

        function appendArrow(d3el, arrowId) {
            var txtEl = d3el.node(),
                    transX = (txtEl.getBoundingClientRect().left + txtEl.offsetWidth) - getTrans(focusInfo).tx,
                    arrowGrp = focusInfo.append('g')
                        .attr('class', 'line-arrow')
                        .attr('transform', 'translate(' + transX + ',5.5)');

            arrowGrp.append('use')
                .attr('xlink:href', arrowId);
        };
    };

    function brushed() {
        var xBefore, xAfter, xLast;
        var domain = brush.empty() ? x2.domain() : brush.extent();

        var minTs = domain[0].getTime();
        var maxTs = domain[1].getTime();

        x.domain(domain);

        avgExtent[0] = minTs;
        avgExtent[1] = maxTs;

        focus.selectAll('.bp-line').remove();
        focus.selectAll('.bp-grp').remove();

        genBpChart ( focus, x, y, bpData, 4 );

        focus.select('.x.axis').call(xAxis);
    };

    function popupBp( d, bpx, bpy ) {
        var popupWidth = 0;
        var transX = 0;

        var popup = svg.append('g') // appended to svg so it floats over everything else
                    .datum(d)
                    .attr('class', 'popup');

        var popupBg = popup.append('rect')
                    .attr('x', 0)
                    .attr('y', 0)
                    .attr('rx', 2)
                    .attr('ry', 2)
                    .attr('width', 100)
                    .attr('height', 80)
                    .attr('fill', '#efefef')
                    .attr('stroke', '#ddd')
                    .attr('stroke-width', '.5')

        var sysDot = popup.append('circle')
                    .attr('class', 'systolic')
                    .attr('cx', 17)
                    .attr('cy', 17)
                    .attr('r', 7)
                    .attr('fill', getRange('systolic', d.systolic).fill)

        var sysText = popup.append('text')
                    .attr('x', 30)
                    .attr('y', 22)
                    .text('Systolic:')
                        .append('tspan')
                            .text(d.systolic)
                                .attr('dx', 10)

        var diaDot = popup.append('circle')
                    .attr('class', 'diastolic')
                    .attr('cx', 17)
                    .attr('cy', 43)
                    .attr('r', 7)
                    .attr('fill', getRange('diastolic', d.diastolic).fill)

        var diaText = popup.append('text')
                    .attr('x', 30)
                    .attr('y', 48)
                    .text('Diastolic:')
                     .append('tspan')
                            .text(d.diastolic)
                             .attr('dx', 5)

        var timeText = popup.append('text')
                    .attr('x', 10)
                    .attr('y', 70)
                    .text(showDate(d.ts));

        popupWidth = timeText.node().getBoundingClientRect().width + 20;

        popupBg.attr('width', popupWidth);

        var closeButton = popup.append('g')
                    .attr('class', 'close-button')
                    .attr('transform', 'translate(' + (popupWidth - 28) + ',8)')
                    .on('click', function(evt) {
                        popup.remove();
                    });

        closeButton.append('use')
            .attr('xlink:href', '#close-button');

        bpx = parseFloat(bpx, 10);
        bpy = parseFloat(bpy, 10);
        if ( bpx + popupWidth + margin.left + 25 > width ) {
            transX = bpx - popupWidth - margin.left - 25
        } else {
            transX = bpx + 25 + margin.left;
        }

        popup.attr('transform', 'translate(' + transX + ',' + (bpy + margin.top) + ')');

        popupDrag(popup);
    };

    function popupDrag(dragger) {

        dragger.call(d3.behavior.drag()
            .on('dragstart', dragStr)
            .on('drag', dragging)
            .on('dragend', dragEnd)
        );

        function dragStr () {
            dragger.transition()
                .duration(200)
                    .attr('opacity', .4);
        }

        function dragging () {
            d3.event.sourceEvent.cancelBubble = true;

            var trans = getTrans(dragger)
            var transX = d3.event.dx + trans.tx;
            var transY = d3.event.dy + trans.ty;

            dragger.attr('transform', 'translate(' + transX + ',' + transY + ')');
        }

        function dragEnd () {
                d3.event.sourceEvent.cancelBubble = true;

                dragger.transition()
                    .duration(200)
                        .attr('opacity', 1);
        }
    };

    function showDate(ts) {
        var tsloc = ts + (new Date(ts).getTimezoneOffset() * 60 * 1000); // shows date/time in time local to browser
        return timeFormat(new Date(tsloc)).replace(/AM/g, 'am').replace(/PM/g, 'pm');
    };

    function  getTrans(el) {
        var trans = el.attr('transform').match(/translate\(([\d\.,]+\))/g)
        var txy = [0,0];
        if (trans) {
            txy = trans[0].replace(/translate\(/, '') .replace(/\)/, '').split(',');
        }
        var tx = txy[1] ? parseFloat(txy[0]) : 0;
        var ty = txy[1] ? parseFloat(txy[1]) : 0;
        return { tx: tx, ty: ty };
    };

    function padZ(num, z) {
        var padded = num + '',
                len    = z || 2;

            if (padded.length < len) {
                while (padded.length < len) {
                    padded = '0' + padded;
                }
            }
            return padded;
    };
}());