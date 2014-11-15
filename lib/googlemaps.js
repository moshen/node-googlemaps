/**
 * Node.js native modules
 */
var qs     = require('querystring');
var url    = require('url');
var util   = require('util');
var crypto = require('crypto');

/**
 * Modules from the community: package.json
 */
var defaultRequest = require('request');
var waitress       = require('waitress');
var check          = require('check-types');


/**
 * Config keys types
 */
var ACCEPTED_CONFIG_KEYS = {
  'encode-polylines':   'boolean',
  'google-client-id':   'string',
  'google-private-key': 'string',
  'key':                'string',
  'proxy':              'string',
  'secure':             'boolean',
  'stagger-time':       'number'
};

/**
 * Accepted parameters for Google maps APIs
 */
var ACCEPTED_PARAMS = {
  'place-search': {
    'keyword':   'string',
    'language':  'string',
    'location':  'string',
    'maxprice':  'number',
    'minprice':  'number',
    'name':      'string',
    'opennow':   'boolean',
    'pagetoken': 'string',
    'radius':    'number',
    'rankby':    'string',
    'sensor':    'string',
    'types':     'string'
  },
  'place-details': {
    'placeid': 'string',
    'extensions': 'string',
    'language': 'string'
  },
  'geocode': {
    'address': 'string',
    'components': 'string',
    'bounds': 'string',
    'language': 'string',
    'region': 'string'
  },
  'reverse-geocode': {
    'latlng': 'string',
    'result_type': 'string',
    'postal_code': 'string',
    'language': 'string',
    'location_type': 'string'
  }
};


/**
 * List of GoogleMaps API endpoints
 */
var GOOGLEMAPS_ENDPOINTS = {
  'directions':      '/maps/api/directions/json',
  'distance-matrix': '/maps/api/distancematrix/json',
  'elevation':       '/maps/api/elevation/json',
  'geocode':         '/maps/api/geocode/json',
  'place-details':  '/maps/api/place/details/json',
  'place-search':   '/maps/api/place/nearbysearch/json',
  'static-map':      '/maps/api/staticmap',
  'street-view':     '/maps/api/streetview',
};


/**
 * Returns the default configuration object
 */
function _getDefaultConfig() {

  return {
    'encode-polylines': true,
    'google-client-id': null,
    'key':              null,
    'proxy':            null,
    'secure':           false,
    'stagger-time':     200,
    set 'google-private-key'(value) {
      if (typeof value !== 'undefined' && value !== null) {
        // Google private keys are URL friendly base64, needs to be replaced with base64 valid characters
        this.googlePrivateKey = value.replace(/-/g,'+').replace(/_/g,'/');
        this.googlePrivateKey = new Buffer(this.googlePrivateKey, 'base64');
      } else {
        this.googlePrivateKey = null;
      }
    },
    get 'google-private-key'() {
      return this.googlePrivateKey || null;
    }
  };

};


/**
 * Returns a type validated object.
 * It uses a key -> type hash to validate
 */
function _setParams(params, newParams, acceptedKeys) {

  if (!check.object(params)) {
    params = {};
  }

  if (!check.object(newParams)) {
    newParams = {};
  }

  if (!check.object(acceptedKeys)) {
    throw new TypeError('acceptedKeys must be an object');
  }

  for (var key in acceptedKeys) {
    var expectedType = acceptedKeys[ key ];

    if (newParams[ key ] !== null && typeof newParams[ key ] === expectedType) {
      params[ key ] = newParams[ key ];
    }
  }

  return params;

};


/**
 *
 */
function _encodeNumber(num) {

  var encodeString = "";
  var nextValue, finalValue;
  while (num >= 0x20) {
    nextValue = (0x20 | (num & 0x1f)) + 63;
    encodeString += (String.fromCharCode(nextValue));
    num >>= 5;
  }
  finalValue = num + 63;
  encodeString += (String.fromCharCode(finalValue));

  return encodeString;

};


/**
 * Wraps the callback function to convert the output to a javascript object
 */
function _returnObjectFromJSON(callback) {

  if (typeof callback !== 'function') {
    return false;
  }

  return function(err, jsonString) {

    if (err) {
      return callback(err);
    }

    try {
      callback(err, JSON.parse(jsonString));
    } catch (e) {
      return callback(e);
    }
  };

};


