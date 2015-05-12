var vows = require('vows'),
  assert = require('assert'),
  env = require('node-env-file'),
  gm = require('../lib/googlemaps');

// bring in env variables
try{
  env('../.env');
}catch(err){
  console.log('Error: '+err);
}

vows.describe('placeDetails').addBatch({
  'Simple Places Details request(ChIJrTLr-GyuEmsRBfy61i59si0)': {
    topic: function(){
      gm.placeDetails('ChIJrTLr-GyuEmsRBfy61i59si0', process.env.APIKEY, this.callback, null, null);
    },
    'returns as a valid request': function(err, result){
      assert.ifError(err);
      assert.equal(result.status, 'OK');
    },
    'returns expected name for given PlaceId': function(err, result){
      assert.equal(result.result.name , 'Australian Cruise Group');
    }
  }
}).export(module);