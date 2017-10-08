// Define dimensions of the plot
var margin = {top: 120, right: 60, bottom: 60, left: 180};
var height = 500; 
var width = 960;

// Define the transition duration
var transDur = 500;

// Set up a global variable for the names of the stats reported here
// (in hopes of making it easier to keep line colors consistent
var reportStats = [];

var stats;



// Load in the CRD quarterly stats table
d3.csv("qtr_stats.csv", function(crd) {

    // Format the variables as neeeded
    crd.forEach(function(d) {
        d.stat_year = +d.stat_year;
        d.stat_qtr = +d.stat_qtr;
        d.datestring = d.stat_year + " Q" + d.stat_qtr;
        d.qtr_result = +d.qtr_result;
    });

    // Subset to two sets of stats:
    // 1. Active Cases Reported for all metro residents and, separately,
    // just Denver residents.
    // 2. Active and latent tx starts and visits, for everyone
    var other_stats = ["Active Therapy Starts", "LTBI Therapy Starts", 
                       "Visits"];

    var qtrly = crd.filter(function(d) {
        return (d.stat_name == "Active Cases Reported" &&
                d.pt_group == "County of Residence: Denver") || 

               ((other_stats.indexOf(d.stat_name) > -1) && 
                d.pt_group == "All Patients")
            
            ; });


    // Assign the data outside of the function for later use
    stats = qtrly;


    // Load the initial stats table
    makeMultiTable(stats);


    // Make a vector for all of the stats, so that plot attributes can be
    // kept consistent - probably a better way to do this.
    d3.selectAll("tbody tr")
        .each(function(d) { reportStats.push(d.key); });


    // Setup the line plot
    setupPlot(height, width, margin);
    

});

