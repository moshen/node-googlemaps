/**
 * Modules from the community: package.json
 */
var check = require('check-types');

/**
 * Internal modules
 */
var _makeRequest    = require('./utils/makeRequest');
var _setParams      = require('./utils/mergeParams');
var _jsonParser     = require('./utils/jsonParser');
var _parseMarkers   = require('./utils/parseMarkers');
var _parseStyles    = require('./utils/parseStyles');
var _parsePaths     = require('./utils/parsePaths');

var _constants = require('./config/constants');

var ACCEPTED_PARAMS      = _constants.ACCEPTED_PARAMS;
var GOOGLEMAPS_ENDPOINTS = _constants.GOOGLEMAPS_ENDPOINTS;

/**
  path (optional) defines a single path of two or more connected points to overlay on the image at specified locations. This parameter takes a string of point definitions separated by the pipe character (|). You may supply additional paths by adding additional path parameters. Note that if you supply a path for a map, you do not need to specify the (normally required) center and zoom parameters. For more information, see Static Map Paths below.
  visible (optional) specifies one or more locations that should remain visible on the map, though no markers or other indicators will be displayed. Use this parameter to ensure that certain features or map locations are shown on the static map.
  style (optional) defines a custom style to alter the presentation of a specific feature (road, park, etc.) of the map. This parameter takes feature and element arguments identifying the features to select and a set of style operations to apply to that selection. You may supply multiple styles by adding additional style parameters. For more information, see Styled Maps below.
**/

module.exports = function(params, callback) {

  if (typeof callback !== 'function') {
    throw new TypeError('callback must be present');
  }

  if (!(this.config.google_client_id && this.config.google_private_key) && this.config.key == null) {
    return callback(new Error('The staticMap API requires a key. You can add it to the config.'));
  }

  if (!check.object(params)) {
    return callback(new TypeError('params must be an object'));
  }

  var args = _setParams({}, params, ACCEPTED_PARAMS['static-map']);

  if (args.markers == null) {
    if (args.center == null) {
      return callback(new Error('params.center is required'));
    }
    if (args.zoom == null) {
      return callback(new Error('params.zoom is required'));
    }
  } else {
    try {
      args.markers = _parseMarkers(args.markers);
    } catch (ex) {
      return callback(ex);
    }
  }

  if (args.zoom != null) {
    if (args.zoom < 0 || args.zoom > 21) {
      return callback(new Error('params.zoom must be between 0 and 21'));
    }
  }

  if (args.size == null || !/^\d+x\d+$/.test(args.size)) {
    return callback(new Error('params.size must be specified in the form {horizontal_value}x{vertical_value}'));
  }

  if (args.scale != null) {
    var scale = args.scale;
    if (scale !== 1 && scale !== 2 && scale !== 4) {
      return callback(new Error('params.scale must be 1, 2, 4'));
    }
    if (scale === 4 && !(this.config.google_client_id && this.config.google_private_key)) {
      return callback(new Error('params.scale can be 4 only for GoogleMaps for work users'));
    }
  }

  if (args.format != null) {
    if (args.format != 'png8' && args.format != 'png' && args.format != 'png32' && args.format != 'gif' && args.format != 'jpg' && args.format != 'jpg-baseline') {
      return callback(new Error('Invalid params.format: '+args.format+'. Valid params.format are [png8|png|png32|gif|jpg|jpg-baseline]'));
    }
  }

  if (args.maptype != null) {
    args.maptype = args.maptype.toLowerCase();
    if (args.maptype !== 'roadmap' && args.maptype !== 'satellite' && args.maptype !== 'terrain' && args.maptype !== 'hybrid') {
      return callback(new Error('Invalid params.maptype: '+args.maptype+'. Valid params.maptype are [roadmap|satellite|terrain|hybrid]'));
    }
  }

  if (args.style != null) {
    try {
      args.style = _parseStyles(args.style);
    } catch (ex) {
      return callback(ex);
    }
  }

  if (args.path != null) {
    try {
      args.path = _parsePaths(args.path, this.config.encode_polylines);
    } catch (ex) {
      return callback(ex);
    }
  }

  return _makeRequest(this.request, this.config, GOOGLEMAPS_ENDPOINTS['static-map'], args, callback, 'binary');

};
