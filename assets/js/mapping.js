//begin script when window loads
window.onload = setMap();

//Example 1.3 line 4...set up choropleth map
function setMap(){
    //use d3.queue to parallelize asynchronous data loading
    d3.queue()
        .defer(d3.csv, "assets/data/unitsData.csv") //load attributes from csv
        .defer(d3.json, "assets/data/EuropeCountries.topojson") //load background spatial data
        .defer(d3.json, "assets/data/FranceRegions.topojson") //load choropleth spatial data
        .awaitAll(callback);

    function callback(error, csvData, europe, france){
        console.log(error);
        console.log(csvData);
        console.log(JSON.stringify(europe));
        console.log(JSON.stringify(france));
    };

};

$.get("assets/data/unitsData.csv", csvCallback, "csv");
$.get("assets/data/EuropeCountries.topojson", europeCallback, "json");
$.get("assets/data/FranceRegions.topojson", franceCallback, "json");

function csvCallback(response, status, jqXHRobject){
    //tasks using the data go here
    console.log(response);
};

function europeCallback(response, status, jqXHRobject){
    //tasks using the data go here
    console.log(response);
};

function franceCallback(response, status, jqXHRobject){
    //tasks using the data go here
    console.log(response);
};
