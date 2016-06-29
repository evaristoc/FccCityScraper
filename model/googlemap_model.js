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
//about fb access tokens (horrible to maintain)
//http://stackoverflow.com/questions/7696372/facebook-page-access-tokens-do-these-expire
//https://developers.facebook.com/docs/javascript/reference/FB.api
//http://stackoverflow.com/questions/8713241/whats-the-facebooks-graph-api-call-limit
//http://wearecoder.com/questions/2hnzb/facebook-graph-api-limit-doubt
//
var request = require('request');
var gmtokken = require('../config/config').GMapsAPITokken;
var fbtokken = require('../config/config').FBAPITokken;
var wikisc  = require('./wikiscrap_model');
var utf8_pac = require('utf8');
var fbgraph = require('fbgraph');

fbgraph.setAccessToken(fbtokken);



//console.log(tokken.slice(1,3));
module.exports = {

    
    wljson : [],
    
    uc:
// this method is for request function; cbuc is after getting the complete data
// getting the json file
        function(result1, cbuc){
            var url = 'https://raw.githubusercontent.com/FreeCodeCamp/wiki/master/Campsites.json';
            console.log("Starting wiki json get ", url);

            request(url, function(err, response, html){
                if(err){ console.log(err) };
                if (html) {
                    var result2 = JSON.parse(html); //this is wljson...
                    cbuc(result1, result2);
                    //console.log(ar);
                }
            })
        },    

    sc:
// the scraping module, connected to wikiscrap_model
        function(cbsc){
            var url = 'https://github.com/FreeCodeCamp/FreeCodeCamp/wiki/LocalGroups-List';
            console.log(wikisc.sc, wikisc.js_f);
            wikisc.sc(url, cbsc);    
        },
        
    compare:
// all the functionality in this method:
// -- calling results from the both requests
// -- comparing both lists
// -- updating a newly generated list from the comparison and after updating with googlemaps
// -- send data to final api
// OBS: Callback Hell
        function(cbExit){
            
            var o = this;

            var cbfb =
//facebook data update
            function(fresult){
                if (!fresult) {
                    console.log("No updated results");
                };
                var events = [];
                counter = 1;
                console.log("result ok in fb function", fresult.changes);
                var arr = fresult.wikij;
                //console.log(arr);
                for(var k = 0; k < arr.length; k++) {
                    //console.log(arr[k].facebook.split("/")[4]);
                    (function(k){
                        setTimeout(function(){
                            var searchOptions = {
                                q: arr[k].facebook.split("/")[4],
                                type: "group",
                            };
                            console.log("searchOptions ", searchOptions);
                            
                            fbgraph.search(searchOptions, function(err, res){
                                if (err) {
                                    console.log("error finding ", searchOptions.q);
                                    console.log(err);
                                    counter++;
                                    return;
                                };
                                if (res.data[0]) {
                                    fbgraph.get("/"+res.data[0].id+"/members?summary=true&limit=1", function(err, resm){
                                        if (err) {
                                            console.log("err members ", searchOptions.q);
                                            counter++;
                                            return;
                                        };
                                        console.log(searchOptions.q, "has members ", resm.summary.total_count);
                                        fresult.wikij[k].members = resm.summary.total_count;
                                        counter++;
                                    });
                                    fbgraph.get("/"+res.data[0].id+"/events", function(err, rese){
                                        if (err) {
                                            console.log("err events ", searchOptions.q);
                                            return;
                                        };
                                        if (rese) {
                                            console.log(rese);
                                        }
                                    });                                
                                }else{
                                    if (searchOptions == undefined) {
                                        console.log("no searchOption ", counter);
                                        counter++;
                                        return;
                                    }
                                    console.log(searchOptions," didn't got data");
                                    counter++;
                                }
                            
                            });
                            console.log(counter, arr.length);
                            if (counter >= fresult.wikij.length) {
                                fresult.events = events;
                                cbExit([fresult]);
                            }                      
                        }, //end callback setTimeout
                        2000*k);
                    })(k);
               
                };
                
            }; //end cbfb

            
            var cbgc =
//passing through googlemaps and making final result public
            function(nocoorarr, dataarr, o){

                var count = 1;
                var noc_arrsize = nocoorarr.length;
                var noc_arrsize = 5;
                //this method is actually a private function of goocoor...
                //it is the googlemap API run on ONE element
                //it also contains the FINAL RESULT because it is where the whole chain detects end of processing
                var gmap =  function(index, city, country, arrsize){
                        //city = 'Maracaibo';
                        //country = 'Venezuela';
                        var urlmap = 'Google_Map_URL';
                        url = "https://maps.googleapis.com/maps/api/geocode/json?address="+city+",+"+country+"&key="+gmtokken;
                        url = utf8_pac.encode(url);
                        request(url, function(err, response, html){
                            if(err){ console.log(err) };
                            if (html) {
                                //finnocoorarr.push(JSON.parse(html));
                                var r = JSON.parse(html);
                                if (r.hasOwnProperty("results")) {
                                    if (r.results.length > 0) {
                                        //console.log(r.results[0].geometry.location);
                                        console.log(count, noc_arrsize);
                                        dataarr[index].coords = {lat:r.results[0].geometry.location.lat, lng:r.results[0].geometry.location.lng};
                                        count++;
                                    }
                                }
                                if (count == noc_arrsize) { //count is NOT equal to noc_arrsize: the value was 320...
                                    //cb(ar);
                                    cbfb({changes:count, nocoord:nocoorarr, wikij:dataarr});
                                }
                            }
                            
                        })
                };  
    
    
                //console.log(nocoorarr);
                var thismod = this;
                var finallist = [];
                //var nocoord = thismod.goolist();
                //console.log(o);
                //cbmp = console.log;
                for (var i = 0; i < noc_arrsize; i++) {
                    setTimeout(gmap(nocoorarr[i][1], nocoorarr[i][0].city, nocoorarr[i][0].country),6000*i)
                };
            }; //end cbgc   


           
            
            var cbsc =
//just capturing result1 from the other model, wikiscrap_model
            function(result1){
                if (result1) {
                    o.uc(result1, cbuc);
                }
            }; //end cbsc


                       
            var cbuc =
//Data merging and collecting records to be updated in googlemaps
            function(result1, result2){
                if (result2) {
                    //console.log(result1.length, result2.length);
                    var scrap = result1;
                    var wikijson = result2;
                    var wjfb = [];
                    wikijson.forEach(function(elem){wjfb.push(elem.facebook)});
                    for (var i = 0; i < scrap.length; i++) {
                        if(wjfb.indexOf(scrap[i].facebook) == -1){
                            wikijson.push(scrap[i]);
                        }
                    }
                    console.log(wikijson.length, scrap.length, wjfb.length);
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
                            cbgc(nocoord, dataarr, o);
                      };
                    };
                    cbcomp(wikijson);
                    
                }
            }; //end cbuc
           
            o.sc(cbsc)
            

        },
        
};
