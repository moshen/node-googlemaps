var vows = require('vows'),
  assert = require('assert'),
  GoogleMapsAPI = require('../../lib/index')
  config = require('../simpleConfig');


vows.describe('elevationFromLocations').addBatch({
  'Simple elevationFromLocations request (41.850033,-87.6500523)': {
    topic: function(){
      var gm = new GoogleMapsAPI(config);
      gm.elevationFromLocations({
        locations: '41.850033,-87.6500523'
      }, this.callback);
    },
    'returns as a valid request': function(err, result){
      assert.equal(result.status , 'OK');
    },
    'returns the expected elevation for Chicago': function(err, result){
      assert.notEqual(result.results, false);
      assert.notEqual(result.results.length, 0);
      assert.equal(Math.round(result.results[0].elevation) , 179);
    }
  }
}).export(module);
