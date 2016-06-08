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

  if (this.config.key == null) {
    return callback(new Error('The placeAutocomplete API requires a key. You can add it to the config.'));
  }

  if (!check.object(params)) {
    return callback(new TypeError('params must be an object'));
  }

  var args = _assignParams({}, params, ACCEPTED_PARAMS['place-autocomplete']);

  if (args.input == null) {
    return callback(new Error('params.input is required'));
  }

  return _makeRequest(this.request, this.config, GOOGLEMAPS_ENDPOINTS['place-autocomplete'], args, _jsonParser(callback));

};
