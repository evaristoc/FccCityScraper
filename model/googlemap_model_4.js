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
var async = require('async');
var tokken = require('../config/config').GMapsAPITokken;
var wikisc  = require('./wikiscrap_model');
var utf8_pac = require('utf8');

//console.log(tokken.slice(1,3));
module.exports = {

    
    wljson : [],
    
    uc:
        // this method is for request function; cbuc is after getting the complete data
        function(cbuc){
            var url = 'https://raw.githubusercontent.com/FreeCodeCamp/wiki/master/Campsites.json';
            console.log("Starting wiki json get ", url);

            request(url, function(err, response, html){
                if(err){ console.log(err) };
                if (html) {
                    var dataarr = JSON.parse(html); //this is wljson...
                    cbuc(null, dataarr);
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
        
    compare:
        function(cbcomp){
            
            var o = this;
            
            //var cbsc = function(err, result){
            //    //if (err){
            //    //    console.log("Error scraper");
            //    //}
            //    console.log(result.length);
            //    return result;
            //};
            //
            //
            //var cbuc = function(err, result){ //HERE THERE IS AN ERROR!!! SO CHECK!!!
            //    //if (err) {
            //    //    console.log("Error wiki json");
            //    //}
            //    console.log(result.length);
            //    return result;
            //};
            //
            ////var cbsc = function(result1){
            ////    if (result1) {
            ////        o.uc(result1, cbuc);
            ////    }
            ////};
            ////            
            ////var cbuc = function(result1, result2){ //HERE THERE IS AN ERROR!!! SO CHECK!!!
            ////    if (result2) {
            ////        console.log(result1.length, result2.length);
            ////        var scrap = result1;
            ////        var wikijson = result2;
            ////        var wjfb = [];
            ////        wikijson.forEach(function(elem){wjfb.push(elem.facebook)});
            ////        for (var i = 0; i < scrap.length; i++) {
            ////            if(wjfb.indexOf(scrap[i].facebook) == -1){
            ////                wikijson.push(scrap[i]);
            ////            }
            ////        }
            ////        console.log([scrap.length, wikijson.length, wjfb.length]);
            ////        
            ////    }
            ////};
            ////
            //o.sc(cbsc)
            //
            //////test
            ////async.parallel([
            ////    function(callback){
            ////        setTimeout(function(){
            ////            callback(null, 'one');
            ////        }, 200);
            ////    },
            ////    function(callback){
            ////        setTimeout(function(){
            ////            callback(null, 'two');
            ////        }, 100);
            ////    }
            ////],
            ////// optional callback
            ////function(err, results){
            ////    console.log(results);
            ////    // the results array will equal ['one','two'] even though
            ////    // the second function had a shorter timeout.
            ////});
            //
            //async.parallel([o.sc(cbsc), o.uc(cbuc)], function(err, results){
            //    //if (err) {
            //    //    console.log("Error in async result");
            //    //};
            //    console.log("xxxx");
            //    //console.log("in the done function ", results.length);
            //    //var scrap = results[0];
            //    //var wikijson = results[1];
            //    //var wjfb = [];
            //    //wikijson.forEach(function(elem){wjfb.push(elem.facebook)});
            //    //for (var i = 0; i < scrap.length; i++) {
            //    //    if(wjfb.indexOf(scrap[i].facebook) == -1){
            //    //        wikijson.push(scrap[i]);
            //    //    }
            //    //}
            //    //return [scrap.length, wikijson.length, wjfb.length];
            //});
            
            var aaa = [];   //needed an external value...

            var callback = function(err, result){
                //if (err){
                //    console.log("Error scraper");
                //}
                console.log(result.length);
                aaa.push(result);
                if (aaa.length > 1) {
                    console.log(aaa[0][0]); //the callback has to finish it ALL
                    //return aaa;
                }
                //return result;
            };
            
            async.series([o.sc(callback), o.uc(callback)], callback(err, result));
            
        },
        
    goolist:
        //this method contains a private function that runs based on a method, goocoor (cbgc)
        //the same private function fills in an array of records with missing data
        //all that is passed to uc, ie the request method
        function(cbgc){ //cbgl is goocoor !!!
            var thismod = this;
            //var wljson = [];
            var nocoord = [];
            var cbcomp = function(dataarr){
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
            
            thismod.compare(cbcomp);
       
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
    

};