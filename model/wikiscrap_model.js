var request = require('request');
var cheerio = require('cheerio');
//https://www.sitepoint.com/understanding-module-exports-exports-node-js/
module.exports = {
    js_f : function(arr){if(arr.length>0){console.log("yes, wikiscrap")}},
    sc: function(url){
            var js_F = this.js_f;
            var js_data = [];
            request(url, function(err, response, html){
                if(err){ console.log(err) };
            
                var $ = cheerio.load(html,{"normalizeWhitespace":true});
            
                // Any less specific and Cheerio returns data from extra elements
                $('#wiki-body .markdown-body > ul > li').find('a').each(function(){
                  var campsite = {};
            
                  var city = $(this).text().trim();
                  campsite.city = city;
                  // Each city's containing unordered list element
                  var cityList = $( $(this).parent() ).parent();
                  // Element containing the name of the city's region (if city is not within a region, element contains country name)
                  var element = $(cityList).parent().contents().get(0);
            
                  // Check if element is at the top of the UL trees.
                  if(!$( $( $(element).parent() ).parent() ).parent().hasClass('markdown-body')){
                    // Don't include the listed US region 'Ambiguous'
                    if($( element ).text().trim() !== 'Ambiguous'){
                      var region = $( element ).text().trim();
                      campsite.region = region;
                    }
                    var country = $( $( $( $(element).parent() ).parent() ).parent().contents().get(0) ).text().trim();
                  } else {
                    var country = $( element ).text().trim();
                  }
            
                  campsite.country = country;
                  campsite.facebook = $(this).attr('href').trim();
            
                  js_data.push(campsite);  //inside cheerio...
                });
                js_F(js_data);
            });        
        },
}