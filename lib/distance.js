/**
 * Modules from the community: package.json
 */
var check = require('check-types');

/**
 * Internal modules
 */
var _makeRequest  = require('./utils/makeRequest');
var _assignParams = require('./utils/assignParams');
var _jsonParser   = require('./utils/jsonParser');

var _constants = require('./config/constants');

var ACCEPTED_PARAMS      = _constants.ACCEPTED_PARAMS;
var GOOGLEMAPS_ENDPOINTS = _constants.GOOGLEMAPS_ENDPOINTS;


module.exports = function(params, callback) {

  if (typeof callback !== 'function') {
    throw new TypeError('callback must be present');
  }

  if (!(this.config.google_client_id && this.config.google_private_key) && this.config.key == null) {
    return callback(new Error('The distance API requires a key. You can add it to the config.'));
  }

  if (!check.object(params)) {
    return callback(new TypeError('params must be an object'));
  }

  var args = _assignParams({}, params, ACCEPTED_PARAMS['distance-matrix']);

  if (args.origins == null) {
    return callback(new Error('params.origins is required'));
  }

  if (args.destinations == null) {
    return callback(new Error('params.destinations is required'));
  }

  // convert departure_time in UNIX timestamp
  if (args.departure_time != null) {
    args.departure_time = Math.floor( args.departure_time/1000 )
  }

  if (args.mode != null) {
    args.mode = args.mode.toLowerCase();
    if (args.mode !== 'driving' && args.mode !== 'walking' && args.mode !== 'bicycling') {
      return callback(new Error('Invalid transport mode: '+args.mode+'. Valid params.mode are [driving|walking|bicycling]'));
    }
  }

  if (args.avoid != null) {
    args.avoid = args.avoid.toLowerCase();
    if (args.avoid !== 'tolls' && args.avoid !== 'highways' && args.avoid !== 'ferries') {
      return callback(new Error('Invalid params.avoid: '+args.avoid+'. Valid params.avoid are [tolls|highways|ferries]'));
    }
  }

  if (args.units != null) {
    args.units = args.units.toLowerCase();
    if (args.units !== 'metric' && args.units !== 'imperial') {
      return callback(new Error('Invalid params.units: '+args.units+'. Valid params.units are [metric|imperial]'));
    }
  }

  return _makeRequest(this.request, this.config, GOOGLEMAPS_ENDPOINTS['distance-matrix'], args, _jsonParser(callback));

};
