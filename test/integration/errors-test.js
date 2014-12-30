var vows = require('vows'),
  assert = require('assert'),
  GoogleMapsAPI = require('../../lib/index')
  config = require('../simpleConfig');


vows.describe('errors').addBatch({
  'No connection': {
    topic: function(options) {
      devNullConfig = {
        key: config.key,
        proxy: 'https://127.0.0.1:49151'
      }
      var gm = new GoogleMapsAPI(devNullConfig);
      gm.geocode({ address: 'Hamburg' }, this.callback);
    },
    'returns an error': function(err, result) {
      assert.isUndefined(result);
      assert.isObject(err);
    },
    'returns the error code ECONNREFUSED': function(err, result) {
      assert.equal(err.code, 'ECONNRESET');
    }
  },

  'Wrong Credentials': {
    topic: function(options) {
      var gm = new GoogleMapsAPI({
        'google-client-id': 'clientID',
        'google-private-key': 'WRONG-KEY'
      });
      gm.geocode({ address: 'Hamburg' }, this.callback);
    },
    'returns the expected street view URL': function(err, data) {
      assert.isUndefined(data);
      assert.isObject(err);
    },
    'returns status 403 - Unable to authenticate': function(err, data) {
      assert.equal(err.code, 403);
      assert.include(err.message, 'Unable to authenticate');
    }
  }
}).export(module);
