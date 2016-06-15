//tocheck
//https://github.com/moshen/node-googlemaps/tree/master/lib
//https://www.youtube.com/watch?v=huJtwONhV40
//https://www.sitepoint.com/google-maps-made-easy-with-gmaps-js/
//
//also
//https://prazjain.wordpress.com/2012/04/19/maps-example-with-google-maps-and-nodejs/
//
//Google API plans
//https://developers.google.com/maps/pricing-and-plans/#details
//
//geocoding service
//https://developers.google.com/maps/documentation/javascript/examples/geocoding-reverse
//
//for getting the existing file
//http://stackoverflow.com/questions/11826384/calling-a-json-api-with-node-js
//
var request = require('request');
var tokken = require('../config/config').GMapsAPITokken;
var wikisc  = require('./wikiscrap_model');

//console.log(tokken.slice(1,3));
module.exports = {
    map: function(ar, city, country, cb){
            city = 'Maracaibo';
            country = 'Venezuela';
            var urlmap = 'Google_Map_URL';
            url = "https://maps.googleapis.com/maps/api/geocode/json?address="+city+",+"+country+"&key="+tokken;
            request(url, function(err, response, html){
                if(err){ console.log(err) };
                if (html) {
                    ar = [JSON.parse(html)];
                    cb(ar);
                    console.log(ar);
                }
                
            })
        //loop through the array of cities
        //if it has coordinates, skip
        //otherwise, run a module-closure that update the data with a request call?
        //once the data is completed (hmmm.... hard to know...) then take the arr
        //probably better with async?? the other control is just a counter or checker...
    },
    uc:
        function(url, ar, cb){
            request(url, function(err, response, html){
                if(err){ console.log(err) };
                if (html) {
                    ar = JSON.parse(html);
                    cb(ar);
                    //console.log(ar);
                }
            })
        },
};
