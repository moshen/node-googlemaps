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

var MAX_RADIUS = 50000;

var PLACES_RANKBY_DEFAULT = 'prominence';
var PLACES_RANKBY_DISTANCE = 'distance';


module.exports = function(params, callback) {

  if (typeof callback !== 'function') {
    throw new TypeError('callback must be present');
  }

  if (this.config.key == null) {
    return callback(new Error('The placeSearch API requires a key. You can add it to the config.'));
  }

  if (!check.object(params)) {
    return callback(new TypeError('params must be an object'));
  }

  var args = _assignParams({}, params, ACCEPTED_PARAMS['place-search']);

  if (args.location == null) {
    return callback(new Error('params.location is required'));
  }

  if (args.rankby !== PLACES_RANKBY_DEFAULT && args.rankby !== PLACES_RANKBY_DISTANCE) {
    args.rankby = PLACES_RANKBY_DEFAULT;
  }

  /*
    Note that radius must not be included if rankby=distance
    Ranking results by distance will set a fixed search radius of 50km
  */
  if (args.rankby === PLACES_RANKBY_DISTANCE) {
    if (args.keyword == null && args.name == null && args.types == null) {
      return callback(new Error('If rankby=distance is specified, then one or more of keyword, name, or types is required.'));
    }
    delete args.radius;
  } else if (args.rankby === PLACES_RANKBY_DEFAULT) {
    if (args.radius == null) {
      args.radius = MAX_RADIUS;
    }
  }

  if (args.radius != null) {
    args.radius = Math.min(parseInt(args.radius, 10), MAX_RADIUS);
  }

  if (args.minprice != null) {
    args.minprice = parseInt(args.minprice, 10);
    if (args.minprice < 0 || args.minprice > 4) {
      args.minprice = 0;
    }
  }

  if (args.maxprice != null) {
    args.maxprice = parseInt(args.maxprice, 10);
    if (args.maxprice < 0 || args.maxprice > 4) {
      args.maxprice = 4;
    }
    if (args.minprice > args.maxprice) {
      var swap = args.maxprice;
      args.maxprice = ags.minprice;
      args.minprice = swap;
    }
  }

  return _makeRequest(this.request, this.config, GOOGLEMAPS_ENDPOINTS['place-search'], args, _jsonParser(callback));
};
