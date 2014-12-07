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


module.exports = function(locations, callback, sensor) {

  if (this.config['encode-polylines'] === true) {
    locations = 'enc:' + createEncodedPolyline(locations);
  }
  var args = {
    'locations': locations
  };

  return _makeRequest(this.request, this.config, GOOGLEMAPS_ENDPOINTS['elevation'], args, _jsonParser(callback));

};
