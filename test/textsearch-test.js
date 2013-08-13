var vows = require('vows'),
  assert = require('assert'),
  gm = require('../lib/googlemaps');

// Your Google Places API key
var key = "";

vows.describe('directions').addBatch({
  'Simple Text Search (From: Madison, Wi To: Chicago, Il)': {
    topic: function(){
      gm.placesTextSearch("Museum of Modern Art, New York", undefined, key, this.callback);
    },
    'returns as a valid request': function(err, result){
      console.log(JSON.stringify(result, null, 2));
      assert.ifError(err);
      assert.equal(result.status, 'OK');
    },
    'returns expected address for Museum of Modern Art, New York': function(err, result){
      assert.equal(result.results[0].formatted_address , "11 W 53rd Street, New York, NY, United States");
    }
  }
}).export(module);

/* placesTextSearch result
{
    "debug_info": [],
    "html_attributions": [],
    "results": [
    {
        "formatted_address": "11 W 53rd Street, New York, NY, United States",
        "geometry": {
            "location": {
                "lat": 40.761426,
                "lng": -73.977718
            }
        },
        "icon": "http://maps.gstatic.com/mapfiles/place_api/icons/museum-71.png",
        "id": "05fd8501e2532c0ea3033bd3f3a282ffff502863",
        "name": "The Museum of Modern Art",
        "opening_hours": {
            "open_now": false
        },
        "photos": [
            {
                "height": 2448,
                "html_attributions": [
                    "<a href=\"https://plus.google.com/106628474451040988513\">Anthony Alcaro</a>"
                ],
                "photo_reference": "CoQBdQAAAIuxyXKK4KmVZlGaGioya3jlefjwR1VaukTaDiTzac5NF7dWKZFCthQkg72Jxd4q1ABLql1h0OF-iLjqW9ASDBZpLPgbGMqIaphpAmOU7uzyS1ep3FcaUhbkspap7ezvnEjKuX5s0q55OI-474NOUNS11CqRGR53P9o_uDJBRXNvEhDvhhU18pp5146t1PCo7JIKGhTE2VYzpWFOvvBF7vfo32ImwFtOyg",
                "width": 3264
            }
        ],
        "rating": 4.5,
        "reference": "CoQBdwAAAAfBYsEwKhA1EjqG-msmKKQ3zPYydhWg226CqcD66AFAvn52mfwBxdyfDPSLbTq2Q8P_mrM25czT8zqG5VxEZrVNoeU19-BYLsFCLo00naMg3f8doRz5FTYaUkTBv45YdkqsSREOWuOO6EHzlIIDyL_f__Gs02zP-G9ayBLduIOnEhDYDB0RNYoRcsOjiH9Ot7rvGhQyxZXQZRiK67wQr1NiNxBMFpqB9A",
        "types": [
            "museum",
            "establishment"
        ]
    }
],
    "status": "OK"
}
*/

// vim: set expandtab sw=2: