/**
 * Node.js native modules
 */
var qs = require('querystring');
var url = require('url');
var util = require('util');

/**
 * Modules from the community: package.json
 */
var defaultRequest = require('request');
var crypto = require('crypto');
var waitress = require('waitress');


/**
 * Config keys types
 */
var ACCEPTED_CONFIG_KEYS = {
  'console-key':        'string',
  'encode-polylines':   'boolean',
  'google-client-id':   'string',
  'google-private-key': 'string',
  'proxy':              'string',
  'secure':             'boolean',
  'stagger-time':       'number'
};


/**
 * List of GoogleMaps API endpoints
 */
var GOOGLEMAPS_ENDPOINTS = {
  'directions':      '/maps/api/directions/json',
  'distance-matrix': '/maps/api/distancematrix/json',
  'elevation':       '/maps/api/elevation/json',
  'geocode':         '/maps/api/geocode/json',
  'places-details':  '/maps/api/place/details/json',
  'places-search':   '/maps/api/place/search/json',
  'static-map':      '/maps/api/staticmap',
  'street-view':     '/maps/api/streetview',
};


/**
 * Returns the default configuration object
 */
function _getDefaultConfig() {

  return {
    'google-client-id': null,
    'stagger-time':     200,
    'encode-polylines': true,
    'secure':           false,
    'proxy':            null,
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
 * Assign new configuration keys to the original config object passes
 */
function _setConfig(config, newConfig) {

  for (var key in ACCEPTED_CONFIG_KEYS) {
    var expectedType = ACCEPTED_CONFIG_KEYS[ key ];

    if (newConfig[ key ] !== null && typeof newConfig[ key ] === expectedType) {
      config[ key ] = newConfig[ key ];
    }
  }

  return config;

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

  var buildUrl = function() {
    if (config['google-client-id'] && config['google-private-key']) {
      args.client = config['google-client-id'];

      var query = qs.stringify(args).split('');
      for (var i = 0; i < query.length; ++i) {
        // request will escape these which breaks the signature
        if (query[i] === "'") query[i] = escape(query[i]);
      }
      query = query.join('');

      path = path + "?" + query;

      // Create signer object passing in the key, telling it the key is in base64 format
      var signer = crypto.createHmac('sha1', config['google-private-key']);

      // Get the signature, telling it to return the sig in base64 format
      var signature = signer.update(path).digest('base64');
      signature = signature.replace(/\+/g,'-').replace(/\//g,'_');
      path += "&signature=" + signature;
      return path;
    } else {
      return path + "?" + qs.stringify(args);
    }
  }

  if (config['console-key'] != null) {
    // google requires https when including an apiKey
    secure = true;
    args.key = config['console-key'];
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

  if (typeof callback === 'function') {
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
  }

  return options.uri;

};


/**
 * Constructor
 */
var GoogleMapsAPI = function(config, request) {

  if (typeof config === 'undefined' || config === null) {
    config = {};
  }
  this.config = _setConfig( _getDefaultConfig(), config );

  if (typeof request === 'undefined' || request === null) {
    request = defaultRequest;
  }

  if (typeof request !== 'function') {
    throw new TypeError('Invalid request injected: request must be a function');
  }

  this.request = request;

};


/**
 *
 * Endpoint: /maps/api/place/search/json
 * Google documentation reference: http://code.google.com/apis/maps/documentation/places/
 */
GoogleMapsAPI.prototype.places = function(latlng, radius, key, callback, sensor, types, lang, name, rankby, pagetoken) {

  var PLACES_RANKBY_DEFAULT = 'prominence';
  var PLACES_RANKBY_DISTANCE = 'distance';

  var args = {
    location: latlng,
    key: key
  };

  rankby = rankby || PLACES_RANKBY_DEFAULT;
  if (rankby !== PLACES_RANKBY_DEFAULT && rankby !== PLACES_RANKBY_DISTANCE) {
    rankby = PLACES_RANKBY_DEFAULT;
  }
  args.rankby = rankby;

  // radius can be passed in the request only if the rankby parameter is not 'distance'
  // Ranking results by distance will set a fixed search radius of 50km
  if (typeof radius !== 'undefined' && radius !== null && rankby !== PLACES_RANKBY_DISTANCE) {
    args.radius = radius;
  }

  if (typeof types !== 'undefined' && types !== null) {
    args.types = types;
  }

  if (typeof lang !== 'undefined' && lang !== null) {
    args.lang = lang;
  }

  if (typeof name !== 'undefined' && name !== null) {
    args.name = name;
  }

  if (typeof pagetoken !== 'undefined' && pagetoken !== null) {
    args.pagetoken = pagetoken;
  }

  args.sensor = sensor || 'false';

  return _makeRequest(this.request, this.config, GOOGLEMAPS_ENDPOINTS['places-search'], args, true, _returnObjectFromJSON(callback));
};


/**
 *
 * Endpoint: '/maps/api/place/details/json'
 * Google documentation reference: http://code.google.com/apis/maps/documentation/places/
 */
GoogleMapsAPI.prototype.placeDetails = function(referenceId, key, callback, sensor, lang) {
  var args = {
    reference: referenceId,
    key: key
  };
  if (lang) args.lang = lang;
  args.sensor = sensor || 'false';

  return _makeRequest(this.request, this.config, GOOGLEMAPS_ENDPOINTS['places-details'], args, true, _returnObjectFromJSON(callback));
};


/**
 *
 * Endpoint: '/maps/api/geocode/json'
 * Google documentation reference: http://code.google.com/apis/maps/documentation/geocoding/
 */
GoogleMapsAPI.prototype.geocode = function(address, callback, sensor, bounds, region, language) {

  var args = {
    'address': address
  };
  if (bounds) args.bounds = bounds;
  if (region) args.region = region;
  if (language) args.language = language;
  args.sensor = sensor || 'false';

  return _makeRequest(this.request, this.config, GOOGLEMAPS_ENDPOINTS['geocode'], args, _returnObjectFromJSON(callback));

};


/**
 *
 * Endpoint: '/maps/api/geocode/json'
 * Google documentation reference: http://code.google.com/apis/maps/documentation/geocoding/#ReverseGeocoding
 */
GoogleMapsAPI.prototype.reverseGeocode = function(latlng, callback, sensor, language ) {

  var args = {
    'latlng': latlng
  };
  if (language) args.language = language;
  args.sensor = sensor || 'false';

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
  args.sensor = sensor || 'false';

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
  args.sensor = sensor || 'false';

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
  args.sensor = sensor || 'false';

  return _makeRequest(this.request, this.config, GOOGLEMAPS_ENDPOINTS['elevation'], args, _returnObjectFromJSON(callback));

};


/**
 *
 * Endpoint: '/maps/api/elevation/json'
 * Google documentation reference: http://code.google.com/apis/maps/documentation/elevation/#Paths
 */
GoogleMapsAPI.prototype.elevationFromPath = elevationFromPath =function(path, samples, callback, sensor) {

  var MAX_PATH_LENGTH = 1500;

  if (this.config['encode-polylines'] === true) {
    path = 'enc:' + createEncodedPolyline(path);
  }

  var args = {
    'path':    path,
    'samples': samples
  };
  args.sensor = sensor || 'false';

  var count = (path.length < MAX_PATH_LENGTH ? 1 : Math.ceil(path.length/MAX_PATH_LENGTH));

  if (count === 1) {

    _makeRequest(this.request, this.config, GOOGLEMAPS_ENDPOINTS['elevation'], args, _returnObjectFromJSON(callback));

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
      (function(n, path, samples) {

        path = path.join('|');
        var cb = function(err, results) {
          if (err) {
            return done(err);
          }

          done(null, { n: n, results: results });
        };

        setTimeout(function() {
          elevationFromPath(path, samples, cb, sensor);
        }, Math.floor(Math.random() * this.config['stagger-time']));

      })(++n, smallerPath, smallerPath.length);
    }
  }

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

  args.sensor = sensor || 'false';

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

  args.sensor = sensor || 'false';

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