/**
 * Makes the request to Google Maps API.
 */
function _makeRequest(request, config, path, args, callback, encoding) {

  var REQUEST_MAX_LENGTH = 2048;

  var secure = config['secure'];

  if (args.sensor == null) {
    args.sensor = 'false';
  }

  var buildUrl = function() {
    if (config['google-client-id'] && config['google-private-key']) {
      args.client = config['google-client-id'];

      // TODO
      // is this the best way to clean the query string?
      // why does request break the signature with ' character if the signature is generated before request?
      // signature = signature.replace(/\+/g,'-').replace(/\//g,'_');
      var query = qs.stringify(args).split('');
      for (var i = 0; i < query.length; ++i) {
        // request will escape these which breaks the signature
        if (query[i] === "'") query[i] = escape(query[i]);
      }
      query = query.join('');

      path = path + "?" + query;

      // Create signer object passing in the key, telling it the key is in base64 format
      var signer = crypto.createHmac('sha1', config['google-private-key']);

      // Get the signature, telling it to return the signature in base64 format
      var signature = signer.update(path).digest('base64');
      signature = signature.replace(/\+/g,'-').replace(/\//g,'_');
      path += "&signature=" + signature;
      return path;
    } else {
      return path + "?" + qs.stringify(args);
    }
  }

  if (config['key'] != null) {
    // google requires https when including an apiKey
    secure = true;
    args.key = config['key'];
  }

  path = buildUrl(path, args);

  if (path.length > REQUEST_MAX_LENGTH) {
    error = new Error('Request too long for google to handle (' + REQUEST_MAX_LENGTH + ' characters).');
    if (typeof callback === 'function') {
      return callback(error);
    }
    throw error;
  }

  var options = {
    uri: (secure ? 'https' : 'http') + '://maps.googleapis.com' + path
  };

  if (encoding) options.encoding = encoding;
  if (config['proxy']) options.proxy = config['proxy'];

  if (typeof callback !== 'function') {
    return options.uri;
  }

  request(options, function (error, res, data) {
    if (error) {
      return callback(error);
    }
    if (res.statusCode === 200) {
      return callback(null, data);
    }
    error = new Error(data);
    error.code = res.statusCode;
    return callback(error, data);
  });

};


var _elevationFromPath = function(request, config, path, samples, callback, sensor) {

  var MAX_PATH_LENGTH = 1500;

  if (config['encode-polylines'] === true) {
    path = 'enc:' + createEncodedPolyline(path);
  }

  var args = {
    'path':    path,
    'samples': samples,
    'sensor': sensor || 'false'
  };

  var count = (path.length < MAX_PATH_LENGTH ? 1 : Math.ceil(path.length/MAX_PATH_LENGTH));


  if (count === 1) {

    _makeRequest(request, config, GOOGLEMAPS_ENDPOINTS['elevation'], args, _returnObjectFromJSON(callback));

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
        }, Math.floor(Math.random() * config['stagger-time']));

      })(++n, smallerPath);
    }
  }

};


// END OF PRIVATE VARIABLES: for consistency all private variable should be places above.


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
 *
 * Endpoint: /maps/api/place/search/json
 * Google documentation reference: https://developers.google.com/places/documentation/search
 *
 * TODO: Maps API for Work customers should not include a client or signature parameter with their requests.
 * TODO: params zagatselected
 */
