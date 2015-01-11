var vows = require('vows'),
  assert = require('assert'),
  GoogleMapsAPI = require('../../lib/index'),
  config = require('../simpleConfig');


vows.describe('reverseGeocode').addBatch({
  'Simple reverse geocode (41.850033 , -87.6500523)': {
    topic: function(){
      var gm = new GoogleMapsAPI(config);
      gm.reverseGeocode({
        latlng: '41.850033,-87.6500523',
        language: 'en',
        result_type: 'postal_code',
        location_type: 'APPROXIMATE'
      }, this.callback)
    },
    'returns as a valid request': function(err, result){
      assert.equal(result.status , 'OK');
    },
    // For some reason the location of "Chicago" is constantly changing according to Google.
    // I thought that it would be a constant I could rely on for these tests.
    // If I have to change it one more time, I'm going to just comment them all out.

    // the problem is that you should never rely on external dependencies like the network for your tests/
    // this is why I am going to add proper unit tests once we can inject request into the library

    'returns expected name (Pilsen)': function(err, result){
      var locality = result.results[0].address_components.filter(function(el) {
        return el.types.indexOf('locality') !== -1;
      })[0];
      assert.equal(locality.long_name , 'Chicago')
    }
  }
}).export(module);
