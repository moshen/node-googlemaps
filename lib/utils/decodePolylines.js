/**
 * Decodes an encoded polyline string into an array of [lat, lng] pairs.
 *
 * Algorithm from Google's polyline encoding documentation:
 * https://developers.google.com/maps/documentation/utilities/polylinealgorithm
 *
 * input = '_p~iF~ps|U_ulLnnqC_mqNvxq`@'
 * output = [[38.5, -120.2], [40.7, -120.95], [43.252, -126.453]]
 */
module.exports = function(encoded) {

  if (typeof encoded !== 'string') {
    throw new Error('Encoded polyline must be a string');
  }

  var index = 0;
  var lat = 0;
  var lng = 0;
  var coordinates = [];

  while (index < encoded.length) {

    var result = 1;
    var shift = 0;
    var b;

    do {
      b = encoded.charCodeAt(index++) - 63 - 1;
      result += b << shift;
      shift += 5;
    } while (b >= 0x1f);

    lat += (result & 1) ? ~(result >> 1) : (result >> 1);

    result = 1;
    shift = 0;

    do {
      b = encoded.charCodeAt(index++) - 63 - 1;
      result += b << shift;
      shift += 5;
    } while (b >= 0x1f);

    lng += (result & 1) ? ~(result >> 1) : (result >> 1);

    coordinates.push([lat / 1e5, lng / 1e5]);
  }

  return coordinates;

};