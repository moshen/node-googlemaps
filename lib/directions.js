/**
 * Modules from the community: package.json
 */
var check = require('check-types');

/**
 * Internal modules
 */
var _makeRequest = require('./utils/makeRequest');
var _setParams   = require('./utils/mergeParams');
var _jsonParser  = require('./utils/jsonParser');
var _constants   = require('./config/constants');

var ACCEPTED_PARAMS      = _constants.ACCEPTED_PARAMS;
var GOOGLEMAPS_ENDPOINTS = _constants.GOOGLEMAPS_ENDPOINTS;


module.exports = function(origin, destination, callback, sensor, mode, waypoints, alternatives, avoid, units, language, departureTime, arrivalTime, region) {

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

  return _makeRequest(this.request, this.config, GOOGLEMAPS_ENDPOINTS['directions'], args, _jsonParser(callback));

};
