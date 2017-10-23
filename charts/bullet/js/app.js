var thewidth = $("#chart").width();

var rectText = 'The total revenue for the federal government this year was ';
var lineText = 'The total expenditures for the federal government this year was ';
var units = " billion";


var margin = {top: 5, right: 40, bottom: 30, left: 65},
    width = thewidth - margin.left - margin.right,
    height = 50 - margin.top - margin.bottom;

var chart = d3.bullet()
    .width(width)
    .height(height);

d3.json("data/bullets.json", function(error, data) {
  var svg = d3.select("#chart").selectAll("svg")
      .data(data)
    .enter().append("svg")
      .attr("class", "bullet")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      .call(chart);

  var title = svg.append("g")
      .style("text-anchor", "end")
      .attr("transform", "translate(-6," + height / 2 + ")");

  title.append("text")
      .attr("class", "title")
      .text(function(d) { return d.title; })
      .style("fill", function(d) { return d.colora; });

  title.append("text")
      .attr("class", "subtitle")
      .attr("dy", "1em")
      .text(function(d) { return d.subtitle; });

  title.append("text")
      .attr("class", "subtitle2")
      .attr("dy", "2.1em")
      .text(function(d) { return d.subtitle2; });

  var numformat = d3.format("$0,000");

$('svg rect.measure').tipsy({
        gravity: 's',
        html: true,
        title: function() {
          var d = this.__data__, c = d[0], e = numformat(d);
          return rectText + e + units;
        }
      });


$('svg line').tipsy({
        gravity: 'n',
        html: true,
        title: function() {
          var d = this.__data__, c = d[0], e = numformat(d);
          return lineText + e + units;
        }
      });

});