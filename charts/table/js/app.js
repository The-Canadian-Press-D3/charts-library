d3.text("data/data.csv", function(data) {
    var parsedCSV = d3.csv.parseRows(data);
    var headings = [];
	for(i=0; i<parsedCSV[0].length; i++){
		headings.push(parsedCSV[0][i])
	}
    var container = d3.select("#vis")
        .append("table")
        .attr("class","rwd-table")
        .attr("id","thetable");
        
        container.selectAll("tr")
            .data(parsedCSV).enter()
            .append("tr")
               
        .selectAll("td")
            .data(function(d) { return d; }).enter()
            .append("td")
            .text(function(d) { return d; })
            .attr("data-th", function(d,i){
	            return headings[i];
            });
            
            
		d3.selectAll("tr:nth-child(2n)").attr("class","even")
		d3.selectAll("tr:nth-child(2n+1)").attr("class","odd")	
		louie();	            
            
});

function louie(){
var t = $('#thetable')
var firstTr = t.find('tr:first').remove()
firstTr.find('td').contents().unwrap().wrap('<th>')

t.prepend($('<thead></thead>').append(firstTr))	
}