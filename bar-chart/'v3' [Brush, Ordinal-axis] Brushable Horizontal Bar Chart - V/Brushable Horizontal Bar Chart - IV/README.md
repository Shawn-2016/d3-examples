Although there visually seems no difference between this brushable horizontal bar chart and versions [I](http://bl.ocks.org/nbremer/d8dff2fa37345d54f9e58eb74db460d0), [II](http://bl.ocks.org/nbremer/aadec1b834a6602575a217fea67f6f44), and [III](http://bl.ocks.org/nbremer/305ff3e402c269d33bbe6828f9848cae), this one is actually build on a different principle. And it is much, much better than the previous 3 versions in terms of UX, so just ignore those others :) (and as a bonus, there is way less code needed)

In this version, when you scroll your mouse, the bars in the big chart slide across the screen without any transitions.

As a note, there is no x scale adjustment in this version. Check out [version V](http://bl.ocks.org/nbremer/4c015860931fb6a13afc7bac51f40b43) for x scale adjustment

The idea for this came from [a tweet by Robert Monfera](https://twitter.com/monfera/status/758020571066200065) and an answer on [stackOverflow by AmeliaBR](http://stackoverflow.com/questions/21485339/d3-brushing-on-grouped-bar-chart) helped me figure out the first part.

You have the option to adjust how many bars you're seeing by adjusting the size of the little box on the right mini chart. You can also move the box and see the bars that you've selected appear in a bigger form on the left. Moving can be done either by grabbing and moving the box or scrolling.

For a bit more background, you can read my mini-blog about it [Brushable & interactive bar chart in d3.js](http://www.visualcinnamon.com/2016/07/brush-bar-chart-d3.html)

