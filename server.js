// by alicejiang1

var express = require('express'),
    wikisc  = require('./model/wikiscrap_model'),
    wikiuc  = require('./model/googlemap_model'),
    app     = express(),
    wtjson  = [], //for the titles in the wiki
    wljson = [];  //for the last updated json file of cities with coordinates
    gljson = [];  //coordinates from google maps


app.get('/', function(req, res){
  //http://stackoverflow.com/questions/10183291/how-to-get-the-full-url-in-express
  var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
  var text = "<h2><strong>First Draft Campsite Data API</strong></h2><p>To test other points do:<p><ul><li>"+fullUrl+"wikititles</li><li>"+fullUrl+"wikilists</li><li>"+fullUrl+"googlelists</li></ul>" 
  res.send(text);
})

    
app.get('/wikititles', function(req, res){

  var url = 'https://github.com/FreeCodeCamp/FreeCodeCamp/wiki/LocalGroups-List';
  console.log(wikisc.sc, wikisc.js_f);
  wikisc.sc(url);
  //wikisc.sc(url,wtjson);
  //if (wtjson.length > 0) {
  //  res.json(wtjson);
  //}
});

app.get('/wikilists', function(req, res){
  var url = 'https://raw.githubusercontent.com/FreeCodeCamp/wiki/master/Campsites.json';
  var cb = function(a){
    if (a.length > 0) {
      res.send(a);
    };
  }
  var p = wikiuc.uc(url, wljson, cb);
})

app.get('/googlelists', function(req, res){
  var cb = function(a){
    if (a.length > 0) {
      res.send(a);
    };
  };
  
  

  //console.log(wljson);
  //var p = wikiuc.map(gljson,"Maracaibo","Venezuela",cb);
  //wikiuc.goolist(res);
  //wikiuc.goocoor();
  //wikiuc.goolist(wikiuc.goocoor);
  //wikiuc.compare(cb);
  wikiuc.compare();
})

app.listen(8080);
console.log('Listening on port 8080');
exports = module.exports = app;