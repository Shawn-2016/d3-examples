an **iteration** on [Sporthorse Foal Registrations](http://bl.ocks.org/phoebebright/3878819) by [phoebebright](http://bl.ocks.org/phoebebright)

an **example** of using [d3](http://d3js.org/) + [crossfilter](http://square.github.io/crossfilter/) together to make an svg map with linked bar charts

these **additions** and **modifications** were made made along the way:

- format code so that it's comfortable for me
- comment out the title on the page, and use the text for the title of the bl.ock
- set `.style('white-space', 'nowrap')` so that for `Northern Ireland` and `1999` the bar's text fit's within the bar's height
- on mouseover of the county bar the `cf` crossfilter object is filtered for only that county.  then, `updateMap` function is called, which re-renders the map with only the selected county shaded.  on mouseout of the county bar, the cf object is unfiltered and the `updatemMap` function is called once again.  Now all of the counties on the map have data-driven fill colors.
- hide the breed code text
- abstract out the map svg out of `index.html` and into a separate file, `ireland.svg`.  this is more difficult that you might think. these links proved to be quite helpful:

[d3 google group thread on working with external svg files](https://groups.google.com/forum/embed/#!topic/d3-js/-qYDy71c_lA)

[an external svg example](http://bl.ocks.org/mbostock/1014829)

[an iteration on that example](http://bl.ocks.org/biovisualize/1238376)

[jsfiddle with .each() technique](http://jsfiddle.net/christopheviau/XnG6r/)

Ok, we figured it out. the counties of Northern Ireland now show a data-driven fill color when you mouse over the Northern Ireland bar. Cool!  hat tip to [@lucastimmons](https://twitter.com/lucastimmons), [phoebebright](https://twitter.com/phoebebright), and [@DashingD3js](https://twitter.com/DashingD3js) for the implementation ideas.  

here's the approach I went with:

#### in ireland.svg 
- move the path for county Fermanagh from `<g id="republic">` to `<g id="northernireland">` 
- add the class `northernireland` to all of the paths that are children of the `g` element with `id="northernireland".
- set fill color for county Fermanagh path to `#fff`.  I'm curious why the fill was originally set `#d1d7ab` for this county.  Maybe the svg was repurposed from another graphic originally about county Fermanagh?
- remove the styles `;stroke-dashoffset:0;marker:none;visibility:visible;display:inline;overflow:visible` from the county Fermanagh path to match the paths for the other Northern Ireland counties.
- add `sodipodi:nodetypes="cssscssscsssssscccssssscsssssssc"` to the county Fermanagh path to match the paths for the other Northern Ireland counties.  What is this `sodipodi:nodetypes`? It looks like [some artifact from Inkscape](http://www.inkscapeforum.com/viewtopic.php?t=4590)

have comments or thoughts on this example? [tweet at me](https://twitter.com/micahstubbs) or comment on the [github gist](https://gist.github.com/micahstubbs/99df29f258860e53c5e2).