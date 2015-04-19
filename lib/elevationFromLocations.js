/**
 * Modules from the community: package.json
 */
var check = require('check-types');

/**
 * Internal modules
 */
var _makeRequest    = require('./utils/makeRequest');
var _assignParams   = require('./utils/assignParams');
var _jsonParser     = require('./utils/jsonParser');
var _encodePolyline = require('./utils/encodePolylines');

var _constants = require('./config/constants');

var ACCEPTED_PARAMS      = _constants.ACCEPTED_PARAMS;
var GOOGLEMAPS_ENDPOINTS = _constants.GOOGLEMAPS_ENDPOINTS;


module.exports = function(params, callback) {

  if (typeof callback !== 'function') {
    throw new TypeError('callback must be present');
  }

  if (!(this.config.google_client_id && this.config.google_private_key) && this.config.key == null) {
    return callback(new Error('The elevation API requires a key. You can add it to the config.'));
  }

  if (!check.object(params)) {
    return callback(new TypeError('params must be an object'));
  }

  var args = _assignParams({}, params, ACCEPTED_PARAMS['elevation']);

  if (args.locations == null) {
    return callback(new Error('params.locations is required'));
  }

  if (this.config.encode_polylines === true) {
    args.locations = 'enc:' + _encodePolyline(args.locations);
  }

  return _makeRequest(this.request, this.config, GOOGLEMAPS_ENDPOINTS['elevation'], args, _jsonParser(callback));

};
