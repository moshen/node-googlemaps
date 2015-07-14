var debug = require('debug')('googlemaps');

var MODULE_NAME = 'direction'

/**
 * Wraps the callback function to convert the output to a javascript object
 */
module.exports = function(callback) {

  if (typeof callback !== 'function') {
    return false;
  }

  return function(err, jsonString) {

    if (err) {
      return callback(err);
    }

    try {
      var parsed = JSON.parse(jsonString);

      // check for first route duration
      console.log(parsed);
      if (parsed.routes == null || !Array.isArray(parsed.routes)) {
        debug('%s: routes are not an array', MODULE_NAME, parsed);
        return callback(new TypeError('routes not preset'));
      }

      if (parsed.routes[0] == null) {
        debug('%s: first route not present', MODULE_NAME, parsed.routes[0]);
        return callback(new TypeError('first route not preset'));
      }

      if (parsed.routes[0].legs == null || !Array.isArray(parsed.routes[0].legs)) {
        debug('%s: routes legs are not an array', MODULE_NAME, parsed.routes[0]);
        return callback(new TypeError('first leg of the first route not preset'));
      }

      if (parsed.routes[0].legs[0] == null) {
        debug('%s: first leg of the first route not present', MODULE_NAME, parsed.routes[0]);
        return callback(new TypeError('first leg of the first route not preset'));
      }

      if (parsed.routes[0].legs[0].duration == null) {
        debug('%s: no duration for the first leg of the first route', MODULE_NAME, parsed.routes[0].legs[0]);
        return callback(new TypeError('first leg of the first route: duration not preset'));
      }

      if (parsed.routes[0].legs[0].duration.value == null) {
        debug('%s: no duration for the first leg of the first route', MODULE_NAME, parsed.routes[0].legs[0]);
        return callback(new TypeError('first leg of the first route: duration.value not preset'));
      }

      return callback(err, parsed);

    } catch (e) {
      return callback(e);
    }

  };

};
