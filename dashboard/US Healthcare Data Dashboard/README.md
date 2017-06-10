
# Final Project


The original data set can be found here: https://data.cms.gov/Medicare/Inpatient-Prospective-Payment-System-IPPS-Provider/97k6-zzx3

## Thesis 

My dashboard first communicates the average total covered healthcare charges across the US. This allows the viewer to see how the covered charges varies among the states. 

The first image in the dashboard is the bar chart, which shows a selection of the US states and shows median covered charges per state. Hovering over an individual bar (which corresponds to one US state) alters the pie chart beside the bars. The pie chart then shows the minimum, median, and maximum average covered charges among all hospitals across the state.

The final image in the dashboard is a map that communicates with a color gradient the median covered charges across all US states.

## Process

The data set used for the final project is from data.gov and it communicates healthcare financial information among hospitals across the US. To make the dashboard I aggregated the average covered charges by state, considering minimum, median, and maximum covered charges among hospitals.

In my EDA process I considered visualizing data for one state, perhaps creating a dashboard specific to California hospitals. Ultimately I chose to visualize healthcare data from across the US because I felt it was more compelling to allow the viewer to get a sense of which states have more or less average charges covered. 

The visual encodings are through bars, color gradient, pie chart, annotation, and a legend. The bars are an important encoding of the data because it gives the viewer a sense of how median covered charges vary by state as well as an exact measure via annotation. The pie chart gives a visual depiction of the difference between minimum, maximum, and median covered charges among each state as well as in total across all US states. Finally, the map and color gradient give the viewer a chance to visually compare these covered charges among each state.

The interactive elements of the dashboard include hover effects on the bar chart, pie chart, and map. The viewer can hover over a given bar which corresponds to a US state and this updates the pie chart with this state’s data. hovering over the sections of the pie chart updates the bars. By default the bars show the median covered charges for each state. By hovering over a section of the pie chart updates the bars to show that category (minimum, median, maximum) for each state. Finally, hovering over a given state on the map gives the exact value of the median covered charges.