Forked from [timelyportfolio](http://bl.ocks.org/timelyportfolio)'s [bl.ock](http://bl.ocks.org/timelyportfolio/5c136de85de1c2abb6fc) which in turn forked [Mike Bostock](http://bl.ocks.org/mbostock)'s [focus+context zoom gist](https://gist.github.com/mbostock/1667367) to demonstrate how we can drive a d3 brush with code.

<blockquote class="twitter-tweet" lang="en"><p>anybody know how to brush with code in <a href="https://twitter.com/hashtag/d3js?src=hash">#d3js</a>?</p>&mdash; klr (@timelyportfolio) <a href="https://twitter.com/timelyportfolio/status/509701031585148928">September 10, 2014</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

So [timelyportfolio](http://bl.ocks.org/timelyportfolio) found [this discussion](https://groups.google.com/forum/#!topic/d3-js/vNaR-vJ9hMg), but he could not find an example demonstrating the steps proposed by Athan Reines.

<pre>
For auto-redraw so that the focus of a 1D brush matches the graphed domain, you need to do as follows:

(1) Apply the brush scale to the graphed domain (i.e., the brush extent) --> store in var brushExtent; (units: pixels)
(2) Within the brush element (class=`'brush'`), select the `<rect>` with class=`'extent'`.
(3) If the brush is horizontal (i.e., for the x-axis), set the 'x' attribute to the first value in brushExtent. This moves the start position of the focus `<rect>` to match the graphed domain. If the brush is vertical (i.e., for the y-axis), set the `'y'` attribute to the second value in brushExtent.
(4) Next, set the 'width' attribute of the extent to `brushExtent[1] - brushExtent[0]`. The end of the brush focus is `brushExtent[1]`, but the length of the focus is this minus the offset introduced by `brushExtent[0]`. (If a y-axis brush, switch [0] and [1]).

(*) The extent should now programmatically match the graphed domain.

I use this procedure as part of a resize function. Hope this works. 

-KG
</pre>

[timelyportfolio](http://bl.ocks.org/timelyportfolio) and I do not follow these steps exactly.  Here is the code that drives our brush when a range is specified and the **zoom** button is clicked.

```
function drawBrush(a, b) {
  // define our brush extent

  // note that x0 and x1 refer to the lower and upper bound of the brush extent
  // while x2 refers to the scale for the second x-axis, for context or brush area.
  // unfortunate variable naming :-/
  var x0 = x2.invert(a*width)
  var x1 = x2.invert(b*width)
  console.log("x0", x0)
  console.log("x1", x1)
  brush.extent([x0, x1])

  // now draw the brush to match our extent
  // use transition to slow it down so we can see what is happening
  // set transition duration to 0 to draw right away
  brush(d3.select(".brush").transition().duration(500));

  // now fire the brushstart, brushmove, and brushend events
  // set transition the delay and duration to 0 to draw right away
  brush.event(d3.select(".brush").transition().delay(10duration(500))

    }
```

<hr/>

### Original Readme.md from [mbostock](http://bl.ocks.org/mbostock)
This examples demonstrates how to use D3's brush component to implement focus + context zooming. Click and drag in the small chart below to pan or zoom.

MIT License

forked from <a href='http://bl.ocks.org/micahstubbs/'>micahstubbs</a>'s block: <a href='http://bl.ocks.org/micahstubbs/3cda05ca68cba260cb81'>programmatic control of a d3 brush - specify zoom</a>