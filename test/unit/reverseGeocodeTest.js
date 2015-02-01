var should = require('should');

var GoogleMapsAPI = require('../../lib/index');

var geocodeMoskResult = require('../mocks/reverseGeocode');

var gmAPI;


describe('reverseGeocode', function() {

  before(function() {
    var config = {
      'key': 'xxxxxxx',
      'google-client-id':   'test-client-id',
      'stagger-time':       1000,
      'encode-polylines':   false,
      'secure':             true,
      'proxy':              'http://127.0.0.1:9999',
      'google-private-key': 'test-private-key'
    };

    var mockRequest = function(options, callback) {
      var res = {
        statusCode: 200
      };
      var data = JSON.stringify(geocodeMoskResult);
      return callback(null, res, data);
    };

    gmAPI = new GoogleMapsAPI( config, mockRequest );
  });

  describe('failures', function() {

    var invalidCallback = [null, undefined, false, 0, NaN, '', {}, [], new Object, new Date];

    var calls = invalidCallback.map(
      function(invalid) {
        return function() {
          it('should not accept ' + invalid + ' as callback', function() {
            var validParams = {
              
            };
            (function() { gmAPI.reverseGeocode( validParams, invalid ) }).should.throw();
          });
        } 
      }
    );

    calls.forEach( function(checkCall){
      checkCall();
    });
    
    it('should not accept calls without key', function(done){
      var config = {
        'stagger-time':       1000,
        'encode-polylines':   false,
        'secure':             true,
        'proxy':              'http://127.0.0.1:9999'
      };

      var mockRequest = function(options, callback) {
        var res = {
          statusCode: 200
        };
        var data = JSON.stringify([]);
        return callback(null, res, data);
      };

      var customGmAPI = new GoogleMapsAPI( config, mockRequest );

      var params = {};
      customGmAPI.reverseGeocode( params, function(err, results) {
        should.not.exist(results);
        should.exist(err);
        err.message.should.equal('The reverse geocode API requires a key. You can add it to the config.');
        done();
      });

    });


    var invalidParams = [null, undefined, false, 0, NaN, '', [], new Date, function() {}];

    var calls = invalidParams.map(
      function(invalid) {
        return function() {
          it('should not accept ' + invalid + ' as params', function(done){
              gmAPI.reverseGeocode( invalid, function(err, results) {
                should.not.exist(results);
                should.exist(err);
                err.message.should.equal('params must be an object');
                done();
              });
          });
        } 
      }
    );

    calls.forEach( function(checkCall){
      checkCall();
    });


  });

  describe('success', function() {

    it('should return places', function(done){

      var params = {
        "latlng":        "51.1245,-0.0523",
        "result_type":   "postal_code",
        "language":      "en",
        "location_type": "APPROXIMATE"
      };

      gmAPI.reverseGeocode(params, function(err, result){
        should.not.exist(err);
        should.exist(result);
        result.status.should.equal('OK');
        result.results.should.be.instanceof(Array);
        should.exist(result.results[0]);
        result.results[0].should.have.properties(['types', 'formatted_address', 'address_components', 'geometry']);
        done();
      });

    });

  });

});
