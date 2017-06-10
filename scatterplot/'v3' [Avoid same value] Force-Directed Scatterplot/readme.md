Here is an alternative method to resolve the overplotting issue faced by scatterplots: Use a force-directed layout to create jitters in the point positions.

Jittering is a common technique--along with transparency--but jittering is usually accomplished by randomly adjusting the point positions, whereas a force-directed algorithm is a simple yet principled way to avoid overplotting. As with all jittering, this comes at the cost of reduced accuracy since the position of each point is no longer an exact representation of the point's data.

Compare this with a [scatterplot that has no jittering](http://bl.ocks.org/mbostock/3887118):

You can also check the "Collision detection" box to prevent points from overlapping.

This mashup combines code and ideas from several different examples by [Jim Vallandingham](http://vallandingham.me/) and [Mike Bostock](http://bost.ocks.org/mike/):

* [Using and Abusing the Force](http://vallandingham.me/force_talk/)
* [Scatterplot](http://bl.ocks.org/mbostock/3887118)
* [Multi-Foci Force Layout](http://bl.ocks.org/mbostock/1804919)