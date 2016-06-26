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

    
    wljson : [],
    
    uc:
        // this method is for request function; cbuc is after getting the complete data
        function(url, emptyarr, cbuc){
            request(url, function(err, response, html){
                if(err){ console.log(err) };
                if (html) {
                    var dataarr = emptyarr = JSON.parse(html); //this is wljson...
                    cbuc(dataarr);
                    //console.log(ar);
                }
            })
        },    

    sc:
        function(cbsc){
            var url = 'https://github.com/FreeCodeCamp/FreeCodeCamp/wiki/LocalGroups-List';
            console.log(wikisc.sc, wikisc.js_f);
            wikisc.sc(url, cbsc);    
        },
        
    goolist:
        //this method contains a private function that runs based on a method, goocoor (cbgc)
        //the same private function fills in an array of records with missing data
        //all that is passed to uc, ie the request method
        function(cbgc){ //cbgl is goocoor !!!
            var thismod = this;
            //var wljson = [];
            var nocoord = [];
            var url = 'https://raw.githubusercontent.com/FreeCodeCamp/wiki/master/Campsites.json';
            
            var cbuc = function(dataarr){
                if (dataarr.length > 0) {
                    dataarr.forEach(function(elem){
                        if (!elem.hasOwnProperty("coords")){
                            nocoord.push([elem, dataarr.indexOf(elem)]); //add positional index as reference...
                        }
                    });
                    //res.send(nocoord);
                    //return nocoord;
                    cbgc(nocoord, dataarr, thismod, console.log);
              };
            }
            
            thismod.uc(url, thismod.wljson, cbuc);
       
    },
    



    goocoor:
        //this method is only an iteration on nocoorarr to apply the gmap method over and run a final, exit cb
        function(nocoorarr, dataarr, o, cbExit){
        
        var count = 0;
        var noc_arrsize = nocoorarr.length;
        //this method is actually a private function of goocoor...
        //it is the googlemap API run on ONE element
        //it also contains the FINAL RESULT because it is where the whole chain detects end of processing
            var gmap =  function(index, city, country, arrsize){
                    //city = 'Maracaibo';
                    //country = 'Venezuela';
                    var urlmap = 'Google_Map_URL';
                    url = "https://maps.googleapis.com/maps/api/geocode/json?address="+city+",+"+country+"&key="+tokken;
                    url = utf8_pac.encode(url);
                    request(url, function(err, response, html){
                        if(err){ console.log(err) };
                        if (html) {
                            //finnocoorarr.push(JSON.parse(html));
                            var r = JSON.parse(html);
                            if (r.hasOwnProperty("results")) {
                                if (r.results.length > 0) {
                                    //console.log(r.results[0].geometry.location);
                                    dataarr[index].coords = {lat:r.results[0].geometry.location.lat, lng:r.results[0].geometry.location.lng};
                                    count++;
                                    console.log(count);
                                }
                            }
                            if (count == 5) {
                                //cb(ar);
                                cbExit(count, 5);
                            }
                        }
                        
                    })
                };    


            console.log(nocoorarr);
            var thismod = this;
            var finallist = [];
            //var nocoord = thismod.goolist();
            console.log(o);
            //cbmp = console.log;
            //noc_arrsize
            for (var i = 0; i < 5; i++) {
                setTimeout(gmap(nocoorarr[i][1], nocoorarr[i][0].city, nocoorarr[i][0].country),6000*i)
            };
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

};
