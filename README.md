# FccCityScraper

* [Data output 13 June 2016](https://gist.github.com/alicejiang1/7bcb1078704c53fa4cbc7598785c0466)
* [Pretty data 13 June 2016](https://gist.github.com/alicejiang1/5c3de2520d2d675c9bcc065bf6a36bf8)

##First Draft Campsite Data API

To test locally:
* clone or zip
* once in folder, do `npm install`
* after installation, do `npm start`
* main page should be at your browser at localhost:8080
* for the googlelists you need to get a tokken from Google Maps API and save it as:
 ```
    module.exports = {
    GMapsAPITokken : "YOURAPI",  
    }
 ```
 in config/config.js


To test other points do:

* http://localhost:8080/wikititles
* http://localhost:8080/wikilists
* http://localhost:8080/googlelists