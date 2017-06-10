This is an example of a tree digram where the nodes can be varied amongst the (range of symbols)[https://github.com/mbostock/d3/wiki/SVG-Shapes#symbol] available via the `d3.svg.symbol` command.

Many thanks to Josiah who asked the question of how this could be done. 

There are of course several different methods. A separate custom svg path could be declared and used or a more elegant and extensible method might be to apply the symbol type depending on the range of input values (as is used in Mike Bostock's [Force-directed Symbols](http://bl.ocks.org/mbostock/1062383).

It is used as an example and described in the book [D3 Tips and Tricks](https://leanpub.com/D3-Tips-and-Tricks).