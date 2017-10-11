# Programmatically Control a d3 brush
Forked from Mike Bostock's [focus+context zoom gist](https://gist.github.com/mbostock/1667367) to demonstrate how we can drive a d3 brush with code.

<blockquote class="twitter-tweet" lang="en"><p>anybody know how to brush with code in <a href="https://twitter.com/hashtag/d3js?src=hash">#d3js</a>?</p>&mdash; klr (@timelyportfolio) <a href="https://twitter.com/timelyportfolio/status/509701031585148928">September 10, 2014</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

So I found [this discussion](https://groups.google.com/forum/#!topic/d3-js/vNaR-vJ9hMg), but I could not find an example demonstrating the steps proposed by Athan Reines.

<pre>
For auto-redraw such that the focus of a 1D brush matches the graphed domain, you need to do as follows:

(1) Apply the brush scale to the graphed domain (i.e., the brush extent) --> store in var brushExtent; (units: pixels)
(2) Within the brush element (class='brush'), select the <rect> with class='extent'.
(3) If the brush is horizontal (i.e., for the x-axis), set the 'x' attribute to the first value in brushExtent. This moves the start position of the focus <rect> to match the graphed domain. If the brush is vertical (i.e., for the y-axis), set the 'y' attribute to the second value in brushExtent.
(4) Next, set the 'width' attribute of the extent to brushExtent[1] - brushExtent[0]. The end of the brush focus is brushExtent[1], but the length of the focus is this minus the offset introduced by brushExtent[0]. (If a y-axis brush, switch [0] and [1]).

(*) The extent should now programmatically match the graphed domain.

I use this procedure as part of a resize function. Hope this works. 

-KG
</pre>

I do not follow the steps exactly.  Here is the code that drives our brush when a button is clicked.

```
  function drawBrush() {
    // our year will this.innerText
    console.log(this.innerText)

    // define our brush extent to be begin and end of the year
    brush.extent([new Date(this.innerText + '-01-01'), new Date(this.innerText + '-12-31')])

    // now draw the brush to match our extent
    // use transition to slow it down so we can see what is happening
    // remove transition so just d3.select(".brush") to just draw
    brush(d3.select(".brush").transition());

    // now fire the brushstart, brushmove, and brushend events
    // remove transition so just d3.select(".brush") to just draw
    brush.event(d3.select(".brush").transition().delay(1000))
  }
```

<hr/>
### Original Readme.md
This examples demonstrates how to use D3's brush component to implement focus + context zooming. Click and drag in the small chart below to pan or zoom.