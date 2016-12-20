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
var _travelUtils  = require('./utils/travelUtils');

var _constants = require('./config/constants');

var ACCEPTED_PARAMS      = _constants.ACCEPTED_PARAMS;
var GOOGLEMAPS_ENDPOINTS = _constants.GOOGLEMAPS_ENDPOINTS;
var MAX_REQUEST_LENGTHS  = _constants.MAX_REQUEST_LENGTHS;

var METHOD_KEY = 'directions';

module.exports = function(params, callback) {

  if (typeof callback !== 'function') {
    throw new TypeError('callback must be present');
  }

  if (!(this.config.google_client_id && this.config.google_private_key) && this.config.key == null) {
    return callback(new Error('The directions API requires a key. You can add it to the config.'));
  }

  if (!check.object(params)) {
    return callback(new TypeError('params must be an object'));
  }

  var args = _assignParams({}, params, ACCEPTED_PARAMS[METHOD_KEY]);

  // validate directions specific args
  if (args.origin == null) {
    return callback(new Error('params.origin is required'));
  }

  if (args.destination == null) {
    return callback(new Error('params.destination is required'));
  }

  // validate common directions/distance-matrix args
  try {
    _travelUtils.validateCommonArgs(args);
  } catch(e) {
    return callback(e);
  }

  _travelUtils.convertTargetTimes(args);

  return _makeRequest(this.request, this.config, GOOGLEMAPS_ENDPOINTS[METHOD_KEY], args, _jsonParser(callback), MAX_REQUEST_LENGTHS[METHOD_KEY]);

};
