var should = require('should');

var GoogleMapsAPI = require('../../lib/index');

var geocodeMoskResult = require('../mocks/geocode');

var gmAPI;


describe('geocode', function() {

  before(function() {
    var config = {
      key: 'xxxxxxx',
      google_client_id:   'test-client-id',
      stagger_time:       1000,
      encode_polylines:   false,
      secure:             true,
      proxy:              'http://127.0.0.1:9999',
      google_private_key: 'test-private-key'
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
            (function() { gmAPI.geocode( validParams, invalid ) }).should.throw();
          });
        } 
      }
    );

    calls.forEach( function(checkCall){
      checkCall();
    });
    
    it('should not accept calls without key', function(done){
      var config = {
        stagger_time:       1000,
        encode_polylines:   false,
        secure:             true,
        proxy:              'http://127.0.0.1:9999'
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
      customGmAPI.geocode( params, function(err, results) {
        should.not.exist(results);
        should.exist(err);
        err.message.should.equal('The geocode API requires a key. You can add it to the config.');
        done();
      });

    });


    var invalidParams = [null, undefined, false, 0, NaN, '', [], new Date, function() {}];

    var calls = invalidParams.map(
      function(invalid) {
        return function() {
          it('should not accept ' + invalid + ' as params', function(done){
              gmAPI.geocode( invalid, function(err, results) {
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

    it('should not accept a call without params.address', function(done){
      var params = {
        "components": "components=country:GB",
        "bounds":     "55,-1|54,1",
        "language":   "en",
        "region":     "uk"
      };

      gmAPI.geocode( params, function(err, results) {
        should.not.exist(results);
        should.exist(err);
        err.message.should.equal('params.address is required');
        done();
      });
    });

  });

  describe('success', function() {

    it('should return places', function(done){

      var params = {
        "address":    "121, Curtain Road, EC2A 3AD, London UK",
        "components": "components=country:GB",
        "bounds":     "55,-1|54,1",
        "language":   "en",
        "region":     "uk"
      };

      gmAPI.geocode(params, function(err, result){
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
