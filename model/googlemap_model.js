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
var fbuser = require('../config/config').FBUSERTokken;
var fbtokken = require('../config/config').FBAPITokken;
var fbappid = require('../config/config').FBAPIId;
var fbsecret = require('../config/config').FBAPISecret;
var wikisc  = require('./wikiscrap_model');
var utf8_pac = require('utf8');
var fbgraph = require('fbgraph');
var fs = require('fs');
var jsonfile = require('jsonfile');

fbgraph.setAccessToken(fbuser);
var path = './data.json';
var writeStream = fs.createWriteStream(path, {flags: 'a'});


//console.log(tokken.slice(1,3));
module.exports = {

    
    wljson : [],
    
    uc:
// this method is for request function; cbuc is after getting the complete data
// getting the json file
        function(result1, cbuc){
            //var url = 'https://raw.githubusercontent.com/FreeCodeCamp/wiki/master/Campsites.json';
            var url =
                //'https://gist.githubusercontent.com/evaristoc/abf2cc27fb29656f929a51f74c87d35b/raw/6ee77228634bbf2ee4ccf93c7c34e77fff2b34ee/wikij.json';
                'https://gist.githubusercontent.com/evaristoc/744b9ca6314c09c197a3d82caecc5540/raw/7edca215af988f68664b32fe05f89beacb5a094a/wikij2.json';
            
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
        function(){
            
            var cbExit = function(arr){
                console.log(arr);
                jsonfile.writeFile(path, arr, function (err) {
                  console.error(err)
                })
            }
            
            var o = this;

            var cbfb =
//facebook data update
            function(fresult){
                if (!fresult) {
                    console.log("No updated results");
                };
                var events = [];
                var counter = 1;
                var ct = 0;
                console.log("result ok in fb function", fresult.changes);
                var arr = fresult.wikij.slice(0,700);
                //console.log(arr);
                var al = arr.length;
                //var al = 750;
                var jumped = -1;
                function datecomparison(d1){
                    var d2 = new Date();
                    //return Math.round(Math.abs(d2.getTime()-d1.getTime())/(1000*60*60*24))-1;
                    return Math.round(Math.abs(d2-d1)/(1000*60*60*24))-1;

                }
                
                for(var k = 0; k < al; k++) {
                    //ct = k;
                    //console.log(arr[k].facebook.split("/")[4]);
                    //first, check if there is a recent update...
                    if (arr[k].hasOwnProperty("fbdetails")) {
                        if(datecomparison(arr[k].fbdetails.checked) < 7){
                            counter++;
                            jumped = k; //control time: only update here
                        };
                    
                    }else{
                        var j = k - jumped + 1;
                        (function(k, j){
                            setTimeout(function(){
                                var searchOptions = {
                                    q: arr[k].facebook.split("/")[4],
                                    type: "group",
                                };
                                console.log("searchOptions ", searchOptions);
                                
                                //if it has fbdetails; if not, then update members and events
                                if (arr[k].hasOwnProperty("fbdetails")) {
                                    fbgraph.get("/"+arr[k].fbdetails.fb_id+"/members?summary=true&limit=1", function(err, resm){
                                        if (err) {
                                            console.log("err members ", searchOptions.q);
                                            counter++;
                                            //return;
                                        };
                                        console.log(searchOptions.q, "has members ", resm.summary.total_count);
                                        fresult.wikij[k].members = resm.summary.total_count;
                                        counter++;
                                    });
                                    fbgraph.get("/"+arr[k].fbdetails.fb_id+"/events", function(err, rese){
                                        if (err) {
                                            console.log("err events ", searchOptions.q);
                                            return;
                                        };
                                        if (rese) {
                                            events.push([{facebookname:searchOptions.q, fb_id: res.data[0].id},rese.data]);
                                        }
                                    });
                                    fresult.wikij[k].fbdetails.checked = new Date();
                                    fresult.wikij[k].fbdetails.checked = fresult.wikij[k].fbdetails.checked.getTime();

                                //if on the other hand don't have fbdetails, create it and update all data
                                }else{
                                
                                    fbgraph.search(searchOptions, function(err, res){
                                        if (err) {
                                            console.log("error finding ", searchOptions.q);
                                            console.log(err);
                                            counter++;
                                            return;
                                        };
                                        if (res.data[0]) {
                                            fresult.wikij[k].fbdetails = {};
                                            fresult.wikij[k].fbdetails.fb_id = res.data[0].id;
                                            fresult.wikij[k].fbdetails.checked = new Date();
                                            fresult.wikij[k].fbdetails.checked = fresult.wikij[k].fbdetails.checked.getTime();
                                            fbgraph.get("/"+res.data[0].id+"?fields=id,name,updated_time,owner", function(err,resf){
                                                if (err) {
                                                    consol.log("err fields ", searchOptions.q);
                                                    return;
                                                };
                                                //OJO: TODO - if owner exists, do not update this...
                                                fresult.wikij[k].fbdetails.fb_owner = resf.owner;
                                                fresult.wikij[k].fbdetails.fb_lastmodf = resf.updated_time;
                                            });
                                            
                                            fbgraph.get("/"+res.data[0].id+"/members?summary=true&limit=1", function(err, resm){
                                                if (err) {
                                                    console.log("err members ", searchOptions.q);
                                                    counter++;
                                                    //return;
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
                                                    events.push([{facebookname:searchOptions.q, fb_id: res.data[0].id},rese.data]);
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
                                        };
                                    });
                                };
                                console.log(counter, al, arr.length);
                                //fresult.wikij[k].checked = 1;
                                //fbgraph.extendAccessToken({
                                //        "access_token":   fbtokken,
                                //        "client_id":      fbappid,
                                //        "client_secret":  fbsecret,
                                //    },
                                //    function (err, facebookRes) {
                                //        console.log(facebookRes);
                                //});
                                //
                                //if (counter >= al) {
                                if (k == (al - 1)) {

                                    fresult.events = events;
                                    cbExit([fresult]);
                                }                      
                            }, //end callback setTimeout
                            4000*j);
                        })(k, j);
           
                    };
                };
            }; //end cbfb

            
            var cbgc =
//passing through googlemaps and making final result public
            function(nocoorarr, dataarr, o){

                var count = 1;
                var noc_arrsize = nocoorarr.length;
                //var noc_arrsize = 5;
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
                    (function(i){setTimeout(gmap(nocoorarr[i][1], nocoorarr[i][0].city, nocoorarr[i][0].country),1500*i)})(i);
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
