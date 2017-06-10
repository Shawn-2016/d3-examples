This example demonstrates [D3](https://d3js.org)’s **general update pattern**, where a data-join is followed by operations on the *enter*, *update* and *exit* selections. Entering elements are shown in green, while updating elements are shown in black. Exiting elements are removed immediately, so they're invisible.

This example does not use a key function for the data-join, so elements may change their associated letter. Entering elements are always added to the end: when the new data has more letters than the old data, new elements are entered to display the new letters. Likewise, exiting letters are always removed from the end when the new data has *fewer* letters than the old data.

Next: [Key Functions](/mbostock/3808221)
