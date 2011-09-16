# Google Maps API for Node.js
A simple way to query the Google Maps API from Node.js

This was a quick hack to work with Node.js.  Criticism/Suggestions/Patches/PullReq's welcome.

# Installation
### Installing npm (node package manager)

    curl http://npmjs.org/install.sh | sh

### Installing googlemaps

    npm install googlemaps

# Status
APIs implemented:

* [Geocoding](http://code.google.com/apis/maps/documentation/geocoding/)
* [Directions](http://code.google.com/apis/maps/documentation/directions/)
* [Elevation](http://code.google.com/apis/maps/documentation/elevation/)
* [Places](http://code.google.com/apis/maps/documentation/places/)
* [Place Details](https://code.google.com/apis/maps/documentation/places/#PlaceDetails)
* [Distance Matrix](http://code.google.com/apis/maps/documentation/distancematrix/)

TODO:

* [Static Maps](http://code.google.com/apis/maps/documentation/staticmaps/)
* [Tests for everything](http://github.com/moshen/node-googlemaps/tree/master/test/) (using [vows](http://vowsjs.org/))

# Usage
    var gm = require('googlemaps');
    var sys = require('sys');

    gm.reverseGeocode('41.850033,-87.6500523', function(err, data){
      sys.puts(JSON.stringify(data));
    });

    gm.reverseGeocode(gm.checkAndConvertPoint([41.850033, -87.6500523]), function(err, data){
      sys.puts(JSON.stringify(data));
    });

Both examples print:
    {"status":"OK","results":[{"types":["postal_code"],"formatted_address":"Chicago, IL 60695, USA"...

All the googlemaps functions follow this scheme:
    function(required, callback, optional)

All callbacks are expected to follow:
    function(error, results)
Where the error returned is an Error object.

Please refer to the code, [tests](http://github.com/moshen/node-googlemaps/tree/master/test/) and the [Google Maps API docs](http://code.google.com/apis/maps/documentation/webservices/index.html) for further usage information.

# Contributors

* [evnm](https://github.com/evnm)
* [duncanm](https://github.com/duncanm)
* [sugendran](https://github.com/sugendran)

