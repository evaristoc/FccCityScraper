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
var utf8_pac = require('utf8');

//console.log(tokken.slice(1,3));
module.exports = {
    
    goolist: function(cb2){
            var thismod = this;
            var wljson = [];
            var nocoord = [];
            var url = 'https://raw.githubusercontent.com/FreeCodeCamp/wiki/master/Campsites.json';
            var cb = function(a){
                if (a.length > 0) {
                    a.forEach(function(e){
                        if (!e.hasOwnProperty("coords")){
                            nocoord.push(e)
                        }
                    });
                    //res.send(nocoord);
                    //return nocoord;
                    cb2(nocoord, thismod);
              };
            }
            thismod.uc(url, wljson, cb);
       
    },
    
    goocoor: function(arr, o){
            console.log(arr);
            var thismod = this;
            var finallist = [];
            //var nocoord = thismod.goolist();
            console.log(o);
            for (var i = 0; i < 5; i++) {
                setTimeout(o.map(finallist, arr[i].city, arr[i].country, console.log),1000*i)
            };
    },
    
    map: function(ar, city, country, cb){
            //city = 'Maracaibo';
            //country = 'Venezuela';
            var urlmap = 'Google_Map_URL';
            url = "https://maps.googleapis.com/maps/api/geocode/json?address="+city+",+"+country+"&key="+tokken;
            url = utf8_pac.encode(url);
            request(url, function(err, response, html){
                if(err){ console.log(err) };
                if (html) {
                    ar.push(JSON.parse(html));
                    if (ar.length == 5) {
                        //cb(ar);
                        ar.forEach(function(a){if(a.results.length>0){cb(a.results[0])}});
                    }
                }
                
            })
    },

    //map: function(ar, city, country, cb){
    //        city = 'Maracaibo';
    //        country = 'Venezuela';
    //        var urlmap = 'Google_Map_URL';
    //        url = "https://maps.googleapis.com/maps/api/geocode/json?address="+city+",+"+country+"&key="+tokken;
    //        request(url, function(err, response, html){
    //            if(err){ console.log(err) };
    //            if (html) {
    //                ar = [JSON.parse(html)];
    //                cb(ar);
    //                console.log(ar);
    //            }
    //            
    //        })
    //    //loop through the array of cities
    //    //if it has coordinates, skip
    //    //otherwise, run a module-closure that update the data with a request call?
    //    //once the data is completed (hmmm.... hard to know...) then take the arr
    //    //probably better with async?? the other control is just a counter or checker...
    //},
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
