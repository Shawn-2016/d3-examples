# reusable updating voroni scatterplot

### Design based on original by [NadiehBremer](https://twitter.com/NadiehBremer) at [Visual Cinnamon](http://www.visualcinnamon.com/2015/07/voronoi.html)

#### [See this block in production with Live Data](http://tennisvisuals.com/Scatter)

#### [Find the Latest Code on GitHub](https://github.com/TennisVisuals/)

### Features:
- Dynamic data transitions
- Highlighting of data points
- Zoom option for selections (Legend Clicks)
- Events are configurable as options such that external functions can be seamlessly integrated
 - e.g. external tooltips can be configured for mouseover events

### Accessors:
#### *by default accessors with no parameters return current values*
- chart.duration(transition-time) // duration of transitions
- chart.options(object) // for options that don't have accessors
- chart.width(width)
- chart.height(height)
- chart.data(data) // set data
- chart.update() // update chart
- chart.colors(object) // chart.colors({'group': 'color1', 'group': 'color2'})
- chart.highlight(identifier) // highlight datapoint (configurable in options)

##### operations on data held in chart instance
- chart.pop()
- chart.push(row) -or- chart.push([row, row])
