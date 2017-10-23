var thewidth = $("#wrapper").width();

var margin = {top: 50, right: 20, bottom: 10, left: 65},
    width = thewidth - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var y = d3.scale.ordinal()
    .rangeRoundBands([0, height], .3);

var x = d3.scale.linear()
    .rangeRound([0, width]);

var color = d3.scale.ordinal()
    .range(['#7b3294','#c2a5cf','#DDDDDD','#a6dba0','#008837']);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("top");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")

var svg = d3.select("#figure").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("id", "d3-plot")
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  color.domain(["Strongly disagree", "Disagree", "Neither agree nor disagree", "Agree", "Strongly agree"]);

  d3.csv("data/data.csv", function(error, data) {

  data.forEach(function(d) {
    // calc percentages
    d["Strongly disagree"] = +d[1]*100/d.N;
    d["Disagree"] = +d[2]*100/d.N;
    d["Neither agree nor disagree"] = +d[3]*100/d.N;
    d["Agree"] = +d[4]*100/d.N;
    d["Strongly agree"] = +d[5]*100/d.N;
    var x0 = -1*(d["Neither agree nor disagree"]/2+d["Disagree"]+d["Strongly disagree"]);
    var idx = 0;
    d.boxes = color.domain().map(function(name) { return {name: name, x0: x0, x1: x0 += +d[name], N: +d.N, n: +d[idx += 1]}; });
  });

  var min_val = d3.min(data, function(d) {
          return d.boxes["0"].x0;
          });

  var max_val = d3.max(data, function(d) {
          return d.boxes["4"].x1;
          });

  x.domain([min_val, max_val]).nice();
  var qlenght = data.map(function(d) { return d.QN; })
  y.domain(data.map(function(d) { return d.QN; }));

  svg.append("g")
      .attr("class", "x axis")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)

  var vakken = svg.selectAll(".question")
      .data(data)
    .enter().append("g")
      .attr("class", "bar")
	  .attr("data-question", function(d) { return d["Q"]})      
      .attr("transform", function(d) { return "translate(0," + y(d.QN) + ")"; });

 var div = d3.select("#figure").append("div").attr("class", "toolTip");

var numberformat = d3.format(",.2%");

  var bars = vakken.selectAll("rect")
      .data(function(d) { return d.boxes; })
    .enter().append("g").attr("class", "subbar");

  bars.append("rect")
      .attr("height", y.rangeBand())
      .attr("x", function(d) { return x(d.x0); })
      .attr("width", function(d) { return x(d.x1) - x(d.x0); })
      .style("fill", function(d) { return color(d.name); })
      .on("mousemove", function(d){ 
				        d3.select(this).attr({
			              stroke: "black"
			            });
			            d3.select(this).style({
			              "stroke-width": "3",
			              "fill-opacity": "1"
			            });        
                    div.style("left", d3.event.pageX-50+"px");
                    div.style("top", d3.event.pageY+30+"px");
                    div.style("display", "inline-block");
                    $('#thequestiontext').html($(this).parent().parent()[0].dataset.question);
                    div.html($(this).parent().parent()[0].dataset.question+"<br>"+d.name +": "+d.n + " ("+numberformat((d.n/d.N))+")");                            
                })
      .on("mouseout", function(d){
	  				$('#thequestiontext').html("Choose a question...");
                    div.style("display", "none");
		            d3.select(this).attr({
		              stroke: "none"
		            });                           
                });      
      

  bars.append("text")
      .attr("x", function(d) { return x(d.x0); })
      .attr("y", y.rangeBand()/2)
      .attr("dy", "0.5em")
      .attr("dx", "0.5em")
      .style("font" ,"10px 'Roboto Slab', sans-serif")
      .style("text-anchor", "begin")
      .text(function(d) { return d.n !== 0 && (d.x1-d.x0)>3 ? d.n : "" });

  vakken.insert("rect",":first-child")
      .attr("height", y.rangeBand())
      .attr("x", "1")
      .attr("width", width)
      .attr("fill-opacity", "0.5")
      .style("fill", "#F5F5F5")
      .attr("class", function(d,index) { return index%2==0 ? "even" : "uneven"; });

  svg.append("g")
      .attr("class", "y axis")
  .append("line")
      .attr("x1", x(0))
      .attr("x2", x(0))
      .attr("y2", height);

  d3.selectAll(".axis path")
      .style("fill", "none")
      .style("stroke", "#000")
      .style("shape-rendering", "crispEdges")

  d3.selectAll(".axis line")
      .style("fill", "none")
      .style("stroke", "#000")
      .style("shape-rendering", "crispEdges")

});

$('#legendtrigger').mouseover(function(){
	$('#legend').css("display","block");
})
$('#legendtrigger').mouseout(function(){
	$('#legend').css("display","none");
})
