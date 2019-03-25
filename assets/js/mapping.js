(function(){

    //variables for data join
    var attrArray = ["varA", "varB", "varC", "varD", "varE"];
    var expressed = attrArray[0]; // initial attribute

    //chart frame dimensions
    var chartWidth = window.innerWidth * 0.425,
        chartHeight = 473,
        leftPadding = 25,
        rightPadding = 2,
        topBottomPadding = 5,
        chartInnerWidth = chartWidth - leftPadding - rightPadding,
        chartInnerHeight = chartHeight - topBottomPadding * 2,
        translate = "translate(" + leftPadding + "," + topBottomPadding + ")";

    //create a scale to size bars proportionally to frame
    var yScale = d3.scaleLinear()
        .range([463, 0])
        .domain([0, 100]);


    //begin script when window loads
    window.onload = setMap();


    function setMap(){

        //map frame dimensions
        var width = window.innerWidth * 0.5,
            height = 460;

        //create new svg container for the map
        var map = d3.select("body")
            .append("svg")
            .attr("class", "map")
            .attr("width", width)
            .attr("height", height);

        //create Albers equal area conic projection centered on France
        var projection = d3.geoAlbers()
            .center([0, 46.2])
            .rotate([-2, 0, 0])
            .parallels([43, 62])
            .scale(2500)
            .translate([width / 2, height / 2]);

        var path = d3.geoPath()
            .projection(projection);

        var dataSets = [];
        dataSets.push(d3.csv("assets/data/unitsData.csv"));
        dataSets.push(d3.json("assets/data/EuropeCountries.topojson"));
        dataSets.push(d3.json("assets/data/FranceRegions.topojson"));
        console.log(dataSets[0]);

        Promise.all(dataSets).then(function(values) {
            // place graticule on map
            setGraticule(map, path);

            var europeCountries = topojson.feature(values[1], values[1].objects.EuropeCountries);
            var franceRegions = topojson.feature(values[2], values[2].objects.FranceRegions);
            // console.log(franceRegions.features);

            var csvData = values[0];

            var countries = map.append("path")
                .datum(europeCountries)
                .attr("class", "countries")
                .attr("d", path);


            //join csv data to GeoJSON enumeration units
            franceRegions = joinData(franceRegions.features, csvData);

            var colorScale = makeColorScale(csvData);

            //add enumeration units to the map
            setEnumerationUnits(franceRegions, map, path, colorScale);

            setChart(csvData, colorScale);

            createDropdown(csvData);

        }); // end of promise all
    }; // end of setMap()

    function setGraticule(map, path){
        var graticule = d3.geoGraticule()
            .step([5, 5]);

        var gratBackground = map.append("path")
            .datum(graticule.outline()) //bind graticule background
            .attr("class", "gratBackground") //assign class for styling
            .attr("d", path) //project graticule

        var gratLines = map.selectAll(".gratLines") //select graticule elements that will be created
            .data(graticule.lines()) //bind graticule lines to each element to be created
            .enter() //create an element for each datum
            .append("path") //append each element to the svg as a path element
            .attr("class", "gratLines") //assign class for styling
            .attr("d", path); //project graticule lines
    };

    function joinData(franceRegions, csvData){
        for (var i=0; i<csvData.length; i++){
            var csvRegion = csvData[i]; //the current region
            var csvKey = csvRegion.adm1_code; //the CSV primary key

            //loop through geojson regions to find correct region
            for (var a=0; a<franceRegions.length; a++){

                var geojsonProps = franceRegions[a].properties; //the current region geojson properties
                var geojsonKey = geojsonProps.adm1_code; //the geojson primary key

                //where primary keys match, transfer csv data to geojson properties object
                if (geojsonKey == csvKey){

                    //assign all attributes and values
                    attrArray.forEach(function(attr){
                        var val = parseFloat(csvRegion[attr]); //get csv attribute value
                        geojsonProps[attr] = val; //assign attribute and value to geojson properties
                    });
                };
            };
        };

        return franceRegions;
    };

    function setEnumerationUnits(franceRegions, map, path, colorScale){
        var regions = map.selectAll(".regions")
            .data(franceRegions)
            .enter()
            .append("path")
            .attr("class", function(d){
                return "regions " + d.properties.adm1_code;
            })
            .attr("d", path)
            .style("fill", function(d){
                return choropleth(d.properties, colorScale);
            });

    };

    //function to create color scale generator
    function makeColorScale(data){
        var colorClasses = [
            "#D4B9DA",
            "#C994C7",
            "#DF65B0",
            "#DD1C77",
            "#980043"
        ];

        //create color scale generator
        var colorScale = d3.scaleQuantile()
            .range(colorClasses);

        //build array of all values of the expressed attribute
        var domainArray = [];
        for (var i=0; i<data.length; i++){
            var val = parseFloat(data[i][expressed]);
            domainArray.push(val);
        };

        //assign array of expressed values as scale domain
        colorScale.domain(domainArray);

        return colorScale;
    };

    function choropleth(props, colorScale){
        //make sure attribute value is a number
        var val = parseFloat(props[expressed]);
        //if attribute value exists, assign a color; otherwise assign gray
        if (typeof val == 'number' && !isNaN(val)){
            return colorScale(val);
        } else {
            return "#CCC";
        };
    };

    function setChart(csvData, colorScale){

        //create a second svg element to hold the bar chart
        var chart = d3.select("body")
            .append("svg")
            .attr("width", chartWidth)
            .attr("height", chartHeight)
            .attr("class", "chart");


        //Example 2.4 line 8...set bars for each province
        var bars = chart.selectAll(".bar")
            .data(csvData)
            .enter()
            .append("rect")
            .sort(function(a, b){
                return b[expressed]-a[expressed]
            })
            .attr("class", function(d){
                return "bar " + d.adm1_code;
            })
            .attr("width", chartInnerWidth / csvData.length - 1);

        //set bar positions, heights, and colors
        updateChart(bars, csvData.length, colorScale);


        //annotate bars with attribute value text
        // var numbers = chart.selectAll(".numbers")
        //     .data(csvData)
        //     .enter()
        //     .append("text")
        //     .sort(function(a, b){
        //         return b[expressed]-a[expressed]
        //     })
        //     .attr("class", function(d){
        //         return "numbers " + d.adm1_code;
        //     })
        //     .attr("text-anchor", "middle")
        //     .attr("x", function(d, i){
        //         var fraction = chartWidth / csvData.length;
        //         return i * fraction + (fraction - 1) / 2;
        //     })
        //     .attr("y", function(d){
        //         return chartHeight - yScale(parseFloat(d[expressed])) + 15;
        //     })
        //     .text(function(d){
        //         return d[expressed];
        //     });

        // Create a text element for the chart title
        var chartTitle = chart.append("text")
            .attr("x", 40)
            .attr("y", 40)
            .attr("class", "chartTitle")
            .text("Number of Variable " + expressed[3] + " in each region");

        //create vertical axis generator
        var axis = chart.append("g")
            .attr("class", "axis")
            .attr("transform", translate)
            .call(d3.axisLeft(yScale)); // Create an axis component with d3.axisLeft


        // var axis = chart.append("g")
        //     .attr("class", "axis")
        //     .attr("transform", translate)
        //     .call(yAxis);

        //create frame for chart border
        var chartFrame = chart.append("rect")
            .attr("class", "chartFrame")
            .attr("width", chartInnerWidth)
            .attr("height", chartInnerHeight)
            .attr("transform", translate);
    };

    function createDropdown(csvData){
        //add select element
        var dropdown = d3.select("body")
            .append("select")
            .attr("class", "dropdown")
            .on("change", function(){
                changeAttribute(this.value, csvData)
            });

        //add initial option
        var titleOption = dropdown.append("option")
            .attr("class", "titleOption")
            .attr("disabled", "true")
            .text("Select Attribute");

        //add attribute name options
        var attrOptions = dropdown.selectAll("attrOptions")
            .data(attrArray)
            .enter()
            .append("option")
            .attr("value", function(d){ return d })
            .text(function(d){ return d });
    };

    //dropdown change listener handler
    function changeAttribute(attribute, csvData){
        //change the expressed attribute
        expressed = attribute;

        //recreate the color scale
        var colorScale = makeColorScale(csvData);

        //recolor enumeration units
        // var regions = d3.selectAll(".regions")
        //     .style("fill", function(d){
        //         return choropleth(d.properties, colorScale)
        //     });
        var regions = d3.selectAll(".regions")
            .transition()
            .duration(1000)
            .style("fill", function(d){
                return choropleth(d.properties, colorScale)
            });

        var bars = d3.selectAll(".bar")
        //re-sort bars
            .sort(function(a, b){
                return b[expressed] - a[expressed];
            })
            .transition() //add animation
            .delay(function(d, i){
                return i * 20
            })
            .duration(500);

        updateChart(bars, csvData.length, colorScale);
    };

    //function to position, size, and color bars in chart
    function updateChart(bars, n, colorScale){
        //position bars
        bars.attr("x", function(d, i){
            return i * (chartInnerWidth / n) + leftPadding;
        })
        //size/resize bars
            .attr("height", function(d, i){
                return 463 - yScale(parseFloat(d[expressed]));
            })
            .attr("y", function(d, i){
                return yScale(parseFloat(d[expressed])) + topBottomPadding;
            })
            //color/recolor bars
            .style("fill", function(d){
                return choropleth(d, colorScale);
            });

        var chartTitle = d3.select(".chartTitle")
            .text("Number of Variable " + expressed[3] + " in each region");
    };



})();

