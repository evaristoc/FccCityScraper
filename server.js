// by alicejiang1

var express = require('express'),
    wikisc  = require('./model/wikiscrap_model'),
    wikiuc  = require('./model/googlemap_model'),
    app     = express(),
    wtjson  = [], //for the titles in the wiki
    wljson = [];  //for the last updated json file of cities with coordinates
    
app.get('/wikititles', function(req, res){

  var url = 'https://github.com/FreeCodeCamp/FreeCodeCamp/wiki/LocalGroups-List';
  wikisc.sc(url,wtjson);
  if (wtjson.length > 0) {
    res.json(wtjson);
  }
});

app.get('/wikilist', function(req, res){
  var url = 'https://raw.githubusercontent.com/FreeCodeCamp/wiki/master/Campsites.json';
  var cb = function(a){
    if (a.length > 0) {
      res.send(a);
    };
  }
  var p = wikiuc.uc(url, wljson, cb);
})

app.listen(8080);
console.log('Listening on port 8080');
exports = module.exports = app;