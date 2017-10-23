var theWidth = $("#vis").width();

var margin = {top: 20, right: 20, bottom: 100, left: 50};

// For the colour function
var domainMax;
var domainMin;

	var ispercent = false;
//	var suffix = ' billion';
	var suffix = '';	
	var formatPercent = d3.format(",.2%");
    var formatNumber = d3.format(",.2f");
    var formatWholeNumber = d3.format(",");    
    var formatDollarNumber = d3.format("$,.2f");      
    var formatDate2 = d3.format("%B %d, %Y");        
    
 var width = theWidth*.85;
if(theWidth>=500){
    var height = 650;
}else if(theWidth>=450){
	var height = 1100;
}else{
	var height = 1500;
}

    
        cellSize = 18; // cell size

    var no_months_in_a_row = Math.floor(width / (cellSize * 7 + 50));
    var shift_up = cellSize * 3;

    var day = d3.time.format("%w"), // day of the week
        day_of_month = d3.time.format("%e") // day of the month
        day_of_year = d3.time.format("%j")
        week = d3.time.format("%U"), // week number of the year
        month = d3.time.format("%m"), // month number
        year = d3.time.format("%Y"),
        percent = d3.format(".1%"),
        format = d3.time.format("%Y-%m-%d");

            

    var svg = d3.select("#vis").selectAll("svg")
        .data(d3.range(2009, 2010))
      .enter().append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("class", "RdYlGn")
      .append("g")
	  .attr("transform", "translate("+margin.left+",0)");
	  
    var div = d3.select("#vis").append("div").attr("class", "toolTip");	  

    var rect = svg.selectAll(".day")
        .data(function(d) { 
          return d3.time.days(new Date(d, 0, 1), new Date(d + 1, 0, 1));
        })
      .enter().append("rect")
        .attr("class", "day")
        .attr("width", cellSize)
        .attr("height", cellSize)
        .attr("x", function(d) {
          var month_padding = 1.2 * cellSize*7 * ((month(d)-1) % (no_months_in_a_row));
          return day(d) * cellSize + month_padding; 
        })
        .attr("y", function(d) { 
          var week_diff = week(d) - week(new Date(year(d), month(d)-1, 1) );
          var row_level = Math.ceil(month(d) / (no_months_in_a_row));
          return (week_diff*cellSize) + row_level*cellSize*8 - cellSize/2 - shift_up;
        })
        .datum(format);

    var month_titles = svg.selectAll(".month-title")  // Jan, Feb, Mar and the whatnot
          .data(function(d) { 
            return d3.time.months(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
        .enter().append("text")
          .text(monthTitle)
          .attr("x", function(d, i) {
            var month_padding = 1.2 * cellSize*7* ((month(d)-1) % (no_months_in_a_row));
            return month_padding;
          })
          .attr("y", function(d, i) {
            var week_diff = week(d) - week(new Date(year(d), month(d)-1, 1) );
            var row_level = Math.ceil(month(d) / (no_months_in_a_row));
            return (week_diff*cellSize) + row_level*cellSize*8 - cellSize - shift_up;
          })
          .attr("class", "month-title")
          .attr("d", monthTitle);

    var year_titles = svg.selectAll(".year-title")  // Jan, Feb, Mar and the whatnot
          .data(function(d) { 
            return d3.time.years(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
        .enter().append("text")
          .text(yearTitle)
          .attr("x", function(d, i) { return width/2 - 100; })
          .attr("y", function(d, i) { return cellSize*5.5 - shift_up; })
          .attr("class", "year-title")
          .attr("d", yearTitle);

    d3.csv("data/data.csv", function(error, csv) {
	    	//domainMax = Math.max(csv["Adj Close"])
	    	console.log(csv)
			domainMax = d3.max(csv, function(d) { return +d.Open;} );
			domainMin = d3.min(csv, function(d) { return +d.Open;} );
      var data = d3.nest()
        .key(function(d) { return d.Date; })		
        // pick the data source column here
        //.rollup(function(d) { return (d[0].Close - d[0].Open) / d[0].Open; })
        .rollup(function(d){ return d[0]["Open"]})
        .map(csv);
        
        
var colorScale = d3.scale.quantile()
	.domain([domainMin, domainMax])    
    .range(d3.range(11).map(function(d) { return "q" + d + "-11"; }));    
                           
      rect.filter(function(d) { return d in data; })
          .attr("class", function(d) { 
	          return "day "+ colorScale(data[d]); })
        .select("title")
          .text(function(d) { return d + ": " + percent(data[d]); });

      //  Tooltip
      rect.on("mouseover", mouseover);
      rect.on("mouseout", mouseout);
      function mouseover(d) {
	      div.style("left", d3.event.pageX-50+"px");
                    div.style("top", d3.event.pageY-65+"px");
                    div.style("display", "inline-block");      
          console.log(data[d]);                   
//        var percent_data = (data[d] !== undefined) ? percent(data[d]) : percent(0);
 //       var purchase_text = d + ": " + percent_data;
		var popuptext = (data[d] !== undefined) ? formatNumber(data[d]) : "No data";
        div.html(d+"<br>"+popuptext);

      }
      function mouseout (d) {
	  div.style("display", "none"); 	
      }


var legend = d3.select("#legend").append("svg").attr("class", "RdYlGn");
var legendwidth = (theWidth/2);
var boxwidth = legendwidth/14;

legend.append("text")
	.attr("text-anchor","start")
	.text(formatNumber(domainMin))
	.attr("class", "legendTitle")
	.attr("x", 0)
	.attr("y", 30)
	
legend.append("text")
	.attr("text-anchor","middle")
	.text(formatNumber(domainMax))
	.attr("class", "legendTitle")
	.attr("x", 12*boxwidth-10)
	.attr("y", 30)	

	legend.append("rect")
        .attr("class", "day2")
        .attr("width", boxwidth)
        .attr("height", boxwidth)
        .attr("x", 0)
        .attr("y", 60);

	for(i=0; i<11; i++){
	legend.append("rect")
        .attr("class", "day q"+i+"-11")
        .attr("width", boxwidth)
        .attr("height", boxwidth)
        .attr("x", boxwidth+(i*boxwidth))
        .attr("y", 60)		
	}
	legend.append("rect")
        .attr("class", "day2")
        .attr("width", boxwidth)
        .attr("height", boxwidth)
        .attr("x", 12*boxwidth)
        .attr("y", 60)		


    });
    

    function dayTitle (t0) {
      return t0.toString().split(" ")[2];
    }
    function monthTitle (t0) {
      return t0.toLocaleString("en-us", { month: "long" });
    }
    function yearTitle (t0) {
      return t0.toString().split(" ")[3];
    }