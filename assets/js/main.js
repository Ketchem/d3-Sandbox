window.onload = function(){
    //SVG dimension variables
    var w = 900, h = 500;
    var dataArray = [10, 20, 30, 40, 50];
    var cityPop = [
        { 
            city: 'Madison',
            population: 233209
        },
        {
            city: 'Milwaukee',
            population: 594833
        },
        {
            city: 'Green Bay',
            population: 104057
        },
        {
            city: 'Superior',
            population: 27244
        }
    ];

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

    //Example 2.6 line 3
    var circles = container.selectAll(".circles") //create an empty selection
        .data(cityPop) //here we feed in an array
        .enter() //one of the great mysteries of the universe
        .append("circle") //inspect the HTML--holy crap, there's some circles there
        .attr("class", "circles")
        .attr("id", function(d){
            return d.city;
        })
        .attr("r", function(d){
            //calculate the radius based on population value as circle area
            var area = d.population * 0.01;
            return Math.sqrt(area/Math.PI);
        })
        .attr("cx", function(d, i){
            //use the index to place each circle horizontally
            return 90 + (i * 180);
        })
        .attr("cy", function(d){
            //subtract value from 450 to "grow" circles up from the bottom instead of down from the top of the SVG
            return 450 - (d.population * 0.0005);
        });
            
    // var innerCircle = container.append("circle") //put a new circle in the svg
    //     .datum(400)
    //     .attr("width", function(d){ //rectangle width
    //         return d; //400 * 2 = 800
    //     }) 
    //     .attr("height", function(d){ //rectangle height
    //         return d; //400
    //     })
    //     .attr("cx", 450) //position from left on the x (horizontal) axis
    //     .attr("cy", 250) //position from top on the y (vertical) axis
    //     .attr("r", 80) 
    //     .style("fill", "#42f468"); //fill color

    
    console.log(innerRect);
};
