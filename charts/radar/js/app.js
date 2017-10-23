var theWidth = $("#vis").width();
var formatPercent = d3.format(",.2%");
    var formatNumber = d3.format(",.2f");
    var formatWholeNumber = d3.format(",");    
    var formatDollarNumber = d3.format("$,.2f"); 
    
var w = theWidth*.9,
	h = theWidth*.9;

var colorscale = d3.scale.category10();


var dataset = [[ 
{axis:"Games Played",value:782,owner:"Crosby"},
{axis:"Goals",value:382,owner:"Crosby"},
{axis:"Assists",value:645,owner:"Crosby"},
{axis:"Points",value:1027,owner:"Crosby"},
{axis:"PIM",value:576,owner:"Crosby"}],[
{axis:"Games Played",value:927,owner:"Gretzky"},
{axis:"Goals",value:723,owner:"Gretzky"},
{axis:"Assists",value:1366,owner:"Gretzky"},
{axis:"Points",value:2089,owner:"Gretzky"},
{axis:"PIM",value:410,owner:"Gretzky"}]];

var div = d3.select("#vis").append("div").attr("class", "toolTip");

//Options for the Radar chart, other than default
var theOptions = {
  w: w,
  h: h,
  maxValue: 2400,
  levels: 6,
  ExtraWidthX: 100
  //color: color
}

RadarChart.draw("#vis", dataset, theOptions);


