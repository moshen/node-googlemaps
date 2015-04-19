/**
 * Modules from the community: package.json
 */
var check = require('check-types');

/**
 * Returns a type validated object.
 * It uses a key -> type hash to validate
 *
 */
 module.exports = function (params, newParams, acceptedKeys) {

  if (!check.object(params)) {
    params = {};
  }

  if (!check.object(newParams)) {
    newParams = {};
  }

  if (!check.object(acceptedKeys)) {
    throw new TypeError('acceptedKeys must be an object');
  }

  for (var key in acceptedKeys) {

    if (newParams[ key ] != null) {

      var expectedType = acceptedKeys[ key ];

      if (expectedType == 'date') {

        if (check.date(newParams[ key ])) {
          params[ key ] = newParams[ key ];
        }

      } else if (expectedType == 'array') {

        if (Array.isArray(newParams[ key ])) {
          params[ key ] = newParams[ key ];
        }

      } else {

        if (typeof newParams[ key ] === expectedType) {
          params[ key ] = newParams[ key ];
        }

      }
    }

  }

  return params;

};
