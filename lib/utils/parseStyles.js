/**
Transforms an array of style objects into an array of pipe separated strings

input = [
  {
    'feature': 'road',
    'element': 'all',
    'rules': {
      'hue': '0x00ff00'
    }
  },
  {
    'feature': 'landscape',
    'element': 'all',
    'rules': {
      'visibility': 'off'
    }
  }
]

output = [
  "feature:road|element:all|hue:0x00ff00",
  "feature:landscape|element:all|visibility:off"
]
**/

/**
 * Normalises a style value for the Static Maps API URL.
 * Converts hex colours like "#1d2c4d" to "0x1d2c4d".
 */
function _normalizeStyleValue(key, value) {
  if (typeof value === 'string' && value.charAt(0) === '#') {
    return '0x' + value.substring(1);
  }
  return value;
}

module.exports = function(styles) {

  if (!Array.isArray(styles)) {
    throw new Error('styles must be an array');
  }

  return styles.map(function(style){

    var i, len, s = [];

    var feature = style.feature || style.featureType;
    var element = style.element || style.elementType;

    if (feature != null) {
      s.push('feature:' + feature);
    }

    if (element != null) {
      s.push('element:' + element);
    }

    var stylers = style.rules || style.stylers;
    if (stylers != null) {
      if (Array.isArray(stylers)) {
        for (i = 0, len = stylers.length; i < len; i++) {
          var styler = stylers[i];
          for (var k in styler) {
            s.push(k + ':' + _normalizeStyleValue(k, styler[k]));
          }
        }
      } else {
        for (var key in stylers) {
          s.push(key + ':' + _normalizeStyleValue(key, stylers[key]));
        }
      }
    }

    return s.join('|');

  });

};
