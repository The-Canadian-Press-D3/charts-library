var theWidth = $("#vis").width();
var suffix = "songs"
var chart = venn.VennDiagram()
                 .width(theWidth)
                 .height(theWidth);

var div = d3.select("#vis")
div.datum(sets).call(chart);

var tooltip = d3.select("#vis").append("div")
    .attr("class", "toolTip");



div.selectAll("path")
    .style("stroke-opacity", 0)
    .style("stroke", "#fff")
    .style("stroke-width", 3)

div.selectAll("g")
    .on("mouseover", function(d, i) {
        // sort all the areas relative to the current item
        venn.sortAreas(div, d);

        // Display a tooltip with the current size
        tooltip.transition().duration(400).style("opacity", .9);
        tooltip.text(d.size + " "+ suffix);

        // highlight the current path
        var selection = d3.select(this).transition("tooltip").duration(400);
        selection.select("path")
            .style("fill-opacity", d.sets.length == 1 ? .4 : .1)
            .style("stroke-opacity", 1);
    })

    .on("mousemove", function() {  
            tooltip.style("left", d3.event.pageX-50+"px");
            tooltip.style("top", d3.event.pageY-65+"px");	    
    })

    .on("mouseout", function(d, i) {
        tooltip.transition().duration(400).style("opacity", 0);
        var selection = d3.select(this).transition("tooltip").duration(400);
        selection.select("path")
            .style("fill-opacity", d.sets.length == 1 ? .25 : .0)
            .style("stroke-opacity", 0);
    });