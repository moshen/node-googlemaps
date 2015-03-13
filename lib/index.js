/**
 * Modules from the community: package.json
 */
var defaultRequest = require('request');
var waitress       = require('waitress');
var check          = require('check-types');

/**
 * Internal modules
 */
var _makeRequest      = require('./utils/makeRequest');
var _setParams        = require('./utils/mergeParams');
var _jsonParser       = require('./utils/jsonParser');
var _encodePolyline   = require('./utils/encodePolylines');
var _getDefaultConfig = require('./config/getDefault');
var _constants        = require('./config/constants');


var ACCEPTED_CONFIG_KEYS = _constants.ACCEPTED_CONFIG_KEYS;
var GOOGLEMAPS_ENDPOINTS = _constants.GOOGLEMAPS_ENDPOINTS;

var api = {
  placeSearch:            require('./placeSearch'),
  placeDetails:           require('./placeDetails'),
  geocode:                require('./geocode'),
  reverseGeocode:         require('./reverseGeocode'),
  distance:               require('./distance'),
  directions:             require('./directions'),
  elevationFromLocations: require('./elevationFromLocations'),
  // TODO
  // move this into an internal module + fix integration test
  // elevationFromPath:      require('./elevationFromPath'),
  staticMap:              require('./staticMap'),
  streetView:             require('./streetView')
}


/**
 * Constructor
 */
var GoogleMapsAPI = function(config, request) {

  if (!check.object(config)) {
    config = {};
  }
  this.config = _setParams( _getDefaultConfig(), config, ACCEPTED_CONFIG_KEYS );

  if (typeof request !== 'function') {
    request = defaultRequest;
  }

  this.request = request;

};

/**
 * Endpoint: /maps/api/place/search/json
 * Google documentation reference: https://developers.google.com/places/documentation/search
 *
 * TODO: Maps API for Work customers should not include a client or signature parameter with their requests.
 * TODO: params zagatselected
 */
GoogleMapsAPI.prototype.placeSearch = api.placeSearch

/**
 *
 * Endpoint: '/maps/api/place/details/json'
 * Google documentation reference: https://developers.google.com/places/documentation/details
 * 
 * Note: reference is deprecated. The reference advises to use placeId instead
 * Note: sensor is no longer required
 */
GoogleMapsAPI.prototype.placeDetails = api.placeDetails


/**
 * Server side geocoding. For client usage please refer to this URL:
 * https://developers.google.com/maps/articles/geocodestrat#client
 *
 * Endpoint: '/maps/api/geocode/json'
 * Google documentation reference: https://developers.google.com/maps/documentation/geocoding
 *
 * Use limitations: This service is generally designed for geocoding static (known in advance) addresses for placement of application content on a map; this service is not designed to respond in real time to user input, for example. For dynamic geocoding (for example, within a user interface element)
 *
 * Caching: Geocoding is a time and resource intensive task. Whenever possible, pre-geocode known addresses (using the Geocoding API described here or another geocoding service), and store your results in a temporary cache of your own design.

 * Quotas: Users of the free API: 2,500 requests per 24 hour period. 5 requests per second.
           Google Maps API for Work customers: 100,000 requests per 24 hour period. 10 requests per second.
 */
GoogleMapsAPI.prototype.geocode = api.geocode

/**
 *
 * Endpoint: '/maps/api/geocode/json'
 * Google documentation reference: https://developers.google.com/maps/documentation/geocoding/#ReverseGeocoding
 */
GoogleMapsAPI.prototype.reverseGeocode = api.reverseGeocode

/**
 *
 * Endpoint: '/maps/api/distancematrix/json'
 * Google documentation reference: https://developers.google.com/maps/documentation/distancematrix/
 *
 * Use limitations: Distance Matrix API URLs are restricted to approximately 2000 characters, after URL Encoding. As some Distance Matrix API service URLs may involve many locations, be aware of this limit when constructing your URLs. Note that different browsers, proxies, and servers may have different URL character limits as well.
 *
 * Quotas: Users of the free API: 100 elements per query. 100 elements per 10 seconds. 2 500 elements per 24 hour period.
           Google Maps API for Work customers: 625 elements per query. 1 000 elements per 10 seconds. 100 000 elements per 24 hour period.
 */
GoogleMapsAPI.prototype.distance = api.distance

/**
 * departureTime and arrivalTime must be passed as UNIX timestamp => Math.floor((new Date()).getTime()/1000)
 *
 * Endpoint: '/maps/api/directions/json'
 * Google documentation reference: https://developers.google.com/maps/documentation/directions/
 * note: This service is generally designed for calculating directions for static (known in advance) addresses for placement of application content on a map; this service is not designed to respond in real time to user input, for example. For dynamic directions calculations (for example, within a user interface element), consult the documentation for the JavaScript API V3 Directions Service.
 *
 * Quotas: Users of the free API: 2,500 directions requests per 24 hour period. Up to 8 waypoints allowed in each request. Waypoints are not available for transit directions. 2 requests per second.
           Google Maps API for Work customers: 100,000 directions requests per 24 hour period. 23 waypoints allowed in each request. Waypoints are not available for transit directions. 10 requests per second.
 */
