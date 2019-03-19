//begin script when window loads
window.onload = setMap();

//set up choropleth map
function setMap(){
    //use queue to parallelize asynchronous data loading
    d3.queue()
        .defer(d3.csv, "assets/data/unitsData.csv") //load attributes from csv
        .defer(d3.json, "assets/data/EuropeCountries.topojson") //load background spatial data
        .defer(d3.json, "assets/data/FranceProvinces.topojson") //load choropleth spatial data
        .await(callback);

    function callback(error, csvData, europe, france){
        console.log(error);
        console.log(csvData);
        console.log(europe);
        console.log(france);
    };
};