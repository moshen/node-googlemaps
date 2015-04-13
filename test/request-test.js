var vows = require('vows'),
  assert = require('assert'),
  gm = require('../lib/googlemaps');

vows.describe('request client').addBatch({
  'short timeouts': {
    topic: function() {
      // Google is pretty fast, but 2ms should never complete in time
      gm.config('timeout', 2);
      gm.geocode('Hamburg', this.callback);
      gm.config('timeout', 0);
    },
    'cause requests to time out': function(err, result) {
      assert.equal(err.code, 'ETIMEDOUT');
    }
  },
  'long timeouts': {
    topic: function() {
      gm.config('timeout', 10000);
      gm.geocode('Hamburg', this.callback);
      gm.config('timeout', 0);
    },
    'allow requests to succeed': function(err, result) {
      assert.equal(result.status, 'OK');
    }
  }
}).export(module);
