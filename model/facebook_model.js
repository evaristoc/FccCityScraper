var express = require('express');
var router = express.Router();
var citis = require("../all.json");
var otherCities = require("../citiesFinal.json");
var jsonfile = require("jsonfile");
var fs = require("fs");
var geojson = require("geojson");
var finalFcc = require("../fccCitiesFull.json");
var fetchUrl = require("fetch").fetchUrl;
var cheerio = require("cheerio");
var filtered = require("../filteredWithoutCord");
var sto = require("../sto.json");
var d3 = require("../d3.json");
var curran = require("../curran-sto.json");
var ft = require("../newCord");
var graph = require('fbgraph');

graph.setAccessToken("FBAPITokken_HERE");

var realSto = geojson.parse(curran, {Point: ['latitude', 'longitude']});

/* GET home page. */
router.get('/', function(req, ress, next) {
    var arr = [];
    var counter = 0;
    d3[0].features.forEach(function(val, i){

    //console.log(val.properties.facebook.split("/")[4]);

        setTimeout(function(){
            var searchOptions = {
                q:     val.properties.facebook.split("/")[4]
              , type:  "group"
            };

            graph.search(searchOptions, function(err, res) {
                if(err){
                    counter++;
                    console.log(err);
                    return;
                };
    
                console.log(counter);
    
                if(res.data[0]){
                    graph.get("/"+res.data[0].id+"/members?summary=true&limit=1", function(err, tr){
                        console.log(counter);
                        val.properties.members_count = tr.summary.total_count;
                        arr.push(val);
                        console.log(val);
                        counter++;
                    });
    
                }else{
                    counter++;
                };
               // {data: [{id: xxx, from: ...}, {id: xxx, from: ...}]}
            });

        },60000*i);

    });
    if(counter === d3[0].features.length-1){
        res.json(arr);
    }
});


/*
var counter = 0;
var yu = 0;
var merged = realSto.features.map(function(val){
counter++;
var yy = val;
for(var i = 0; i<d3[0].features.length; i++){
if(d3[0].features[i].geometry.coordinates){
if(d3[0].features[i].properties.population === val.properties.population ){
yu++;
yy = d3[0].features[i];
}
}
}
return yy;
});
console.log(yu);
if(counter === sto.features.length){
}
/*
fs.writeFile('d3.geojson', JSON.stringify(geo), function(err){
if(err) throw err;
})
*/


/*
});
*/
module.exports = router;