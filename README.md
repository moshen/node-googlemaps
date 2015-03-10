[![Build Status](https://travis-ci.org/moshen/node-googlemaps.svg)](https://travis-ci.org/moshen/node-googlemaps)

# Google Maps API for Node.js

This library implements the following Google Maps APIs, and can be also used by Google Maps for Work users.

* [Maps API Web Services](https://developers.google.com/maps/documentation/webservices/)
* [Google Places API](https://developers.google.com/places/)
* [Google Maps Image API](https://developers.google.com/maps/documentation/imageapis/)

This library is **NOT COMPATIBLE** with tags < `1.0.0`

If you want to migrate from a version older than `1.0.0` check the [WIKI](https://github.com/moshen/node-googlemaps/wiki/Migrate-from-v0.1.20-to-v1.0.x) for instructions.

### Installation

```
npm install googlemaps
```

### What does it cover
[Maps API Web Services](https://developers.google.com/maps/documentation/webservices/):

* [Directions](https://developers.google.com/maps/documentation/directions/)
* [Distance matrix](https://developers.google.com/maps/documentation/distancematrix/)
* [Elevation](https://developers.google.com/maps/documentation/elevation/) - TO BE IMPROVED
* [Geocoding and reverse geocoding](https://developers.google.com/maps/documentation/geocoding)
* [Time zone](https://developers.google.com/maps/documentation/timezone) - NOT IMPLEMENTED YET

[Google Places API](https://developers.google.com/places/) - NOT COMPLETED

* [Place search](https://developers.google.com/places/documentation/search)
* [Place details](https://developers.google.com/places/documentation/details)

[Google Maps Image API](https://developers.google.com/maps/documentation/imageapis/)

* [Static maps](https://developers.google.com/maps/documentation/staticmaps/) - TO BE IMPROVED
* [Street view](https://developers.google.com/maps/documentation/streetview/) - TO BE IMPROVED


### Usage

```javascript
var config = {
  'key': '<YOUR-KEY>',
  'google-client-id':   '<YOUR-CLIENT-ID>', //optional
  'stagger-time':       1000, // for elevationPath
  'encode-polylines':   false,
  'secure':             true, // use https
  'proxy':              'http://127.0.0.1:9999', // optional, set a proxy for HTTP requests
  'google-private-key': '<YOUR-PRIVATE-KEY>' // to use Google Maps for Work
};

var gmAPI = new GoogleMapsAPI(config);

// geocode API
var geocodeParams = {
  "address":    "121, Curtain Road, EC2A 3AD, London UK",
  "components": "components=country:GB",
  "bounds":     "55,-1|54,1",
  "language":   "en",
  "region":     "uk"
};

gmAPI.geocode(geocodeParams, function(err, result){
  console.log(result);
});

// reverse geocode API
var reverseGeocodeParams = {
  "latlng":        "51.1245,-0.0523",
  "result_type":   "postal_code",
  "language":      "en",
  "location_type": "APPROXIMATE"
};

gmAPI.reverseGeocode(reverseGeocodeParams, function(err, result){
  console.log(result);
});
``` 

Check out the [unit tests](./tree/new-major-version/test/unit/) for more APIs examples.

```javascript
var gmAPI = new GoogleMapsAPI();
gmAPI.staticMap('444 W Main St Lock Haven PA', 15, '500x400', false, false, 'roadmap', markers, styles, paths);
```
This example prints the URL for the Static Map image: "http://maps.googleapis.com/maps/api/staticmap?center=444%20W%20Main%20St%20Lock%20Haven%20PA&zoom=15&size=500x400&maptype=roadmap&markers=%7C300%20W%20Main%20St%20Lock%20Haven%2C%20PA&markers=%7Ccolor%3Ared%7Clabel%3AA%7Cicon%3Ahttp%3A%2F%2Fchart.apis.google.com%2Fchart%3Fchst%3Dd_map_pin_icon%26chld%3Dcafe%257C996600%7Cshadow%3Afalse%7C444%20W%20Main%20St%20Lock%20Haven%2C%20PA&style=%7Cfeature%3Aroad%7Celement%3Aall%7Chue%3A0x00ff00&path=weight%3A5%7Ccolor%3A0x0000ff%7C41.139817%2C-77.454439%7C41.138621%2C-77.451596&sensor=false"

By giving gm.staticMap an optional callback, you can retreive the static map PNG data:

```javascript
var gmAPI = new GoogleMapsAPI();
gmAPI.staticMap('444 W Main St Lock Haven PA', 15, '500x400', function(err, data){
      require('fs').writeFileSync('test_map.png', data, 'binary');
    }, false, 'roadmap', markers, styles, paths);
```

You will get a map like:

![Some Map](http://maps.googleapis.com/maps/api/staticmap?center=444%20W%20Main%20St%20Lock%20Haven%20PA&zoom=15&size=500x400&maptype=roadmap&markers=%7C300%20W%20Main%20St%20Lock%20Haven%2C%20PA&markers=%7Ccolor%3Ared%7Clabel%3AA%7Cicon%3Ahttp%3A%2F%2Fchart.apis.google.com%2Fchart%3Fchst%3Dd_map_pin_icon%26chld%3Dcafe%257C996600%7Cshadow%3Afalse%7C444%20W%20Main%20St%20Lock%20Haven%2C%20PA&style=%7Cfeature%3Aroad%7Celement%3Aall%7Chue%3A0x00ff00&path=weight%3A5%7Ccolor%3A0x0000ff%7C41.139817%2C-77.454439%7C41.138621%2C-77.451596&sensor=false)

### Further examples

Please refer to the code, [tests](http://github.com/moshen/node-googlemaps/tree/master/test/) and the [Google Maps API docs](http://code.google.com/apis/maps/documentation/webservices/index.html) for further usage information.


### Contributions
Criticism/Suggestions/Patches/PullRequests are welcome.


### Original contributors list

[![evnm](https://secure.gravatar.com/avatar/2a8171b6c385b865e30bf070cf588329?s=50)](https://github.com/evnm)
[![duncanm](https://secure.gravatar.com/avatar/7310945bafb21aa68b18d61d8b9d2d61?s=50)](https://github.com/duncanm)
[![sugendran](https://secure.gravatar.com/avatar/3228aae57c1dc3f657bbc64c26c97b77?s=50)](https://github.com/sugendran)
[![JoshSmith](https://secure.gravatar.com/avatar/b07d5a5f2e75633b2085142250a6762b?s=50)](https://github.com/JoshSmith)
[![grobot](https://secure.gravatar.com/avatar/ba3313effc329919b09bca67827bdf10?s=50)](https://github.com/grobot)
[![regality](https://secure.gravatar.com/avatar/fe513a9e239cebde58187721d67b7505?s=50)](https://github.com/regality)
[![spatical](https://secure.gravatar.com/avatar/a7c5765a4a4dfbf697f728bd75223641?s=50)](https://github.com/spatical)

### v1.0.0 maintener 
[![fabriziomoscon](https://avatars1.githubusercontent.com/u/721890?v=3&u=b5079f5258887f4cc9a6de1cbadee230bca8ecc1&s=50)](https://github.com/fabriziomoscon)

Contributions and new issues are welcome!