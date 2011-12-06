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
* [Static Maps](http://code.google.com/apis/maps/documentation/staticmaps/)

TODO:

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
    
For the Static Maps API, you can pass in all the required parameters as well as markers, styles, and paths using the formats outlined below.
    
    markers = [
    	{ 'location': '300 W Main St Lock Haven, PA' },
    	{ 'location': '444 W Main St Lock Haven, PA',
    		'color': 'red',
    		'label': 'A',
    		'shadow': 'false',
    		'icon' : 'http://chart.apis.google.com/chart?chst=d_map_pin_icon&chld=cafe%7C996600'
    	}
    ]

    styles = [
    	{ 'feature': 'road', 'element': 'all', 'rules': 
    		{ 'hue': '0x00ff00' }
    	}
    ]

    paths = [
    	{ 'color': '0x0000ff', 'weight': '5', 'points': 
    		[ '41.139817,-77.454439', '41.138621,-77.451596' ]
    	}
    ]

    sys.puts(gm.staticMap('444 W Main St Lock Haven PA', 15, '500x400', false, false, 'roadmap', markers, styles, paths));

This example prints the URL for the Static Map image: "http://maps.googleapis.com/maps/api/staticmap?center=444%20W%20Main%20St%20Lock%20Haven%20PA&zoom=15&size=500x400&maptype=roadmap&markers=%7C300%20W%20Main%20St%20Lock%20Haven%2C%20PA&markers=%7Ccolor%3Ared%7Clabel%3AA%7Cicon%3Ahttp%3A%2F%2Fchart.apis.google.com%2Fchart%3Fchst%3Dd_map_pin_icon%26chld%3Dcafe%257C996600%7Cshadow%3Afalse%7C444%20W%20Main%20St%20Lock%20Haven%2C%20PA&style=%7Cfeature%3Aroad%7Celement%3Aall%7Chue%3A0x00ff00&path=weight%3A5%7Ccolor%3A0x0000ff%7C41.139817%2C-77.454439%7C41.138621%2C-77.451596&sensor=false"

By giving gm.staticMap an optional callback, you can retreive the static map PNG data:

    sys.puts(gm.staticMap('444 W Main St Lock Haven PA', 15, '500x400', function(err, data){
      require('fs').writeFileSync('test_map.png', data, 'binary');
    }, false, 'roadmap', markers, styles, paths));

You will get a map like:

![Some Map](http://maps.googleapis.com/maps/api/staticmap?center=444%20W%20Main%20St%20Lock%20Haven%20PA&zoom=15&size=500x400&maptype=roadmap&markers=%7C300%20W%20Main%20St%20Lock%20Haven%2C%20PA&markers=%7Ccolor%3Ared%7Clabel%3AA%7Cicon%3Ahttp%3A%2F%2Fchart.apis.google.com%2Fchart%3Fchst%3Dd_map_pin_icon%26chld%3Dcafe%257C996600%7Cshadow%3Afalse%7C444%20W%20Main%20St%20Lock%20Haven%2C%20PA&style=%7Cfeature%3Aroad%7Celement%3Aall%7Chue%3A0x00ff00&path=weight%3A5%7Ccolor%3A0x0000ff%7C41.139817%2C-77.454439%7C41.138621%2C-77.451596&sensor=false)

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

