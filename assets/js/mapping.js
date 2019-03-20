//begin script when window loads
window.onload = setMap();


function setMap(){

    //map frame dimensions
    var width = 960,
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
    console.log(dataSets);

    Promise.all(dataSets).then(function(values) {
        var europeCountries = topojson.feature(values[1], values[1].objects.EuropeCountries);
        var franceRegions = topojson.feature(values[2], values[2].objects.FranceRegions);
        console.log(franceRegions.features);

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



        var countries = map.append("path")
            .datum(europeCountries)
            .attr("class", "countries")
            .attr("d", path);

        var regions = map.selectAll(".regions")
            .data(franceRegions.features)
            .enter()
            .append("path")
            .attr("class", function(d){
                return "regions " + d.properties.adm1_code;
            })
            .attr("d", path)
    });
};

