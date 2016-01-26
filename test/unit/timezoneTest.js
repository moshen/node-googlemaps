var should = require('should');

var GoogleMapsAPI = require('../../lib/index');

var timezoneMockResult = require('../mocks/timezone');

var gmAPI;


describe('timezone', function() {

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
      var data = JSON.stringify(timezoneMockResult);
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
            (function() { gmAPI.timezone( validParams, invalid ) }).should.throw();
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
      customGmAPI.timezone( params, function(err, results) {
        should.not.exist(results);
        should.exist(err);
        err.message.should.equal('The timezone API requires a key. You can add it to the config.');
        done();
      });

    });


    var invalidParams = [null, undefined, false, 0, NaN, '', [], new Date, function() {}];

    var calls = invalidParams.map(
      function(invalid) {
        return function() {
          it('should not accept ' + invalid + ' as params', function(done){
              gmAPI.timezone( invalid, function(err, results) {
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

    it('should not accept a call without params.location', function(done){
      var params = {

      };

      gmAPI.timezone( params, function(err, results) {
        should.not.exist(results);
        should.exist(err);
        err.message.should.equal('params.location is required');
        done();
      });
    });

    it('should not accept a call without params.timestamp', function(done){
      var params = {
        location: '-33.86,151.20'
      };

      gmAPI.timezone( params, function(err, results) {
        should.not.exist(results);
        should.exist(err);
        err.message.should.equal('params.timestamp is required');
        done();
      });
    });


  });

  describe('success', function() {

    it('should return timezone', function(done){

      var params = {
        location: '-33.86,151.20',
        timestamp: 1234567890
      };

      gmAPI.timezone(params, function(err, result){
        should.not.exist(err);
        should.exist(result);
        result.status.should.equal('OK');
        result.should.have.properties(['dstOffset', 'rawOffset', 'timeZoneId', 'timeZoneName']);
        done();
      });

    });

  });

});