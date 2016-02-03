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

  // validate distance matrix args
  if (args.origins == null) {
    return callback(new Error('params.origins is required'));
  }

  if (args.destinations == null) {
    return callback(new Error('params.destinations is required'));
  }

  // validate common directions/distance-matrix args
  try {
    _travelUtils.validateCommonArgs(args);
  } catch(e) {
    return callback(e);
  }

  _travelUtils.convertTargetTimes(args);
  
  return _makeRequest(this.request, this.config, GOOGLEMAPS_ENDPOINTS['distance-matrix'], args, _jsonParser(callback));

};
