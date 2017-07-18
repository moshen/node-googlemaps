/**
Transforms an array of style objects into an array of pipe separated strings

input = [
  {
    'featureType': 'road',
    'elementType': 'all',
    'stylers': [{
      'color': '#00ff00'
    }]
  },
  {
    'featureType': 'landscape',
    'elementType': 'all',
    'stylers': {
      'visibility': 'off'
    }
  }
]

output = [
  "feature:road|element:all|color:0x00ff00",
  "feature:landscape|element:all|visibility:off"
]
**/

module.exports = function(styles) {
if (!Array.isArray(styles)) {
    throw new Error('styles must be an array')
  }

  return styles.map(function(style) {
    var i,
      len,
      s = []

    if (style.featureType != null) {
      s.push('feature:' + style.featureType)
    }

    if (style.elementType != null) {
      s.push('element:' + style.elementType)
    }

    if (style.stylers != null) {
      for (i = 0, len = style.stylers.length; i < len; i++) {
        for (k in style.stylers[i]) {
          s.push(k + ':' + style.stylers[i][k])
        }
      }
    }

    return s.join('|')
  })

}
