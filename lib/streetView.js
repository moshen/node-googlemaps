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
var MAX_REQUEST_LENGTHS  = _constants.MAX_REQUEST_LENGTHS;

var METHOD_KEY = 'street-view';

function _errorHandler(callback, error) {
  if (typeof callback === 'function') {
    return callback(error);
  }
  throw error;
}

module.exports = function(params, callback) {

  if (typeof callback !== "undefined" && callback !== null) {
    if (typeof callback !== 'function') {
      throw new TypeError('callback must be present');
    }
  }

  if (!(this.config.google_client_id && this.config.google_private_key) && this.config.key == null) {
    return _errorHandler(callback, new Error('The streetView API requires a key. You can add it to the config.'));
  }

  if (!check.object(params)) {
    return _errorHandler(callback, new TypeError('params must be an object'));
  }

  var args = _assignParams({}, params, ACCEPTED_PARAMS[METHOD_KEY]);

  if (args.location == null && args.pano == null) {
    return _errorHandler(callback, new Error('params.location or params.pano is required'));
  }

  if (args.size == null || !/^\d+x\d+$/.test(args.size)) {
    return _errorHandler(callback, new Error('params.size must be specified in the form {horizontal_value}x{vertical_value}'));
  }

  if (args.heading != null) {
    args.heading = parseInt(args.heading, 10);
    if (args.heading < 0 || args.heading > 360) {
      return _errorHandler(callback, new Error('params.heading must be between 0 and 360'));
    }
  }

  if (args.fov != null) {
    args.fov = parseInt(args.fov, 10);
    if (args.fov < 0 || args.fov > 120) {
      return _errorHandler(callback, new Error('params.fov must be between 0 and 120'));
    }
  }

  if (args.pitch != null) {
    args.pitch = parseInt(args.pitch, 10);
    if (args.pitch < -90 || args.pitch > 90) {
      return _errorHandler(callback, new Error('params.pitch must be between -90 and 90'));
    }
  }

  return _makeRequest(this.request, this.config, GOOGLEMAPS_ENDPOINTS[METHOD_KEY], args, callback, MAX_REQUEST_LENGTHS[METHOD_KEY], 'binary');

};