GoogleMapsAPI.prototype.placeSearch = function(params, callback) {

  if (typeof callback !== 'function') {
    throw new TypeError('callback must be present');
  }

  if (this.config['key'] == null) {
    return callback(new Error('The placeSearch API requires a key. You can add it to the config.'));
  }

  if (!check.object(params)) {
    return callback(new TypeError('params must be an object'));
  }

  var args = _setParams(params, args, ACCEPTED_PARAMS['place-search']);

  if (args.location == null) {
    return callback(new Error('params.locaiton is required'));
  }

  var PLACES_RANKBY_DEFAULT = 'prominence';
  var PLACES_RANKBY_DISTANCE = 'distance';
  if (args.rankby !== PLACES_RANKBY_DEFAULT && args.rankby !== PLACES_RANKBY_DISTANCE) {
    args.rankby = PLACES_RANKBY_DEFAULT;
  }

  /*
    Note that radius must not be included if rankby=distance
    Ranking results by distance will set a fixed search radius of 50km
  */
  if (args.rankby === PLACES_RANKBY_DISTANCE) {
    if (args.keyword == null && args.name == null && args.types == null) {
      delete args.radius;
      return callback(new Error('If rankby=distance is specified, then one or more of keyword, name, or types is required.'));
    }
  } else if (args.rankby === PLACES_RANKBY_DEFAULT) {
    if (args.radius == null) {
      args.radius = MAX_RADIUS;
    }
  }

  var MAX_RADIUS = 50000;
  if (args.radius !== null) {
    args.radius = Math.min(parseInt(args.radius, 10), MAX_RADIUS);
  }

  if (args.minprice !== null) {
    args.minprice = parseInt(args.minprice, 10);
    if (args.minprice < 0 || args.minprice > 4) {
      args.minprice = 0;
    }
  }

  if (args.maxprice !== null) {
    args.maxprice = parseInt(args.maxprice, 10);
    if (args.maxprice < 0 || args.maxprice > 4) {
      args.maxprice = 4;
    }
    if (args.minprice > args.maxprice) {
      var swap = args.maxprice;
      args.maxprice = ags.minprice;
      args.minprice = swap;
    }
  }

  return _makeRequest(this.request, this.config, GOOGLEMAPS_ENDPOINTS['place-search'], args, _returnObjectFromJSON(callback));
};


/**
 *
 * Endpoint: '/maps/api/place/details/json'
 * Google documentation reference: http://code.google.com/apis/maps/documentation/places/
 * 
 * Note: reference is deprecated. The reference advises to use placeId instead
 * Note: sensor is no longer required
 */
GoogleMapsAPI.prototype.placeDetails = function(params, callback) {

  if (typeof callback !== 'function') {
    throw new TypeError('callback must be present');
  }

  if (this.config['key'] == null) {
    return callback(new Error('The placeDetails API requires a key. You can add it to the config.'));
  }

  if (!check.object(params)) {
    return callback(new TypeError('params must be an object'));
  }

  var args = _setParams(params, args, ACCEPTED_PARAMS['place-details']);

  if (args.placeid == null) {
    return callback(new Error('params.placeid is required'));
  }

  return _makeRequest(this.request, this.config, GOOGLEMAPS_ENDPOINTS['place-details'], args, _returnObjectFromJSON(callback));
};


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
GoogleMapsAPI.prototype.geocode = function(params, callback) {

  if (typeof callback !== 'function') {
    throw new TypeError('callback must be present');
  }

  // TODO
  // the key is recommended by the documentation although there is no example key to run a test
  // in the future this can be enabled, provided that the integration test is cahnged
  // if (!(this.config['google-client-id'] && this.config['google-private-key']) && this.config['key'] == null) {
  //   return callback(new Error('The geocode API requires a key. You can add it to the config.'));
  // }

  if (!check.object(params)) {
    return callback(new TypeError('params must be an object'));
  }

  var args = _setParams(params, args, ACCEPTED_PARAMS['geocode']);

  return _makeRequest(this.request, this.config, GOOGLEMAPS_ENDPOINTS['geocode'], args, _returnObjectFromJSON(callback));

};


/**
 *
 * Endpoint: '/maps/api/geocode/json'
 * Google documentation reference: https://developers.google.com/maps/documentation/geocoding/#ReverseGeocoding
 */
GoogleMapsAPI.prototype.reverseGeocode = function(params, callback) {

  if (typeof callback !== 'function') {
    throw new TypeError('callback must be present');
  }

  // TODO
  // the key is recommended by the documentation although there is no example key to run a test
  // in the future this can be enabled, provided that the integration test is cahnged
  // if (!(this.config['google-client-id'] && this.config['google-private-key']) && this.config['key'] == null) {
  //   return callback(new Error('The reverse geocode API requires a key. You can add it to the config.'));
  // }

  if (!check.object(params)) {
    return callback(new TypeError('params must be an object'));
  }

  var args = _setParams(params, args, ACCEPTED_PARAMS['reverse-geocode']);

  return _makeRequest(this.request, this.config, GOOGLEMAPS_ENDPOINTS['geocode'], args, _returnObjectFromJSON(callback));

};


