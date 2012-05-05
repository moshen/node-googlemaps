# Google Maps API for Node.js
A simple way to query the Google Maps API from Node.js

This has become a fairly complete api.  Criticism/Suggestions/Patches/PullReq's welcome.

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
* [Street View](http://code.google.com/apis/maps/documentation/streetview/)

TODO:

* [Tests for everything](http://github.com/moshen/node-googlemaps/tree/master/test/) (using [vows](http://vowsjs.org/))

# Usage
    var gm = require('googlemaps');
    var util = require('util');

    gm.reverseGeocode('41.850033,-87.6500523', function(err, data){
      util.puts(JSON.stringify(data));
    });

    gm.reverseGeocode(gm.checkAndConvertPoint([41.850033, -87.6500523]), function(err, data){
      util.puts(JSON.stringify(data));
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

    util.puts(gm.staticMap('444 W Main St Lock Haven PA', 15, '500x400', false, false, 'roadmap', markers, styles, paths));

This example prints the URL for the Static Map image: "http://maps.googleapis.com/maps/api/staticmap?center=444%20W%20Main%20St%20Lock%20Haven%20PA&zoom=15&size=500x400&maptype=roadmap&markers=%7C300%20W%20Main%20St%20Lock%20Haven%2C%20PA&markers=%7Ccolor%3Ared%7Clabel%3AA%7Cicon%3Ahttp%3A%2F%2Fchart.apis.google.com%2Fchart%3Fchst%3Dd_map_pin_icon%26chld%3Dcafe%257C996600%7Cshadow%3Afalse%7C444%20W%20Main%20St%20Lock%20Haven%2C%20PA&style=%7Cfeature%3Aroad%7Celement%3Aall%7Chue%3A0x00ff00&path=weight%3A5%7Ccolor%3A0x0000ff%7C41.139817%2C-77.454439%7C41.138621%2C-77.451596&sensor=false"

By giving gm.staticMap an optional callback, you can retreive the static map PNG data:

    util.puts(gm.staticMap('444 W Main St Lock Haven PA', 15, '500x400', function(err, data){
      require('fs').writeFileSync('test_map.png', data, 'binary');
    }, false, 'roadmap', markers, styles, paths));

You will get a map like:

![Some Map](http://maps.googleapis.com/maps/api/staticmap?center=444%20W%20Main%20St%20Lock%20Haven%20PA&zoom=15&size=500x400&maptype=roadmap&markers=%7C300%20W%20Main%20St%20Lock%20Haven%2C%20PA&markers=%7Ccolor%3Ared%7Clabel%3AA%7Cicon%3Ahttp%3A%2F%2Fchart.apis.google.com%2Fchart%3Fchst%3Dd_map_pin_icon%26chld%3Dcafe%257C996600%7Cshadow%3Afalse%7C444%20W%20Main%20St%20Lock%20Haven%2C%20PA&style=%7Cfeature%3Aroad%7Celement%3Aall%7Chue%3A0x00ff00&path=weight%3A5%7Ccolor%3A0x0000ff%7C41.139817%2C-77.454439%7C41.138621%2C-77.451596&sensor=false)

# Configuration

To set the configuration you call `gm.config(key, value)` or `gm.config({key: value, .....})`

### Useful Configuration Options

`proxy` - set a proxy for http requests

`stagger-time` - defaults to 200ms - stagger async call times when multiple requests are required

`encode-polylines` - defaults to true - encodes polylines to the shorter Google format.

`google-client-id` - used for setting business specific parameters

`google-private-key`- used for setting business specific parameters

-------------

All the googlemaps functions follow this scheme:
    function(required, callback, optional)

All callbacks are expected to follow:
    function(error, results)
Where the error returned is an Error object.

Please refer to the code, [tests](http://github.com/moshen/node-googlemaps/tree/master/test/) and the [Google Maps API docs](http://code.google.com/apis/maps/documentation/webservices/index.html) for further usage information.

# Contributors

[![evnm](https://secure.gravatar.com/avatar/2a8171b6c385b865e30bf070cf588329?s=50)](https://github.com/evnm)
[![duncanm](https://secure.gravatar.com/avatar/7310945bafb21aa68b18d61d8b9d2d61?s=50)](https://github.com/duncanm)
[![sugendran](https://secure.gravatar.com/avatar/3228aae57c1dc3f657bbc64c26c97b77?s=50)](https://github.com/sugendran)
[![JoshSmith](https://secure.gravatar.com/avatar/b07d5a5f2e75633b2085142250a6762b?s=50)](https://github.com/JoshSmith)
[![grobot](https://secure.gravatar.com/avatar/ba3313effc329919b09bca67827bdf10?s=50)](https://github.com/grobot)
[![regality](https://secure.gravatar.com/avatar/fe513a9e239cebde58187721d67b7505?s=50)](https://github.com/regality)
[![spatical](https://secure.gravatar.com/avatar/a7c5765a4a4dfbf697f728bd75223641?s=50)](https://github.com/spatical)

