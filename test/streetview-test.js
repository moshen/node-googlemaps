var vows = require('vows'),
  assert = require('assert'),
  crypto = require('crypto'),
  gm = require('../lib/googlemaps');

vows.describe('streetview').addBatch({
  'Street View': {

    'Simple Parameters URL': {
      topic: function(options){
        return gm.streetView('600x300', '56.960654,-2.201815', false);
      },
      'returns the expected street view URL': function(result){
        assert.equal(result , "http://maps.googleapis.com/maps/api/streetview?size=600x300&location=56.960654%2C-2.201815&sensor=false");
      }
    },

    'Simple Parameters Image data (jpeg)': {
      topic: function(options){
        gm.streetView('600x300', '56.960654,-2.201815', this.callback);
      },
      'returns the expected static map Image data': function(err, data){
        var md5 = crypto.createHash('md5');
        md5.update(data);
        assert.equal(md5.digest('hex') , 'a355992522bc7d640ba605268e703e37');
      }
    },

    'With Optonal Parameters URL': {
      topic: function(options){
        return gm.streetView('600x300', '56.960654,-2.201815', false, false, "250", "90", "-10");
      },
      'returns the expected street view URL': function(result){
        assert.equal(result , "http://maps.googleapis.com/maps/api/streetview?size=600x300&location=56.960654%2C-2.201815&heading=250&fov=90&pitch=-10&sensor=false");
      }
    },

    'With Optonal Parameters Image data (jpeg)': {
      topic: function(options){
        gm.streetView('600x300', '56.960654,-2.201815', this.callback, false, "250", "90", "-10");
      },
      'returns the expected static map Image data': function(err, data){
        var md5 = crypto.createHash('md5');
        md5.update(data);
        assert.equal(md5.digest('hex') , 'f408a7709312394a9ed88ad33cee6145');
      }
    },

    'With invalid Parameters URL': {
      topic: function(options){
        return gm.streetView('600x300', '56.960654,-2.201815', false, false, "9999", "9999", "9999");
      },
      'returns the expected street view URL': function(result){
        assert.equal(result , "http://maps.googleapis.com/maps/api/streetview?size=600x300&location=56.960654%2C-2.201815&sensor=false");
      }
    },

    'With invalid Parameters Image data (jpeg)': {
      topic: function(options){
        gm.streetView('600x300', '56.960654,-2.201815', this.callback, false, "9999", "9999", "9999");
      },
      'returns the expected static map Image data': function(err, data){
        var md5 = crypto.createHash('md5');
        md5.update(data);
        assert.equal(md5.digest('hex') , 'a355992522bc7d640ba605268e703e37');
      }
    },

    'Business Parameters URL': {
      topic: function(options){
        // Using the signature example clientID and private key for testing,
        // http://code.google.com/apis/maps/documentation/business/webservices.html#signature_examples
        gm.config('google-client-id', 'clientID');
        gm.config('google-private-key', 'vNIXE0xscrmjlyV-12Nj_BvUPaw=');
        return gm.streetView('600x300', '56.960654,-2.201815', false);
      },
      'returns the expected street view URL': function(result){
        assert.equal(result , "http://maps.googleapis.com/maps/api/streetview?size=600x300&location=56.960654%2C-2.201815&sensor=false&client=clientID&signature=W-iU4lapSK7yN2qDCDXwW-GKoIo=");
        gm.config('google-client-id', null);
        gm.config('google-private-key', null);
      }
    }
  }
}).export(module);

// vim: set expandtab sw=2:
