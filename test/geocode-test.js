var vows = require('vows'),
  assert = require('assert'),
  gm = require('../lib/googlemaps');

vows.describe('geocode').addBatch({
  'Simple geocode (Chicago)': {
    topic: function(){
      gm.geocode('Chicago , Il , USA', this.callback, 'false');
    },
    'returns as a valid request': function(err, result){
      assert.equal(result.status , 'OK');
    },
    'returns the expected lat/lng for Chicago': function(err, result){
      assert.equal(result.results[0].geometry.location.lat , 41.8781136);
      assert.equal(result.results[0].geometry.location.lng , -87.6297982);
    },

    'Business Parameters URL': {
      topic: function(options){
        // Using the signature example clientID and private key for testing,
        // http://code.google.com/apis/maps/documentation/business/webservices.html#signature_examples
        gm.config('google-client-id','clientID')
        gm.config('google-private-key', 'vNIXE0xscrmjlyV-12Nj_BvUPaw=');
        return gm.geocode('Chicago , Il , USA', false, false);
      },
      'returns the expected street view URL': function(result){
        assert.equal(result , "http://maps.googleapis.com/maps/api/geocode/json?address=Chicago%20%2C%20Il%20%2C%20USA&sensor=false&client=clientID&signature=m9bKYBws8BKuAO2mRf0sZWKlyPQ=");
        gm.config('google-client-id', null);
        gm.config('google-private-key',  null);
      }
    }

  }
}).export(module);


/*  Geocode query results
{
   "status":"OK",
   "results":[
      {
         "types":[
            "locality",
            "political"
         ],
         "formatted_address":"Chicago, IL, USA",
         "address_components":[
            {
               "long_name":"Chicago",
               "short_name":"Chicago",
               "types":[
                  "locality",
                  "political"
               ]
            },
            {
               "long_name":"Cook",
               "short_name":"Cook",
               "types":[
                  "administrative_area_level_2",
                  "political"
               ]
            },
            {
               "long_name":"Illinois",
               "short_name":"IL",
               "types":[
                  "administrative_area_level_1",
                  "political"
               ]
            },
            {
               "long_name":"United States",
               "short_name":"US",
               "types":[
                  "country",
                  "political"
               ]
            }
         ],
         "geometry":{
            "location":{
               "lat":41.850033,
               "lng":-87.6500523
            },
            "location_type":"APPROXIMATE",
            "viewport":{
               "southwest":{
                  "lat":41.7169105,
                  "lng":-87.9061711
               },
               "northeast":{
                  "lat":41.982879,
                  "lng":-87.3939335
               }
            },
            "bounds":{
               "southwest":{
                  "lat":41.644335,
                  "lng":-87.9402669
               },
               "northeast":{
                  "lat":42.023131,
                  "lng":-87.5236609
               }
            }
         }
      }
   ]
}
*/

// vim: set expandtab sw=2:
