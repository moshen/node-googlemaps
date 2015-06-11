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
      assert.equal(result.results[0].geometry.location.lat.toFixed(2), 41.88);
      assert.equal(result.results[0].geometry.location.lng.toFixed(2), -87.63);
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
    'returns the expected lat/lng for London': function(err, result){
      assert.equal(result.results[0].geometry.location.lat.toFixed(2), 51.53);
      assert.equal(result.results[0].geometry.location.lng.toFixed(2), -0.08);
    }
  }
}).export(module);