/**
 *
 * Endpoint: '/maps/api/geocode/json'
 * Google documentation reference: http://code.google.com/apis/maps/documentation/distancematrix/
 */
GoogleMapsAPI.prototype.distance = function(origins, destinations, callback, sensor, mode, alternatives, avoid, units, language) {

  var args = {
    'origins':      origins,
    'destinations': destinations
  };
  if (mode) args.mode = mode.toLowerCase();
  if (avoid) args.avoid = avoid;
  if (units) args.units = units;
  if (language) args.language = language;

  return _makeRequest(this.request, this.config, GOOGLEMAPS_ENDPOINTS['distance-matrix'], args, _returnObjectFromJSON(callback));

};


/**
 * departureTime and arrivalTime must be passed as UNIX timestamp => Math.floor((new Date()).getTime()/1000)
 *
 * Endpoint: '/maps/api/directions/json'
 * Google documentation reference: http://code.google.com/apis/maps/documentation/directions/
 */
GoogleMapsAPI.prototype.directions = function(origin, destination, callback, sensor, mode, waypoints, alternatives, avoid, units, language, departureTime, arrivalTime, region) {

  var args = {
    'origin':      origin,
    'destination': destination
  };

  if (mode) args.mode = mode.toLowerCase();

  // for mode transit you MUST pass either departur or arrival time
  if (mode === 'transit' && ((typeof departureTime === 'undefined' || departureTime === null) && (typeof arrivalTime === 'undefined' || arrivalTime === null))) {
    var error = new Error('If you set the mode to "transit" you must also specify either a departure_time or an arrival_time');
    if (typeof callback === 'function') {
      return callback(error);
    }
    else {
      throw error;
    }
  }

  if (typeof departureTime !== 'undefined' && departureTime !== null) {
    if (mode === 'transit' || mode === 'driving') {

      args.departure_time = departureTime

      if (typeof arrivalTime !== 'undefined' && arrivalTime !== null) {
        args.arrival_time = arrivalTime
      }
    }
  }

  if (waypoints) args.waypoints = waypoints;
  if (alternatives) args.alternatives = alternatives;
  if (avoid) args.avoid = avoid;
  if (units) args.units = units;
  if (language) args.language = language;
  if (region) args.region = region;

  return _makeRequest(this.request, this.config, GOOGLEMAPS_ENDPOINTS['directions'], args, _returnObjectFromJSON(callback));

};


/**
 *
 * Endpoint: '/maps/api/elevation/json'
 * Google documentation reference: http://code.google.com/apis/maps/documentation/elevation/
 */
GoogleMapsAPI.prototype.elevationFromLocations = function(locations, callback, sensor) {

  if (this.config['encode-polylines'] === true) {
    locations = 'enc:' + createEncodedPolyline(locations);
  }
  var args = {
    'locations': locations
  };

  return _makeRequest(this.request, this.config, GOOGLEMAPS_ENDPOINTS['elevation'], args, _returnObjectFromJSON(callback));

};


/**
 *
 * Endpoint: '/maps/api/elevation/json'
 * Google documentation reference: http://code.google.com/apis/maps/documentation/elevation/#Paths
 */
GoogleMapsAPI.prototype.elevationFromPath = function(path, samples, callback, sensor) {

  return _elevationFromPath(this.request, this.config, path, samples, callback, sensor);

};


/**
 *
 * Endpoint: '/maps/api/staticmap'
 * Google documentation reference: http://code.google.com/apis/maps/documentation/staticmaps
 */
