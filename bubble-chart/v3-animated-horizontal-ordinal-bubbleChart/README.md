Each bubble is an occupation. Hover bubbles to see info on that occupation

The size of the bubble shows how many jobs in this occupation there are in the 
US in 2014. Bubbles on the left are lower paying occupations
and bubbles on the right are higher paying jobs. Bubbles are bunched vertically 
into larger occupation categories (management occupations,
production occupations, etc.).

Uses the [d3.forceChart()](https://github.com/armollica/force-chart) plugin to draw the bubble layout.
Design inspired by this [graphic](http://www.nytimes.com/interactive/2013/05/25/sunday-review/corporate-taxes.html) from the New York Times.
Data source: [Bureau of Labor Statistics](http://www.bls.gov/emp/tables.htm).

Notes: Because this uses a [force layout](https://github.com/mbostock/d3/wiki/Force-Layout) for bubble positioning, the x-axis only
approximates where an occupation's bubble should be based on its wage. Wages from this dataset are [top-coded](https://en.wikipedia.org/wiki/Top-coded)
at $187,000. Wages for jobs at this top-coded level may, in reality, have higher median annual wages.
