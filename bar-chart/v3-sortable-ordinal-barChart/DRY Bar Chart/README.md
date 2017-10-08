A variation of the [example bar chart](/mbostock/3885304) using a slightly more [D.R.Y. style](http://en.wikipedia.org/wiki/Don't_repeat_yourself). The visual encoding is represented by two functions and their composition:

* The *value* accessor returns the value (or property) to encode for a given data object.
* The *scale* maps this value to a visual display encoding, such as a pixel position.
* The *map* function represents the composition *value* ○ *scale*, mapping from data to display.

Inspired by [Andrew Winterman](http://awinterman.github.io/)’s post, [Tooling for the Lazy Programmer: DRYing up D3](http://urbanairship.com/blog/2013/07/11/drying-up-d3).