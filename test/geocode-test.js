var vows = require('vows'),
  assert = require('assert'),
  GoogleMapsAPI = require('../lib/googlemaps');

vows.describe('geocode').addBatch({
  'Simple geocode (Chicago)': {
    topic: function(){
      var gm = new GoogleMapsAPI();
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
        var gm = new GoogleMapsAPI({
          'google-client-id': 'clientID',
          'google-private-key': 'vNIXE0xscrmjlyV-12Nj_BvUPaw='
        });
        // Using the signature example clientID and private key for testing,
        // http://code.google.com/apis/maps/documentation/business/webservices.html#signature_examples
        return gm.geocode('Chicago , Il , USA', false, false);
      },
      'returns the expected street view URL': function(result){
        assert.equal(result , "http://maps.googleapis.com/maps/api/geocode/json?address=Chicago%20%2C%20Il%20%2C%20USA&sensor=false&client=clientID&signature=m9bKYBws8BKuAO2mRf0sZWKlyPQ=");
      }
    }

  }
}).export(module);
