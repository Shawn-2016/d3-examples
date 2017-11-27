var container = d3.select('#scatterPlot');
var legend = d3.select('#scatterPlot_legend');
d3.select('#title').text('Shots and Points');
d3.select('title').text('Scatterplot with Voronoi');

var vizcontrol = d3.select('#controls');
var viztable = vizcontrol.append('table').attr('align', 'center');

var row1 = viztable.append('tr').append('td').attr('align', 'left');
row1.append('input').attr('name', 'dataset').attr('id', 'perSet').attr('type', 'radio').attr('value', 'perSet').attr('checked', 'checked');
row1.append('label').html('&nbsp; per Set Totals').attr('id', 'perSet_label');
document.getElementById("perSet").addEventListener("change", function() { 
   displayPerSet();
   sp.update();
});

var row2 = viztable.append('tr').append('td').attr('align', 'left');
row2.append('input').attr('name', 'dataset').attr('id', 'perGame').attr('type', 'radio').attr('value', 'perGame');
row2.append('label').html('&nbsp; per Game Avgerages').attr('id', 'perGame_label');
document.getElementById("perGame").addEventListener("change", function() { 
   displayPerGame();
   sp.update();
});

viztable.append('input').attr('autocomplete', 'off').attr('name', 'highlight')
      .attr('class', 'valid').attr('type', 'text').attr('value', '')
      .attr('id', 'highlight').attr('placeholder', 'Player Name').attr('tabindex', '3')
      .attr('spellcheck', 'false')
      .attr('autofocus');

highlight.addEventListener("keyup", function(event) {
   if (!highlight.value) sp.highlight(undefined);
   if (event.keyCode == 13) {
      sp.highlight(highlight.value);
   }
});


function init() {
   sp.options({
      id    : 'first',

      data: {
         identifier:    'h2h',
         abbreviation:  'Set Score',
         group:         'Set Score',
         sub_group:     'gid',
         r_scale:       'PPG',
         x:             'Total Shots',
         y:             'Total Points'
      },

      axes  : {
         x: { label:   'Shots per Set' },
         y: { label:   'Points per Set' } 
      },

      datapoints: {
         radius: {
            default: [2, 3],
            mobile:  [1, 1]
         }
      },

      legend: { 
         dom_element: legend,
         title:   'SET SCORE',
         text:    'Click Legend to select Score groups.<br> Click Legend title to reset.',
         },

      display: {
         reset:         '#scatterPlot_legend',
         zoom:          true,
         bubble_legend: false,
         highlight: {
            radius:     7,
            fill:       undefined
         }
      }
   });

   sp.events({
      'element': { 'click': highlightMatch }
   });

   sp.colors({
      "7-6":      "#2074A0",
      "7-5":      "#66489F",
      "6-4":      "#991C71", 
      "6-3":      "#C20049", 
      "6-2":      "#E01A25", 
      "6-1":      "#E58903", 
      "6-0":      "#EFB605"
   });

   sp.duration(1000);
}

function displayPerSet() {
   sp.options({
      data: {
         identifier:    'h2h',
         abbreviation:  'Set Score',
         group:         'Set Score',
         sub_group:     'gid',
         r_scale:       'PPG',
         x:             'Total Shots',
         y:             'Total Points'
      },
      axes  : {
         x: { label:   'Shots per Set' },
         y: { label:   'Points per Set' } 
      }
   })
}

function displayPerGame() {
   sp.options({
      data: {
         identifier:    'h2h',
         abbreviation:  'Set Score',
         group:         'Set Score',
         sub_group:     'gid',
         r_scale:       'PPG',
         x:             'SPG',
         y:             'PPG'
      },

      axes  : {
         x: { label:   'Average Shots per Game' },
         y: { label:   'Average Points per Game' } 
      }
   });
}


sp = scatterPlot();
init();

d3.json('./atp_wta.dat', function(err, data) {

   // PPG: "5.67"
   // SPG: "26.17"
   // Set Score: "6-0"
   // Total Points: 34
   // Total Shots: 157
   // Tournament: "Maui"
   // h2h: "Michael Mmoh v. Kyle Edmund"
   // gid: 'MichaelMmohKyleEdmundMaui2016'

   sp.data(data.data);
   container.call(sp);
   sp.update();
})

function highlightMatch(d, i, element) {
   var group = [];
   d3.selectAll('circle').each(function() { 
      var set = d3.select(this);
      if (set.attr('sub_group') == d.gid) {
         set.attr('r', 10);
         set.style('opacity', 1);
         group.push([set.attr('cx'), set.attr('cy')]);
      } else {
         set.attr('r', 2);
         set.style('opacity', .2);
      }
   })
}
