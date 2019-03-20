//begin script when window loads
window.onload = setMap();

// //Example 1.3 line 4...set up choropleth map
// function setMap(){
//     //use d3.queue to parallelize asynchronous data loading
//     d3.queue()
//         .defer(d3.csv, "assets/data/unitsData.csv") //load attributes from csv
//         .defer(d3.json, "assets/data/EuropeCountries.topojson") //load background spatial data
//         .defer(d3.json, "assets/data/FranceRegions.topojson") //load choropleth spatial data
//         .await(callback);
//
//     function callback(error, csvData, europe, france){
//         console.log(error);
//         console.log(csvData);
//         console.log(JSON.stringify(europe));
//         console.log(JSON.stringify(france));
//     };
//
// };

function setMap(){
    var csvData = d3.csv("assets/data/unitsData.csv");
    // var europe = d3.json("assets/data/EuropeCountries.topojson");
    // var france = d3.json("assets/data/FranceRegions.topojson");

    var csvValue;

    csvData.then(function(result) {
        console.log(result);
        csvValue = result;
    });

    // console.log(csvData);
    console.log(csvValue);
    // console.log(europe);
    // console.log(france);


    // var europeCountries = topojson.feature(europe, europe.objects.EuropeCountries),
    //     franceRegions = topojson.feature(france, france.objects.FranceRegions).features;
    //
    // //examine the results
    // console.log(europeCountries);
    // console.log(franceRegions);
};


// var files = [ "assets/data/EuropeCountries.topojson", "assets/data/FranceRegions.topojson"];
// var promises = [];
//
// promises.push(d3.csv("assets/data/unitsData.csv"));
//
// files.forEach(function(url) {
//     promises.push(d3.json(url))
// });
//
// Promise.all(promises).then(function(values) {
//     console.log(values)
// });

// var csvData = d3.csv("assets/data/unitsData.csv");
// var europe = d3.json("assets/data/EuropeCountries.topojson");
// var france = d3.json("assets/data/FranceRegions.topojson");
//
// csvData.then(function(values) {
//     console.log(values)
// });
// europe.then(function(values){
//     console.log(values)
// });
// france.then(function(values){
//     console.log(values)
// });