GoogleMapsAPI.prototype.staticMap = function(center, zoom, size, callback, sensor, maptype, markers, styles, paths) {

  var args = {
    'center': center,
    'zoom': zoom,
    'size': size
  };
  var i, k;

  if (maptype) args.maptype = maptype;
  if (markers) {
    args.markers = [];
    for (i = 0; i < markers.length; i++) {
      var marker = '';
      if (markers[i].size)     marker += '|size:'   + markers[i].size;
      if (markers[i].color)    marker += '|color:'  + markers[i].color;
      if (markers[i].label)    marker += '|label:'  + markers[i].label;
      if (markers[i].icon)     marker += '|icon:'   + markers[i].icon;
      if (markers[i].shadow)   marker += '|shadow:' + markers[i].shadow;
      if (markers[i].location) marker += '|'      + markers[i].location;
      args.markers[i] = marker;
    }
  }

  if (styles) {
    args.style = [];
    for (i = 0; i < styles.length; i++) {
      var new_style = '';
      if (styles[i].feature) new_style += '|feature:' + styles[i].feature;
      if (styles[i].element) new_style += '|element:' + styles[i].element;

      var rules = styles[i].rules;

      if (rules) {
        for (k in rules) {
          var rule = rules[k];
          new_style += '|' + k + ':' + rule;
        }
      }
      args.style[i] = new_style;
    }
  }

  if (paths) {
    args.path = [];
    for (i = 0; i < paths.length; i++) {
      var new_path = '';
      if (paths[i].weight)    new_path += '|weight:' + paths[i].weight;
      if (paths[i].color)     new_path += '|color:' + paths[i].color;
      if (paths[i].fillcolor) new_path += '|fillcolor:' + paths[i].fillcolor;

      var points = paths[i].points;

      if (points) {
        if (this.config['encode-polylines'] === true) {
          new_path += '|enc:' + createEncodedPolyline(points);
        } else {
          for (k = 0; k < points.length; k++) {
            new_path += '|' + points[k];
          }
        }
      }
      args.path[i] = new_path.replace(/^\|/, '');
    }
  }

  return _makeRequest(this.request, this.config, GOOGLEMAPS_ENDPOINTS['static-map'], args, callback, 'binary');

};


/**
 *
 * Endpoint: '/maps/api/streetview'
 * Google documentation reference: http://code.google.com/apis/maps/documentation/streetview
 */
GoogleMapsAPI.prototype.streetView = function(size, location, callback, sensor, heading, fov, pitch) {

  var args = {
    'size': size,
    'location': location
  };

  if (heading) {
    heading = parseInt(heading, 10);
    if (heading >= 0 && heading <= 360) {
      args.heading = heading;
    }
  }

  if (fov) {
    fov = parseInt(fov, 10);
    if (fov >= 0 && fov <= 120) {
      args.fov = fov;
    }
  }

  if (pitch) {
    pitch = parseInt(pitch, 10);
    if (pitch >= -90 && pitch <= 90) {
      args.pitch = pitch;
    }
  }


  return _makeRequest(this.request, this.config, GOOGLEMAPS_ENDPOINTS['street-view'], args, callback, 'binary');

};


/**
 * TODO: do we really need to eexpose this? Is anybody using it?
 *
 * Algorithm pull from Google's definition of an encoded polyline
 *
 * Google documentation reference: https://developers.google.com/maps/documentation/utilities/polylinealgorithm
 */
GoogleMapsAPI.prototype.createEncodedPolyline = createEncodedPolyline = function createEncodedPolyline(points) {

  var _encodeSignedNumber = function(num) {
    var sgn_num = num << 1;
    if (num < 0) {
      sgn_num = ~(sgn_num);
    }
    return _encodeNumber(sgn_num);
  }

  // Dear maintainer:
  //
  // Once you are done trying to 'optimize' this routine,
  // and have realized what a terrible mistake that was,
  // please increment the following counter as a warning
  // to the next guy:
  //
  // total_hours_wasted_here = 11
  //
  var i, dlat, dlng;
  var plat = 0;
  var plng = 0;
  var encoded_points = "";
  if (typeof points === 'string') {
    points = points.split('|');
  }

  for (i = 0; i < points.length; i++) {
    var point = points[i].split(',');
    var lat = point[0];
    var lng = point[1];
    var late5 = Math.round(lat * 1e5);
    var lnge5 = Math.round(lng * 1e5);
    dlat = late5 - plat;
    dlng = lnge5 - plng;
    plat = late5;
    plng = lnge5;
    encoded_points += _encodeSignedNumber(dlat) + _encodeSignedNumber(dlng);
  }

  return encoded_points;

};


/**
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
