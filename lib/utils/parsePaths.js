var _encodePolyline = require('./encodePolylines');

/**
Transfors an array of paths into a pipe separeted string

input = [
  {
    points: [
      '40.737102,-73.990318',
      '40.749825,-73.987963',
      '40.752946,-73.987384',
      '40.755823,-73.986397'
    ],
    color: '0x0000ff',
    weight: 5
  }
]

output = color:0x0000ff|weight:5|40.737102,-73.990318|40.749825,-73.987963|40.752946,-73.987384|40.755823,-73.986397
**/
module.exports = function(paths, encodePolylines) {

  if (!Array.isArray(paths)) {
    throw new Error('paths must be an array');
  }

  return paths.map(function(path) {

    var i, len, p = [], keys = ['weight', 'color', 'fillcolor', 'geodisc'];

    for (i = 0, len = keys.length; i < len; i++) {
      if (path[keys[i]] != null) {
        p.push(keys[i] + ':' + path[keys[i]]);
      }
    }

    if (!Array.isArray(path.points)) {
      throw new Error('Each path must have an array of points');
    } else {
      if (encodePolylines === true) {
        p.push( 'enc:' + _encodePolyline(path['points']));
      } else {
        path['points'].map(function(point) {
          p.push(point);
        });
      }
    }

    return p.join('|');

  }).join('|');

}
