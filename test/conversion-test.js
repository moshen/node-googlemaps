var vows = require('vows'),
  assert = require('assert'),
  gm = require('../lib/googlemaps');

vows.describe('geocode').addBatch({
  'Geocode Conversion (Kansas City)': {
    topic: function(){
      gm.geocode('64111', this.callback, 'false');
    },
    'can convert zip to state': function(err, result){
      gm.utils.convert(result, 'state', function(data){
        assert.equal(data , 'Missouri');
      })
    },
    'can convert zip to country': function(err, result){
      gm.utils.convert(result, 'country', function(data){
        assert.equal(data , 'United States');
      })
    },
    'can convert zip to geo': function(err, result){
      gm.utils.convert(result, 'geo', function(data){
        assert.equal(data.lat , '39.0587452');
        assert.equal(data.lng , '-94.5985613');
      })
    }
  }
}).export(module);


vows.describe('geocode').addBatch({
  'ReverseGeocode Conversion (Kansas City)': {
    topic: function(){
      gm.reverseGeocode('39.0587452,-94.5985613', this.callback, 'false');
    },
    'can convert geo to state': function(err, result){
      gm.utils.convert(result, 'state', function(data){
        assert.equal(data , 'Missouri');
      })
    }
  }
}).export(module);