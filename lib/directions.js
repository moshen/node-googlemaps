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

var _constants = require('./config/constants');

var ACCEPTED_PARAMS      = _constants.ACCEPTED_PARAMS;
var GOOGLEMAPS_ENDPOINTS = _constants.GOOGLEMAPS_ENDPOINTS;


module.exports = function(params, callback) {

  if (typeof callback !== 'function') {
    throw new TypeError('callback must be present');
  }

  if (!(this.config['google-client-id'] && this.config['google-private-key']) && this.config['key'] == null) {
    return callback(new Error('The directions API requires a key. You can add it to the config.'));
  }

  if (!check.object(params)) {
    return callback(new TypeError('params must be an object'));
  }

  var args = _setParams({}, params, ACCEPTED_PARAMS['directions']);

  if (args.origin == null) {
    return callback(new Error('params.origin is required'));
  }

  if (args.destination == null) {
    return callback(new Error('params.destination is required'));
  }

  if (args.mode != null) {
    args.mode = args.mode.toLowerCase();
    if (args.mode !== 'driving' && args.mode !== 'walking' && args.mode !== 'bicycling' && args.mode !== 'transit') {
      return callback(new Error('Invalid transport mode: '+args.mode+'. Valid params.mode are [driving|walking|bicycling|transit]'));
    }
    if (args.mode == 'transit') {
      if (args.departure_time == null && args.arrival_time == null) {
        return callback(new Error('When specifying params.mode = transit either params.departure_time or params.arrival_time must be provided'));
      }
      if (args.waypoints != null) {
        return callback(new Error('It is not possible to specify waypoints when params.mode = transit'));
      }
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

  if (args.departure_time != null || args.arrival_time != null) {
    if (args.mode !== 'driving' && args.mode !== 'transit') {
      return callback(new Error('params.departure_time or params.arrival_time can only be specified when params.mode = [driving|transit]'));
    }
  }

  // convert departure_time in UNIX timestamp
  if (args.departure_time != null) {
    args.departure_time = Math.floor( args.departure_time/1000 )
  }

  // convert arrival_time in UNIX timestamp
  if (args.arrival_time != null) {
    args.arrival_time = Math.floor( args.arrival_time/1000 )
  }

  return _makeRequest(this.request, this.config, GOOGLEMAPS_ENDPOINTS['directions'], args, _jsonParser(callback));

};
