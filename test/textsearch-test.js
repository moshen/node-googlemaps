var gm = require("../lib/googlemaps");

// Your Google Places API key
var key = "";

gm.placesTextSearch("Museum of Modern Art, New York", undefined, key, function(err, result) {
  var address;
  if (result && result.results && result.results.length > 0) {
    address = result.results[0].formatted_address;
  } else if (result && result.status) {
    address = result.status; // if something went wrong, return result's status
  }
  console.log(address);
});
