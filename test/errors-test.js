var vows = require('vows'),
  assert = require('assert'),
  gm = require('../lib/googlemaps');

vows.describe('errors').addBatch({
  'No connection': {
    topic: function(options) {
      gm.config('proxy', 'http://127.0.0.1:49151');
      gm.geocode('Hamburg', this.callback);

      // reset the proxy
      gm.config('proxy', null);
    },
    'returns an error': function(err, result) {
      assert.isUndefined(result);
      assert.isObject(err);
    },
    'returns the error code ECONNREFUSED': function(err, result) {
      assert.equal(err.code, 'ECONNREFUSED');
    }
  },

  'Wrong Credentials': {
    topic: function(options) {
      gm.config('google-client-id', 'clientID');
      gm.config('google-private-key', 'WRONG-KEY');
      gm.geocode('Hamburg', this.callback);

      // reset credentials
      gm.config('google-client-id', null);
      gm.config('google-private-key', null);
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
