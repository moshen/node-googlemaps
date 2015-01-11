var vows = require('vows'),
  assert = require('assert'),
  GoogleMapsAPI = require('../../lib/index'),
  config = require('../simpleConfig');

vows.describe('geocode').addBatch({
  'Free geocode (Chicago)': {
    topic: function(){
      var gm = new GoogleMapsAPI(config);
      gm.geocode({ address: 'Chicago, Il, USA' }, this.callback);
    },
    'returns a valid request': function(err, result){
      assert.equal(result.status , 'OK');
    },
    'returns the expected lat/lng for Chicago': function(err, result){
      assert.equal(result.results[0].geometry.location.lat, 41.8781136);
      assert.equal(result.results[0].geometry.location.lng, -87.6297982);
    }
  },
  'Curtain Road (London, UK)': {
    topic: function(){
      var gm = new GoogleMapsAPI(config);
      gm.geocode({
        address:    "121, Curtain Road, EC2A 3AD, London UK",
        components: "components=country:GB",
        bounds:     "55,-1|54,1",
        language:   "en",
        region:     "uk"
      }, this.callback);
    },
    'returns a valid request': function(err, result){
      assert.equal(result.status , 'OK');
    },
    'returns the expected lat/lng for Chicago': function(err, result){
      assert.equal(result.results[0].geometry.location.lat, 51.5259924);
      assert.equal(result.results[0].geometry.location.lng, -0.08037079999999999);
    }
  }
}).export(module);

