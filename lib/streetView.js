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


module.exports = function(size, location, callback, sensor, heading, fov, pitch) {

  var args = {
    'size': size,
    'location': location
  };

  if (heading) {
    heading = parseInt(heading, 10);
    if (heading >= 0 && heading <= 360) {
      args.heading = heading;
    }
  }

  if (fov) {
    fov = parseInt(fov, 10);
    if (fov >= 0 && fov <= 120) {
      args.fov = fov;
    }
  }

  if (pitch) {
    pitch = parseInt(pitch, 10);
    if (pitch >= -90 && pitch <= 90) {
      args.pitch = pitch;
    }
  }


  return _makeRequest(this.request, this.config, GOOGLEMAPS_ENDPOINTS['street-view'], args, callback, 'binary');

};
