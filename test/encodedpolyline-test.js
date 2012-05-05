var vows = require('vows'),
  assert = require('assert'),
  gm = require('../lib/googlemaps');

vows.describe('createEncodedPolylneFromSingleLatLng').addBatch({
  'Single point passed to createEncodedPolyline (38.5,-120.2)': {
    topic: function(){
      var encoded = gm.createEncodedPolyline('38.5,-120.2');
      return encoded;
    },
    'returns the expected encoded polyline': function(result){
      assert.equal(result, '_p~iF~ps|U');
    }
  }
}).export(module);

vows.describe('createEncodedPolylineMupltipleLatLngs').addBatch({
  'Multiple points passed to createEncodedPolyline': {
    topic: function(){
      var encoded = gm.createEncodedPolyline('38.5,-120.2|40.7,-120.95|43.252,-126.453');
      return encoded;
    },
    'returns the expected encoded polyline': function(result){
      assert.equal(result, '_p~iF~ps|U_ulLnnqC_mqNvxq`@');
    }
  }
}).export(module);

// vim: set expandtab sw=2:
