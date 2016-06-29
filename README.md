# FccCityScraper

* [Data output 13 June 2016](https://gist.github.com/alicejiang1/7bcb1078704c53fa4cbc7598785c0466)
* [Pretty data 13 June 2016](https://gist.github.com/alicejiang1/5c3de2520d2d675c9bcc065bf6a36bf8)

##First Draft Campsite Data API

To test locally:
* clone or zip
* once in folder, do `npm install`
* after installation, do `npm start`
* main page should be at your browser at localhost:8080
* for the googlelists you need to get a token from Google Maps API, as well as a token for Facebook Graph API (currently using a short-life user access token) and save it as:
 ```
    module.exports = {
    GMapsAPITokken : "YOURGoogleMapsAPI",
    FBAPITokken : "YOURFacebookGraphUserAccessTokenAPI", //short life, should be updated every time you use the project
    }
 ```
 in config/config.js

The current plan for this project is:
 Keeping the challenges of the FB API aside, so far my suggestion for the Campsite Project would be:

* keep a file in a single folder inside the app; use that file as dataset instead of a database
* update the dataset weekly; use a cron implementation for that
* report the events that will happen during the following days (use front end to select those per day)
* find ways to purge the dataset, for example: introduce a criterion for "active/inactive" campsites or get rid of dates of events that already ocurred


To test other points do:

* http://localhost:8080/wikititles
* http://localhost:8080/wikilists
* http://localhost:8080/googlelists //using this to update data