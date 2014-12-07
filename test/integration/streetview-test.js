var vows = require('vows'),
  assert = require('assert'),
  GoogleMapsAPI = require('../../lib/index');


function checkJPEGHeader(err, data){
  // Look for the JPEG header only
  var buf = new Buffer(data, 'binary');
  assert.equal(buf.toString('hex').substr(0,4), 'ffd8');
}

vows.describe('streetview').addBatch({
  'Street View': {

    'Simple Parameters URL': {
      topic: function(options){
        var gm = new GoogleMapsAPI({'encode-polylines': true});
        return gm.streetView('600x300', '56.960654,-2.201815', false);
      },
      'returns the expected street view URL': function(result){
        assert.equal(result , "http://maps.googleapis.com/maps/api/streetview?size=600x300&location=56.960654%2C-2.201815&sensor=false");
      }
    },

    'Simple Parameters Image data (jpeg)': {
      topic: function(options){
        var gm = new GoogleMapsAPI({'encode-polylines': true});
        gm.streetView('600x300', '56.960654,-2.201815', this.callback);
      },
      'returns the expected Street View Image data': checkJPEGHeader
    },

    'With Optonal Parameters URL': {
      topic: function(options){
        var gm = new GoogleMapsAPI({'encode-polylines': true});
        return gm.streetView('600x300', '56.960654,-2.201815', false, false, "250", "90", "-10");
      },
      'returns the expected street view URL': function(result){
        assert.equal(result, "http://maps.googleapis.com/maps/api/streetview?size=600x300&location=56.960654%2C-2.201815&heading=250&fov=90&pitch=-10&sensor=false");
      }
    },

    'With Optonal Parameters Image data (jpeg)': {
      topic: function(options){
        var gm = new GoogleMapsAPI({'encode-polylines': true});
        gm.streetView('600x300', '56.960654,-2.201815', this.callback, false, "250", "90", "-10");
      },
      'returns the expected Street View Image data': checkJPEGHeader
    },

    'With invalid Parameters URL': {
      topic: function(options){
        var gm = new GoogleMapsAPI({'encode-polylines': true});
        return gm.streetView('600x300', '56.960654,-2.201815', false, false, "9999", "9999", "9999");
      },
      'returns the expected street view URL': function(result){
        assert.equal(result , "http://maps.googleapis.com/maps/api/streetview?size=600x300&location=56.960654%2C-2.201815&sensor=false");
      }
    },

    'With invalid Parameters Image data (jpeg)': {
      topic: function(options){
        var gm = new GoogleMapsAPI({'encode-polylines': true});
        gm.streetView('600x300', '56.960654,-2.201815', this.callback, false, "9999", "9999", "9999");
      },
      'returns the expected Street View Image data': checkJPEGHeader
    },

    'Business Parameters URL': {
      topic: function(options){
        var gm = new GoogleMapsAPI({'encode-polylines': true});
        var gm = new GoogleMapsAPI({
          'google-client-id': 'clientID',
          'google-private-key': 'vNIXE0xscrmjlyV-12Nj_BvUPaw='
        })
        // Using the signature example clientID and private key for testing,
        // http://code.google.com/apis/maps/documentation/business/webservices.html#signature_examples
        return gm.streetView('600x300', '56.960654,-2.201815', false);
      },
      'returns the expected street view URL': function(result){
        assert.equal(result , "http://maps.googleapis.com/maps/api/streetview?size=600x300&location=56.960654%2C-2.201815&sensor=false&client=clientID&signature=W-iU4lapSK7yN2qDCDXwW-GKoIo=");
      }
    }
  }
}).export(module);
