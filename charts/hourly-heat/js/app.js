var accidents;
var measuring = "incidents";
    	var formatNumber = d3.format(",.2f");
    	var formatWholeNumber = d3.format(","); 
d3.csv("data/data.csv", function(data) {
  accidents = data;


///////////////////////////////////////////////////////////////////////////
//////////////////// Set up and initiate svg containers ///////////////////
///////////////////////////////////////////////////////////////////////////	

var days = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
	times = d3.range(24);


        var theWidth = $("#vis").width();
        
		var margin = {top: 30, right: 40, bottom: 60, left: 60};
        var width = theWidth - margin.left - margin.right;
        var height = 650 - margin.top - margin.bottom;


//SVG container
var svg = d3.select('#vis')
	.append("svg")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    var div = d3.select("#vis").append("div").attr("class", "toolTip");

var colorScale = d3.scale.linear()
	.domain([0, d3.max(accidents, function(d) {return d.count; })/2, d3.max(accidents, function(d) {return d.count; })])
//	.range(["#FFFFDD", "#3E9583", "#1F2D86"])
	.range(['#fee5d9','#fcae91','#fb6a4a','#de2d26','#a50f15'])
	//.interpolate(d3.interpolateHcl);

var dayLabels = svg.selectAll(".dayLabel")
    .data(days)
    .enter().append("text")
    .text(function (d) { return d; })
    .attr("y", 0)
    .attr("x", function (d, i) { return i * width/7 ; })
    .style("text-anchor", "end")
    .attr("transform", "translate(25," + -12 + ")");

var timeLabels = svg.selectAll(".timeLabel")
    .data(times)
    .enter().append("text")
    .text(function(d) { return d; })
    .attr("y", function(d, i) { return i * height/24; })
    .attr("x", 0)
    .style("text-anchor", "middle")
    .attr("transform", "translate(" + - (width/7) /2.5 + ", 17)");

var heatMap = svg.selectAll(".hour")
    .data(accidents)
    .enter().append("rect")
    .attr("y", function(d) { return (d.hour - 1) * (height/24); })
    .attr("x", function(d) { return (d.day - 1) * (width/7); })
    .attr("class", "hour bordered")
    .attr("width", (width/7))
    .attr("height", (height/24))
    .style("stroke", "white")
    .style("stroke-opacity", 0.6)
    .style("fill", function(d) { return colorScale(d.count); })
	.on("mouseover", function(d) {
		div.style("left", d3.event.pageX-50+"px");
        div.style("top", d3.event.pageY-55+"px");
        div.style("display", "inline-block");
        var num = parseInt(d.count);
        div.html(dayOfTheWeek(d.day)+" - "+hourtime(d.hour)+"<br>Amount: "+formatWholeNumber(num));
	    })
    .on("mouseout", function() {
		div.style("display", "none");
    })    




//Append credit at bottom

///////////////////////////////////////////////////////////////////////////
//////////////// Create the gradient for the legend ///////////////////////
///////////////////////////////////////////////////////////////////////////

//Extra scale since the color scale is interpolated
var countScale = d3.scale.linear()
	.domain([0, d3.max(accidents, function(d) {return d.count; })])
	.range([0, width])

//Calculate the variables for the temp gradient
var numStops = 10;
countRange = countScale.domain();
countRange[2] = countRange[1] - countRange[0];
countPoint = [];
for(var i = 0; i < numStops; i++) {
	countPoint.push(i * countRange[2]/(numStops-1) + countRange[0]);
}//for i

//Create the gradient
svg.append("defs")
	.append("linearGradient")
	.attr("id", "legend-traffic")
	.attr("x1", "0%").attr("y1", "0%")
	.attr("x2", "100%").attr("y2", "0%")
	.selectAll("stop") 
	.data(d3.range(numStops))                
	.enter().append("stop") 
	.attr("offset", function(d,i) { 
		return countScale( countPoint[i] )/width;
	})   
	.attr("stop-color", function(d,i) { 
		return colorScale( countPoint[i] ); 
	});

///////////////////////////////////////////////////////////////////////////
////////////////////////// Draw the legend ////////////////////////////////
///////////////////////////////////////////////////////////////////////////

var legendWidth = Math.min(width*0.8, 400);
//Color Legend container
var legendsvg = svg.append("g")
	.attr("class", "legendWrapper")
	.attr("transform", "translate(" + (width/2) + "," + (height-50) + ")");

//Draw the Rectangle
legendsvg.append("rect")
	.attr("class", "legendRect")
	.attr("x", -legendWidth/2)
	.attr("y", 100)
	//.attr("rx", hexRadius*1.25/2)
	.attr("width", legendWidth)
	.attr("height", 10)
	.style("fill", "url(#legend-traffic)");
	
//Append title
legendsvg.append("text")
	.attr("class", "legendTitle")
	.attr("x", 0)
	.attr("y", 75)
	.style("text-anchor", "middle")
	.text("Number of " + measuring);

//Set scale for x-axis
var xScale = d3.scale.linear()
	 .range([-legendWidth/2, legendWidth/2])
	 .domain([ 0, d3.max(accidents, function(d) { return d.count; })] );

//Define x-axis
var xAxis = d3.svg.axis()
	  .orient("bottom")
	  .ticks(5)
	  //.tickFormat(formatPercent)
	  .scale(xScale);

//Set up X axis
legendsvg.append("g")
	.attr("class", "axis")
	.attr("transform", "translate(0," + (75) + ")")
	.call(xAxis);

});

function dayOfTheWeek(x){
switch (x) {
    case "1":
        return "Monday";
        break;
    case "2":
        return "Tuesday";
        break;
    case "3":
        return "Wednesday";
        break;
    case "4":
        return "Thursday";
        break;
    case "5":
        return "Friday";
        break;
    case "6":
        return "Saturday";
        break;
    case "7":
        return "Sunday";       
}	
}

function hourtime(x){
switch (x) {
    case "1":
        return "Midnight to 1 a.m.";
        break;
    case "2":
        return "1 a.m. to 2 a.m.";
        break;
    case "3":
        return "2 a.m. to 3 a.m.";
        break;
    case "4":
        return "3 a.m. to 4 a.m.";
        break;
    case "5":
        return "4 a.m. to 5 a.m.";
        break;
    case "6":
        return "5 a.m. to 6 a.m.";
        break;
    case "7":
        return "6 a.m. to 7 a.m.";
        break;
    case "8":
        return "7 a.m. to 8 a.m.";
        break;
    case "9":
        return "8 a.m. to 9 a.m.";
        break;
    case "10":
        return "9 a.m. to 10 a.m.";
        break;
    case "11":
        return "Midnight to 1 a.m.";
        break;
    case "12":
        return "11 a.m. to noon";
        break;
    case "13":
        return "Noon to 1 p.m.";
        break;
    case "14":
        return "1 p.m. to 2 p.m.";
        break;
    case "15":
        return "2 p.m. to 3 p.m.";
        break;
    case "16":
        return "3 p.m. to 4 p.m.";
        break;
    case "17":
        return "4 p.m. to 5 p.m.";
        break;
    case "18":
        return "5 p.m. to 6 p.m.";
        break;
    case "19":
        return "6 p.m. to 7 p.m.";
        break;
    case "20":
        return "7 p.m. to 8 p.m.";
        break;        
    case "21":
        return "8 p.m. to 9 p.m.";
        break;
    case "22":
        return "9 p.m. to 10 p.m.";
        break;
    case "23":
        return "10 p.m. to 11 p.m.";
        break;
    case "24":
        return "11 p.m. to midnight";    
}	
}