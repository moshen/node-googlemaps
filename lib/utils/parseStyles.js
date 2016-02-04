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

module.exports = function(styles) {

  if (!Array.isArray(styles)) {
    throw new Error('styles must be an array');
  }

  return styles.map(function(style){

    var i, len, s = [], keys = ['feature', 'element'];

    for (i = 0, len = keys.length; i < len; i++) {
      if (style[keys[i]] != null) {
        s.push(keys[i] + ':' + style[keys[i]]);
      }
    }

    if (style.rules != null) {
      var k;
      for (k in style.rules) {
        s.push(k + ':' + style.rules[k]);
      }
    }

    return s.join('|');

  });

}
