/**
Transfors an array of markers into a pipe separeted string

input = [
  { 'location': '300 W Main St Lock Haven, PA' },
  {
    'location': '444 W Main St Lock Haven, PA',
    'color'   : 'red',
    'label'   : 'A',
    'shadow'  : 'false',
    'icon'    : 'http://chart.apis.google.com/chart?chst=d_map_pin_icon&chld=cafe%7C996600'
  }
]

output = '300 W Main St Lock Haven, PA',
 'color:red|label:A|icon:http://chart.apis.google.com/chart?chst=d_map_pin_icon&chld=cafe%7C996600|shadow:false|444 W Main St Lock Haven, PA'
**/
module.exports = function(markers) {

  if (!Array.isArray(markers)) {
    throw new Error('markers must be an array');
  }

  return markers.map(function(marker) {

    var i, len, m = [], keys = ['size', 'color', 'label', 'icon', 'shadow'];

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

  }).join('| ');
}
