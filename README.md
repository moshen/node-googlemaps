# Google Maps API for Node.js
A simple way to query the Google Maps API from Node.js

This was a quick hack to work with Node.js.  Criticism/Suggestions/Patches/PullReq's welcome.

# Status
APIs implemented:

* Geocoding
* Directions
* Elevation

TODO:

* Places
* Static Maps
* Tests for everything
* create npm package

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

Please refer to the code, tests and the [Google Maps API docs](http://code.google.com/apis/maps/documentation/webservices/index.html) for further usage information.

