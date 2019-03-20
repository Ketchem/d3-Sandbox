//begin script when window loads
window.onload = setMap();


function setMap(){
    var dataSets = [];
    dataSets.push(d3.csv("assets/data/unitsData.csv"));
    dataSets.push(d3.json("assets/data/EuropeCountries.topojson"));
    dataSets.push(d3.json("assets/data/FranceRegions.topojson"));

    Promise.all(dataSets).then(function(values) {
        console.log(values[1]);
        console.log(values[2]);

        var europeCountries = topojson.feature(values[1], values[1].objects.EuropeCountries);
        var franceRegions = topojson.feature(values[2], values[2].objects.FranceRegions);

        console.log(europeCountries);
        console.log(franceRegions);
    });
};

