var theWidth = $("#vis").width();
var formatPercent = d3.format(",.2%");
    var formatNumber = d3.format(",.2f");
    var formatWholeNumber = d3.format(",");    
    var formatDollarNumber = d3.format("$,.2f"); 
    var formatTime = d3.time.format.utc("%H:%M %p");


var parseTime = d3.time.format.utc("%H:%M").parse,
    midnight = parseTime("00:00");

var margin = {top: 30, right: 30, bottom: 50, left: 30},
    width = theWidth - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x = d3.time.scale.utc()
    .domain([midnight, d3.time.day.utc.offset(midnight, 1)])
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var svg = d3.select("#vis").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var div = d3.select("#vis").append("div").attr("class", "toolTip");

d3.csv("data/data.csv", type, function(error, data) {
  if (error) throw error;

  y.domain([0, d3.max(data, function(d) { return d.count; })]);

  svg.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.svg.axis()
          .scale(x)
          .orient("bottom")
          .tickFormat(d3.time.format.utc("%I %p")))
   	.selectAll("text")
      	.style("text-anchor", "end")
      	.attr("dx", "-.8em")
      	.attr("dy", "-.55em")
      	.attr("transform", "rotate(-60)" );          

  svg.append("g")
      .attr("class", "dots")
    .selectAll("path")
      .data(data)
    .enter().append("path")
      .attr("transform", function(d) { return "translate(" + x(d.time) + "," + y(d.count) + ")"; })
      .attr("d", d3.svg.symbol()
          .size(10))
	  .on("mousemove", function(d){ 		  
		  d3.select(this).style("stroke-width", "6")
		  d3.select(this).style("stroke","#610b30")
                    div.style("left", d3.event.pageX+"px");
                    div.style("top", d3.event.pageY-35+"px");
                    div.style("display", "inline-block");
                    div.html(formatTime(d.time)+"<br>"+d.count); 
                    
                })        
                .on("mouseout", function(d){
				d3.select(this).style("stroke-width", "1.5")
				d3.select(this).style("stroke","#c27e7e")					                
                    div.style("display", "none"); 	
                });
          

  var tick = svg.append("g")
      .attr("class", "axis axis--y")
      .call(d3.svg.axis()
          .scale(y)
          .tickSize(-width)
          .orient("left"))
    .select(".tick:last-of-type");

  var title = tick.append("text")
      .attr("dy", ".32em")
      .text("XXX per hour");

  tick.select("line")
      .attr("x1", title.node().getBBox().width + 6);
});

function type(d) {
  d.time = parseTime(d.time);
  d.time.setUTCHours((d.time.getUTCHours() + 24 - 7) % 24);
  return d;
}
