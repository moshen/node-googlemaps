var vows = require('vows'),
  assert = require('assert'),
  GoogleMapsAPI = require('../../lib/index');

vows.describe('geocode').addBatch({
  'Free geocode (Chicago)': {
    topic: function(){
      var gm = new GoogleMapsAPI();
      gm.geocode({ address: 'Chicago, Il, USA' }, this.callback);
    },
    'returns a valid request': function(err, result){
      assert.equal(result.status , 'OK');
    },
    'returns the expected lat/lng for Chicago': function(err, result){
      assert.equal(result.results[0].geometry.location.lat , 41.8781136);
      assert.equal(result.results[0].geometry.location.lng , -87.6297982);
    }
  }
}).export(module);
