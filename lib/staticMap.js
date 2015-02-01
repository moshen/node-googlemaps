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
var _encodePolyline = require('./utils/encodePolylines');

var _constants = require('./config/constants');

var ACCEPTED_PARAMS      = _constants.ACCEPTED_PARAMS;
var GOOGLEMAPS_ENDPOINTS = _constants.GOOGLEMAPS_ENDPOINTS;


module.exports = function(center, zoom, size, callback, sensor, maptype, markers, styles, paths) {

  var args = {
    'center': center,
    'zoom': zoom,
    'size': size
  };
  var i, k;

  if (maptype) args.maptype = maptype;
  if (markers) {
    args.markers = [];
    for (i = 0; i < markers.length; i++) {
      var marker = '';
      if (markers[i].size)     marker += '|size:'   + markers[i].size;
      if (markers[i].color)    marker += '|color:'  + markers[i].color;
      if (markers[i].label)    marker += '|label:'  + markers[i].label;
      if (markers[i].icon)     marker += '|icon:'   + markers[i].icon;
      if (markers[i].shadow)   marker += '|shadow:' + markers[i].shadow;
      if (markers[i].location) marker += '|'      + markers[i].location;
      args.markers[i] = marker;
    }
  }

  if (styles) {
    args.style = [];
    for (i = 0; i < styles.length; i++) {
      var new_style = '';
      if (styles[i].feature) new_style += '|feature:' + styles[i].feature;
      if (styles[i].element) new_style += '|element:' + styles[i].element;

      var rules = styles[i].rules;

      if (rules) {
        for (k in rules) {
          var rule = rules[k];
          new_style += '|' + k + ':' + rule;
        }
      }
      args.style[i] = new_style;
    }
  }

  if (paths) {
    args.path = [];
    for (i = 0; i < paths.length; i++) {
      var new_path = '';
      if (paths[i].weight)    new_path += '|weight:' + paths[i].weight;
      if (paths[i].color)     new_path += '|color:' + paths[i].color;
      if (paths[i].fillcolor) new_path += '|fillcolor:' + paths[i].fillcolor;

      var points = paths[i].points;

      if (points) {
        if (this.config['encode-polylines'] === true) {
          new_path += '|enc:' + _encodePolyline(points);
        } else {
          for (k = 0; k < points.length; k++) {
            new_path += '|' + points[k];
          }
        }
      }
      args.path[i] = new_path.replace(/^\|/, '');
    }
  }

  return _makeRequest(this.request, this.config, GOOGLEMAPS_ENDPOINTS['static-map'], args, callback, 'binary');

};
