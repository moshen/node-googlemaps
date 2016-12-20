var should = require('should');

var GoogleMapsAPI = require('../../lib/index');

var direstionsMockResult = require('../mocks/placeText');

var gmAPI;

describe('placeText', function() {

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
      var data = JSON.stringify(direstionsMockResult);
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
            (function() { gmAPI.directions( validParams, invalid ) }).should.throw();
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
      customGmAPI.placeText( params, function(err, results) {
        should.not.exist(results);
        should.exist(err);
        err.message.should.equal('The placeTextSearch API requires a key. You can add it to the config.');
        done();
      });
    });

    var invalidParams = [null, undefined, false, 0, NaN, '', [], new Date, function() {}];

    var calls = invalidParams.map(
      function(invalid) {
        return function() {
          it('should not accept ' + invalid + ' as params', function(done){
              gmAPI.placeText( invalid, function(err, results) {
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

    it('should not accept a call without params.query', function(done){
      var params = {
        radius: 10000
      };

      gmAPI.placeText( params, function(err, results) {
        should.not.exist(results);
        should.exist(err);
        err.message.should.equal('params.query is required');
        done();
      });
    });

  });

  describe('success', function() {

    it('should return formatted address', function(done){

      var params = {
        query: '123+main+street'
      };

      gmAPI.placeText(params, function(err, result){
        should.not.exist(err);
        should.exist(result);
        result.status.should.equal('OK');
        result.results[0].should.have.property('formatted_address');
        done();
      });

    });

    it('should return geometry', function(done){

      var params = {
        query: '123+main+street'
      };

      gmAPI.placeText(params, function(err, result){
        should.not.exist(err);
        should.exist(result);
        result.status.should.equal('OK');
        result.results[0].should.have.property('geometry');
        done();
      });

    });

    it('should return lat/lng', function(done){

      var params = {
        query: '123+main+street'
      };

      gmAPI.placeText(params, function(err, result){
        should.not.exist(err);
        should.exist(result);
        result.status.should.equal('OK');
        result.results[0].geometry.location.should.have.property('lat');
        result.results[0].geometry.location.should.have.property('lng');
        done();
      });
      
    });

  });

});