GoogleMapsAPI.prototype.directions = api.directions

/**
 *
 * Endpoint: '/maps/api/elevation/json'
 * Google documentation reference: http://code.google.com/apis/maps/documentation/elevation/
 *
 * Quotas: Users of the free API: 2,500 directions requests per 24 hour period. 512 locations per request. 5 requests per second.
           Google Maps API for Work customers: 100,000 directions requests per 24 hour period. 512 locations per request. 10 requests per second.
 */
GoogleMapsAPI.prototype.elevationFromLocations = api.elevationFromLocations

/**
 *
 * Endpoint: '/maps/api/elevation/json'
 * Google documentation reference: http://code.google.com/apis/maps/documentation/elevation/#Paths
 */
GoogleMapsAPI.prototype.elevationFromPath = function(path, samples, callback, sensor) {

  return _elevationFromPath(this.request, this.config, path, samples, callback, sensor);

};


/**
 * V2
 * Endpoint: '/maps/api/staticmap'
 * Google documentation reference: https://developers.google.com/maps/documentation/staticmaps/
 */
GoogleMapsAPI.prototype.staticMap = api.staticMap

/**
 *
 * Endpoint: '/maps/api/streetview'
 * Google documentation reference: http://code.google.com/apis/maps/documentation/streetview
 */
GoogleMapsAPI.prototype.streetView = api.streetView


/**
 * TODO this doesn't belong here
 * Helper function to check and convert an array of points, be it strings/numbers/etc
 * into the format used by Google Maps for representing lists of latitude/longitude pairs
 */
GoogleMapsAPI.prototype.checkAndConvertArrayOfPoints = checkAndConvertPoint = function(input) {

  switch (typeof input) {

    case 'object':
      if (Array.isArray(input)) {
        var output = [];
        for (var i = 0; i < input.length; i++) {
          output.push(checkAndConvertPoint(input[i]));
        }
        return output.join('|');
      }
      break;

    case 'string':
      return input;

  }

  throw new Error('Unrecognized input: checkAndConvertArrayOfPoints accepts Arrays and Strings');

};


/**
 * TODO this doesn't belong here
 * Helper function to check and convert an points, be it strings/arrays of numbers/etc
 * into the format used by Google Maps for representing latitude/longitude pairs
 */
GoogleMapsAPI.prototype.checkAndConvertPoint = function(input) {

  switch (typeof input) {

    case 'object':
      if (Array.isArray(input)) {
        return input[0].toString() + ',' + input[1].toString();
      }
      break;

    case 'string':
      return input;

  }

  throw new Error('Unrecognized input: checkAndConvertPoint accepts Arrays of Numbers and Strings');

};


module.exports = GoogleMapsAPI;

var _elevationFromPath = function(request, config, path, samples, callback, sensor) {

  var MAX_PATH_LENGTH = 1500;

  if (config.encode_polylines === true) {
    path = 'enc:' + _encodePolyline(path);
  }

  var args = {
    'path':    path,
    'samples': samples,
    'sensor': sensor || 'false'
  };

  var count = (path.length < MAX_PATH_LENGTH ? 1 : Math.ceil(path.length/MAX_PATH_LENGTH));


  if (count === 1) {

    _makeRequest(request, config, GOOGLEMAPS_ENDPOINTS['elevation'], args, _jsonParser(callback));

  } else {

    var done = waitress(count, function(err, results) {

      if (err) {
        if (typeof callback === 'function') {
          return callback(err);
        } else {
          throw err;
        }
      }

      results = results
        .sort(function(a, b) { return a.n - b.n; })
        .map(function(v) { return v.results; });

      var status = 'OK';
      var aggregated = [];
      results.forEach(function(result) {
        aggregated = aggregated.concat(result.results);
        if (result.status !== 'OK') {
          status = result.status;
        }
      });
      results = {
        results: aggregated,
        status: status
      };
      return callback(null, results);
    });

    path = path.split('|');
    var pieceSize = Math.ceil(path.length / count);
    var n = 0;

    while (path.length) {
      var smallerPath = path.splice(0, pieceSize);

      // google will throttle us if we launch all the requests together, so we have to stagger them.
      (function(n, path) {

        var samples = path.length;

        path = path.join('|');
        var cb = function(err, results) {
          if (err) {
            return done(err);
          }

          return done(null, { n: n, results: results });
        };

        setTimeout(function() {
          _elevationFromPath(request, config, path, samples, cb, sensor);
        }, Math.floor(Math.random() * config.stagger_time));

      })(++n, smallerPath);
    }
  }

};
