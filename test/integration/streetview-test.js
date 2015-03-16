var vows = require('vows'),
  assert = require('assert'),
  GoogleMapsAPI = require('../../lib/index')
  config = require('../simpleConfig');


function checkJPEGHeader(err, data){
  // Look for the JPEG header only
  var buf = new Buffer(data, 'binary');
  assert.equal(buf.toString('hex').substr(0,4), 'ffd8');
}

vows.describe('streetview').addBatch({
  'Street View': {

    'Simple Parameters URL': {
      topic: function(options){
        var gm = new GoogleMapsAPI(config);
        var params = {
          location: '56.960654,-2.201815',
          size: '600x300'
        };
        return gm.streetView(params);
      },
      'returns the expected street view URL': function(result){
        assert.equal(result, "https://maps.googleapis.com/maps/api/streetview?location=56.960654%2C-2.201815&size=600x300&key="+config.key);
      }
    },

    'Simple Parameters Image data (jpeg)': {
      topic: function(options){
        var gm = new GoogleMapsAPI(config);
        var params = {
          location: '56.960654,-2.201815',
          size: '600x300'
        };
        gm.streetView(params, this.callback);
      },
      'returns the expected Street View Image data': checkJPEGHeader
    },

    'With Optonal Parameters URL': {
      topic: function(options){
        var gm = new GoogleMapsAPI(config);
        var params = {
          location: '56.960654,-2.201815',
          size: '600x300',
          heading: 250,
          fov: 90,
          pitch: -10
        };
        return gm.streetView(params);
      },
      'returns the expected street view URL': function(result){
        assert.equal(result, "https://maps.googleapis.com/maps/api/streetview?location=56.960654%2C-2.201815&size=600x300&heading=250&fov=90&pitch=-10&key="+config.key);
      }
    },

    'With Optonal Parameters Image data (jpeg)': {
      topic: function(options){
        var gm = new GoogleMapsAPI(config);
        var params = {
          location: '56.960654,-2.201815',
          size: '600x300',
          heading: 250,
          fov: 90,
          pitch: -10
        };
        gm.streetView(params, this.callback);
      },
      'returns the expected Street View Image data': checkJPEGHeader
    },

    'Business Parameters URL': {
      topic: function(options){
        var gm = new GoogleMapsAPI({
          secure: true,
          encode_polylines: true,
          google_client_id: 'clientID',
          google_private_key: 'vNIXE0xscrmjlyV-12Nj_BvUPaw='
        });
        var params = {
          location: '56.960654,-2.201815',
          size: '600x300',
          heading: 250,
          fov: 90,
          pitch: -10
        };
        // Using the signature example clientID and private key for testing,
        // http://code.google.com/apis/maps/documentation/business/webservices.html#signature_examples
        return gm.streetView(params);
      },
      'returns the expected street view URL': function(result){
        assert.equal(result, "https://maps.googleapis.com/maps/api/streetview?location=56.960654%2C-2.201815&size=600x300&heading=250&fov=90&pitch=-10&client=clientID&signature=hmVjM5N_kw_Oz9xDHrVcZZRepWI=");
      }
    }
  }
}).export(module);
