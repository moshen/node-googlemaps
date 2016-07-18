var should = require('should');

var GoogleMapsAPI = require('../../lib/index');

var placeAutocompleteMoskResult = require('../mocks/placeAutocomplete');

var gmAPI;


describe('placeAutocomplete', function() {

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
      var data = JSON.stringify(placeAutocompleteMoskResult);
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
            (function() { gmAPI.placeAutocomplete( validParams, invalid ) }).should.throw();
          });
        } 
      }
    );

    calls.forEach( function(checkCall){
      checkCall();
    });

    it('should not accept calls without key', function(done){
      var config = {
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
        var data = JSON.stringify([]);
        return callback(null, res, data);
      };

      var customGmAPI = new GoogleMapsAPI( config, mockRequest );

      var params = {};
      customGmAPI.placeAutocomplete( params, function(err, results) {
        should.not.exist(results);
        should.exist(err);
        err.message.should.equal('The placeAutocomplete API requires a key. You can add it to the config.');
        done();
      });

    });


    var invalidParams = [null, undefined, false, 0, NaN, '', [], new Date, function() {}];

    var calls = invalidParams.map(
      function(invalid) {
        return function() {
          it('should not accept ' + invalid + ' as params', function(done){
              gmAPI.placeAutocomplete( invalid, function(err, results) {
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

    it('should not accept a call without params.input', function(done){
      var params = {};

      gmAPI.placeAutocomplete( params, function(err, results) {
        should.not.exist(results);
        should.exist(err);
        err.message.should.equal('params.input is required');
        done();
      });
    });

  });

  describe('success', function() {

    it('should return the place autocomplete', function(done){

      var params = {
        input: 'Mel',
        types: '(regions)',
        components: 'country:AU'
      };

      gmAPI.placeAutocomplete(params, function(err, result){
        should.not.exist(err);
        should.exist(result);
        result.status.should.equal('OK');
        result.predictions.should.be.instanceof(Array);
        done();
      });

    });

  });

});