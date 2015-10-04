var should = require('should'),
  GoogleMapsAPI = require('../../lib/index')
  config = require('../simpleConfig');

function checkJPEGHeader(data){
  console.log(typeof data);
  // Look for the JPEG header only
  var buf = new Buffer(data, 'binary');
  should.equal(buf.toString('hex').substr(0,4), 'ffd8');
}

describe('streetview', function() {
  var gm = new GoogleMapsAPI(config);

  describe('Street View', function() {

    describe('Simple Parameters URL', function() {
      var params = {
        location: '56.960654,-2.201815',
        size: '600x300'
      };
      var result = gm.streetView(params);

      it('should return the expected street view URL', function() {
        should.equal(result, "https://maps.googleapis.com/maps/api/streetview?location=56.960654%2C-2.201815&size=600x300&key="+config.key);
      });
    });

    describe('Simple Parameters Image data (jpeg)', function() {
      var result;

      before(function(done) {
        var params = {
          location: '56.960654,-2.201815',
          size: '600x300'
        };
        gm.streetView(params, function(err, data) {
          should.ifError(err);
          result = data;
          done();
        });
      });

      it('should return the expected Street View Image data', function() {
        checkJPEGHeader(result);
      });
    });

    describe('With Optonal Parameters URL', function() {
      var params = {
        location: '56.960654,-2.201815',
        size: '600x300',
        heading: 250,
        fov: 90,
        pitch: -10
      };
      var result = gm.streetView(params);

      it('should return the expected street view URL', function() {
        should.equal(result, "https://maps.googleapis.com/maps/api/streetview?location=56.960654%2C-2.201815&size=600x300&heading=250&fov=90&pitch=-10&key="+config.key);
      });
    });

    describe('With Optonal Parameters Image data (jpeg)', function() {
      var result;
      before(function(done) {
        var params = {
          location: '56.960654,-2.201815',
          size: '600x300',
          heading: 250,
          fov: 90,
          pitch: -10
        };
        gm.streetView(params, function(err, data) {
          should.ifError(err);
          result = data;
          done();
        });
      });

      it('should return the expected Street View Image data', function() {
        checkJPEGHeader(result);
      });
    });

    describe('Business Parameters URL', function() {
      var result;
      before(function(done) {
        var testGm = new GoogleMapsAPI({
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
        result = testGm.streetView(params);
        done();
      });

      it('should return the expected street view URL', function(){
        should.equal(result, "https://maps.googleapis.com/maps/api/streetview?location=56.960654%2C-2.201815&size=600x300&heading=250&fov=90&pitch=-10&client=clientID&signature=hmVjM5N_kw_Oz9xDHrVcZZRepWI=");
      });
    });
  });
});
