var vows = require('vows'),
  assert = require('assert'),
  gm = require('../lib/googlemaps');

vows.describe('geocode').addBatch({
  'Data Conversion (Kansas City)': {
    topic: function(){
      gm.geocode('64111', this.callback, 'false');
    },
    'can convert to state': function(err, result){
      gm.convert(result, 'state', function(data){
        assert.equal(data , 'Missouri');
      })
    },
    'can convert to country': function(err, result){
      gm.convert(result, 'country', function(data){
        assert.equal(data , 'United States');
      })
    }
  }
}).export(module);