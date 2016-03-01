var vows = require('vows'),
  assert = require('assert'),
  GoogleMapsAPI = require('../../lib/index')
  config = require('../simpleConfig');


vows.describe('timezone').addBatch({
  'Simple timezone request': {
    topic: function(){
      var gm = new GoogleMapsAPI(config);
      gm.timezone({
        location: '-33.86,151.20',
        timestamp: 1234567890
      }, this.callback);
    },
    'returns as a valid request': function(err, result){
      assert.equal(result.status , 'OK');
    },
    'returns the expected timezone Id for location': function(err, result){
      assert.equal(result.timeZoneId, 'Australia/Sydney');
    }
  }
}).export(module);
