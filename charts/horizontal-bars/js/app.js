	var ispercent = false;
	var suffix = ' billion';

    var margin = {top: 25, right: 25, bottom: 5, left: 50},
            width = parseInt(d3.select('#vis').style('width'), 10) - margin.left - margin.right,
            height = 400 - margin.top - margin.bottom;

    var div = d3.select("#vis").append("div").attr("class", "toolTip");

    var formatPercent = d3.format("");

    var y = d3.scale.ordinal()
            .rangeRoundBands([height, 0], .2, 0.5);

    var x = d3.scale.linear()
            .range([0, width]);

    var xAxis = d3.svg.axis()
            .scale(x)
            .tickSize(-height)
            .orient("bottom");

    var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left");
    //.tickFormat(formatPercent);

    var svg = d3.select("#vis").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .attr("stroke-dasharray","2,2")      
            .call(xAxis);

    
  d3.csv("data/data.csv", function(d) {

  return {
    label : d.label,
    value : d.value,
    bold : d.bold,
  };
}, function(data) {
 change(data);
});	  
	  

    function change(dataset) {

        y.domain(dataset.map(function(d) { return d.label; }));
        x.domain([0, d3.max(dataset, function(d) { return d.value*1.25; })]);

        svg.append("g")
                .attr("class", "x axis ")
                .attr("transform", "translate(0," + height + ")")
				.attr("stroke-dasharray","2,2")                      
                .call(xAxis);
                
                

        svg.select(".y.axis").remove();
        svg.select(".x.axis").remove();

        svg.append("g")
                .attr("class", "y axis")
                .call(yAxis)
                .append("text")
                .attr("transform", "rotate(-90)")
                .attr("x", -40)
                .attr("y",-40)
                .attr("dx", ".1em")
                .style("text-anchor", "end");


        var bar = svg.selectAll(".bar")
                .data(dataset, function(d) { return d.label; });
        // new data:
        bar.enter().append("rect")
                .attr("class", function(d) { return "bar bold"+d.bold; })
                .attr("x", function(d) { return x(d.value); })
                .attr("y", function(d) { return y(d.label); })
                .attr("width", function(d) { return width-x(d.value); })
                .attr("height", y.rangeBand());

        bar
                .on("mousemove", function(d){
				        d3.select(this).attr({
			              stroke: "pink"
			            });
			            d3.select(this).style({
			              "stroke-width": "2",
			              "fill-opacity": "1"
			            });        
                    div.style("left", d3.event.pageX+10+"px");
                    div.style("top", d3.event.pageY-25+"px");
                    div.style("display", "inline-block");
                    if(ispercent){
	                    div.html("20"+(d.label)+"<br>"+(d.value)+"%");
                    }else{
	                    div.html("20"+(d.label)+"<br>$"+(d.value)+suffix);
                    }
                    
                });
        bar
                .on("mouseout", function(d){
                    div.style("display", "none");
		            d3.select(this).attr({
		              stroke: "none"
		            });  
			            d3.select(this).style({
			              "fill-opacity": "0.7"
			            });     		                              
                });

        // removed data:
        bar.exit().remove();

        // updated data:
        bar.transition()
                .duration(1000)
                .attr("x", function(d) { return 0; })
                .attr("y", function(d) { return y(d.label); })
                .attr("width", function(d) { return x(d.value); })
                .attr("height", y.rangeBand());

    };