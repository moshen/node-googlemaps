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
var _parseMarkers = require('./utils/parseMarkers');
var _parseStyles  = require('./utils/parseStyles');
var _parsePaths   = require('./utils/parsePaths');

var _constants = require('./config/constants');

var ACCEPTED_PARAMS      = _constants.ACCEPTED_PARAMS;
var GOOGLEMAPS_ENDPOINTS = _constants.GOOGLEMAPS_ENDPOINTS;


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
    return _errorHandler(callback, new Error('The staticMap API requires a key. You can add it to the config.'));
  }

  if (!check.object(params)) {
    return _errorHandler(callback, new TypeError('params must be an object'));
  }

  var args = _assignParams({}, params, ACCEPTED_PARAMS['static-map']);

  // If a marker param or path param is provided then center and zoom param is not required
  if (args.markers == null && args.path == null) {
    if (args.center == null) {
      return _errorHandler(callback, new Error('params.center is required'));
    }
    if (args.zoom == null) {
      return _errorHandler(callback, new Error('params.zoom is required'));
    }
  }

  if (args.markers != null) {
    try {
      args.markers = _parseMarkers(args.markers);
    } catch (ex) {
      return _errorHandler(callback, ex);
    }
  }

  if (args.zoom != null) {
    if (args.zoom < 0 || args.zoom > 21) {
      return _errorHandler(callback, new Error('params.zoom must be between 0 and 21'));
    }
  }

  if (args.size == null || !/^\d+x\d+$/.test(args.size)) {
    return _errorHandler(callback, new Error('params.size must be specified in the form {horizontal_value}x{vertical_value}'));
  }

  if (args.scale != null) {
    var scale = args.scale;
    if (scale !== 1 && scale !== 2 && scale !== 4) {
      return _errorHandler(callback, new Error('params.scale must be 1, 2, 4'));
    }
    if (scale === 4 && !(this.config.google_client_id && this.config.google_private_key)) {
      return _errorHandler(callback, new Error('params.scale can be 4 only for GoogleMaps for work users'));
    }
  }

  if (args.format != null) {
    if (args.format != 'png8' && args.format != 'png' && args.format != 'png32' && args.format != 'gif' && args.format != 'jpg' && args.format != 'jpg-baseline') {
      return _errorHandler(callback, new Error('Invalid params.format: '+args.format+'. Valid params.format are [png8|png|png32|gif|jpg|jpg-baseline]'));
    }
  }

  if (args.maptype != null) {
    args.maptype = args.maptype.toLowerCase();
    if (args.maptype !== 'roadmap' && args.maptype !== 'satellite' && args.maptype !== 'terrain' && args.maptype !== 'hybrid') {
      return _errorHandler(callback, new Error('Invalid params.maptype: '+args.maptype+'. Valid params.maptype are [roadmap|satellite|terrain|hybrid]'));
    }
  }

  if (args.style != null) {
    try {
      args.style = _parseStyles(args.style);
    } catch (ex) {
      return _errorHandler(callback, ex);
    }
  }

  if (args.path != null) {
    try {
      args.path = _parsePaths(args.path, this.config.encode_polylines);
    } catch (ex) {
      return _errorHandler(callback, ex);
    }
  }

  return _makeRequest(this.request, this.config, GOOGLEMAPS_ENDPOINTS['static-map'], args, callback, 'binary');

};
