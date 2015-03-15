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
        var gm = new GoogleMapsAPI({encode_polylines: true});
        return gm.streetView('600x300', '56.960654,-2.201815', false);
      },
      'returns the expected street view URL': function(result){
        assert.equal(result , "http://maps.googleapis.com/maps/api/streetview?size=600x300&location=56.960654%2C-2.201815");
      }
    },

    'Simple Parameters Image data (jpeg)': {
      topic: function(options){
        var gm = new GoogleMapsAPI({encode_polylines: true});
        gm.streetView('600x300', '56.960654,-2.201815', this.callback);
      },
      'returns the expected Street View Image data': checkJPEGHeader
    },

    'With Optonal Parameters URL': {
      topic: function(options){
        var gm = new GoogleMapsAPI({encode_polylines: true});
        return gm.streetView('600x300', '56.960654,-2.201815', false, false, "250", "90", "-10");
      },
      'returns the expected street view URL': function(result){
        assert.equal(result, "http://maps.googleapis.com/maps/api/streetview?size=600x300&location=56.960654%2C-2.201815&heading=250&fov=90&pitch=-10");
      }
    },

    'With Optonal Parameters Image data (jpeg)': {
      topic: function(options){
        var gm = new GoogleMapsAPI({encode_polylines: true});
        gm.streetView('600x300', '56.960654,-2.201815', this.callback, false, "250", "90", "-10");
      },
      'returns the expected Street View Image data': checkJPEGHeader
    },

    'With invalid Parameters URL': {
      topic: function(options){
        var gm = new GoogleMapsAPI({encode_polylines: true});
        return gm.streetView('600x300', '56.960654,-2.201815', false, false, "9999", "9999", "9999");
      },
      'returns the expected street view URL': function(result){
        assert.equal(result , "http://maps.googleapis.com/maps/api/streetview?size=600x300&location=56.960654%2C-2.201815");
      }
    },

    'With invalid Parameters Image data (jpeg)': {
      topic: function(options){
        var gm = new GoogleMapsAPI({encode_polylines: true});
        gm.streetView('600x300', '56.960654,-2.201815', this.callback, false, "9999", "9999", "9999");
      },
      'returns the expected Street View Image data': checkJPEGHeader
    },

    'Business Parameters URL': {
      topic: function(options){
        var gm = new GoogleMapsAPI({encode_polylines: true});
        var gm = new GoogleMapsAPI({
          google_client_id: 'clientID',
          google_private_key: 'vNIXE0xscrmjlyV-12Nj_BvUPaw='
        })
        // Using the signature example clientID and private key for testing,
        // http://code.google.com/apis/maps/documentation/business/webservices.html#signature_examples
        return gm.streetView('600x300', '56.960654,-2.201815', false);
      },
      'returns the expected street view URL': function(result){
        assert.equal(result , "http://maps.googleapis.com/maps/api/streetview?size=600x300&location=56.960654%2C-2.201815&client=clientID&signature=kM6DbJuJWosezC7rNmyaiFf2o_M=");
      }
    }
  }
}).export(module);
