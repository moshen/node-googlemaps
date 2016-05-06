/**
  Transfors an array of markers into a pipe separeted style location array of string
**/
module.exports = function(markers) {

  if (!Array.isArray(markers)) {
    throw new Error('markers must be an array');
  }

  return markers.map(function(marker) {

    var i, len, m = [], keys = ['size', 'color', 'label', 'icon', 'shadow', 'scale'];

    for (i = 0, len = keys.length; i < len; i++) {
      if (marker[keys[i]] != null) {
        m.push(keys[i] + ':' + marker[keys[i]]);
      }
    }

    if (marker.location == null) {
      throw new Error('Each marker must have a location');
    } else {
      m.push(marker['location']);
    }

    return m.join('|');

  });
}
