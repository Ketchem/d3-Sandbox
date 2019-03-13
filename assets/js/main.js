window.onload = function(){
    //SVG dimension variables
    var w = 900, h = 500;


    var container = d3.select("body") //get the <body> element from the DOM
        .append("svg")
        .attr("width", w) //assign the width
        .attr("height", h) //assign the height
        .attr("class", "container") //always assign a class (as the block name) for styling and future selection
        .style("background-color", "rgba(0,0,0,0.2)");


    var innerRect = container.append("rect") //put a new rect in the svg
        .datum(400)
        .attr("width", function(d){ //rectangle width
            return d * 2; //400 * 2 = 800
        }) 
        .attr("height", function(d){ //rectangle height
            return d; //400
        })
        .attr("x", 50) //position from left on the x (horizontal) axis
        .attr("y", 50) //position from top on the y (vertical) axis
        .style("fill", "#FFFFFF"); //fill color


    
    var innerCircle = container.append("circle") //put a new circle in the svg
        .datum(400)
        .attr("width", function(d){ //rectangle width
            return d; //400 * 2 = 800
        }) 
        .attr("height", function(d){ //rectangle height
            return d; //400
        })
        .attr("cx", 450) //position from left on the x (horizontal) axis
        .attr("cy", 250) //position from top on the y (vertical) axis
        .attr("r", 80) 
        .style("fill", "#42f468"); //fill color
    console.log(innerRect);
};
