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


module.exports = function(params, callback) {

  if (typeof callback !== 'function') {
    throw new TypeError('callback must be present');
  }

  // TODO
  // the key is recommended by the documentation although there is no example key to run a test
  // in the future this can be enabled, provided that the integration test is changed
  // if (!(this.config['google-client-id'] && this.config['google-private-key']) && this.config['key'] == null) {
  //   return callback(new Error('The reverse geocode API requires a key. You can add it to the config.'));
  // }

  if (!check.object(params)) {
    return callback(new TypeError('params must be an object'));
  }

  var args = _setParams({}, params, ACCEPTED_PARAMS['reverse-geocode']);

  return _makeRequest(this.request, this.config, GOOGLEMAPS_ENDPOINTS['geocode'], args, _jsonParser(callback));

};
