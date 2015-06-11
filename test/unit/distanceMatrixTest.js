var should = require('should');

var GoogleMapsAPI = require('../../lib/index');

var distanceMatrixMockResult = require('../mocks/distanceMatrix');

var gmAPI;


describe('distanceMatrix', function() {

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
      var data = JSON.stringify(distanceMatrixMockResult);
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
            (function() { gmAPI.distance( validParams, invalid ) }).should.throw();
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
      customGmAPI.distance( params, function(err, results) {
        should.not.exist(results);
        should.exist(err);
        err.message.should.equal('The distance API requires a key. You can add it to the config.');
        done();
      });

    });


    var invalidParams = [null, undefined, false, 0, NaN, '', [], new Date, function() {}];

    var calls = invalidParams.map(
      function(invalid) {
        return function() {
          it('should not accept ' + invalid + ' as params', function(done){
              gmAPI.distance( invalid, function(err, results) {
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

    it('should not accept a call without params.origins', function(done){
      var params = {
        destinations: 'New York, NY, US'
      };

      gmAPI.distance( params, function(err, results) {
        should.not.exist(results);
        should.exist(err);
        err.message.should.equal('params.origins is required');
        done();
      });
    });

    it('should not accept a call without params.destinations', function(done){
      var params = {
        origins: 'New York, NY, US'
      };

      gmAPI.distance( params, function(err, results) {
        should.not.exist(results);
        should.exist(err);
        err.message.should.equal('params.destinations is required');
        done();
      });
    });

    it('should not accept a call with params.mode: transit', function(done){
      var params = {
        origins: 'New York, NY, US|Boston, MA, US',
        destinations: 'Los Angeles, CA, US|San Francisco, CA, US',
        mode: 'transit'
      };

      gmAPI.distance( params, function(err, results) {
        should.not.exist(results);
        should.exist(err);
        err.message.should.equal('Invalid transport mode: transit. Valid params.mode are [driving|walking|bicycling]');
        done();
      });
    });

    it('should not accept a call with params.avoid: desert', function(done){
      var params = {
        origins: 'New York, NY, US|Boston, MA, US',
        destinations: 'Los Angeles, CA, US|San Francisco, CA, US',
        avoid: 'desert'
      };

      gmAPI.distance( params, function(err, results) {
        should.not.exist(results);
        should.exist(err);
        err.message.should.equal('Invalid params.avoid: desert. Valid params.avoid are [tolls|highways|ferries]');
        done();
      });
    });

    it('should not accept a call with params.units: natural', function(done){
      var params = {
        origins: 'New York, NY, US|Boston, MA, US',
        destinations: 'Los Angeles, CA, US|San Francisco, CA, US',
        units: 'natural'
      };

      gmAPI.distance( params, function(err, results) {
        should.not.exist(results);
        should.exist(err);
        err.message.should.equal('Invalid params.units: natural. Valid params.units are [metric|imperial]');
        done();
      });
    });

  });

  describe('success', function() {

    it('should return the distance matrix', function(done){

      var params = {
        origins: 'New York, NY, US|Boston, MA, US',
        destinations: 'Los Angeles, CA, US|San Francisco, CA, US'
      };

      gmAPI.distance(params, function(err, result){
        should.not.exist(err);
        should.exist(result);
        result.status.should.equal('OK');
        result.should.have.properties([
          'origin_addresses',
          'destination_addresses',
          'rows'
        ]);
        done();
      });

    });

    it('should return the distance matrix with departure_time', function(done){

      var params = {
        origins: 'New York, NY, US|Boston, MA, US',
        destinations: 'Los Angeles, CA, US|San Francisco, CA, US',
        departure_time: new Date()
      };

      gmAPI.distance(params, function(err, result){
        should.not.exist(err);
        should.exist(result);
        result.status.should.equal('OK');
        result.should.have.properties([
          'origin_addresses',
          'destination_addresses',
          'rows'
        ]);
        done();
      });

    });

    it('should return the distance matrix with mode', function(done){

      var params = {
        origins: 'New York, NY, US|Boston, MA, US',
        destinations: 'Los Angeles, CA, US|San Francisco, CA, US',
        mode: 'walking'
      };

      gmAPI.distance(params, function(err, result){
        should.not.exist(err);
        should.exist(result);
        result.status.should.equal('OK');
        result.should.have.properties([
          'origin_addresses',
          'destination_addresses',
          'rows'
        ]);
        done();
      });

    });

    it('should return the distance matrix with avoid', function(done){

      var params = {
        origins: 'New York, NY, US|Boston, MA, US',
        destinations: 'Los Angeles, CA, US|San Francisco, CA, US',
        avoid: 'tolls'
      };

      gmAPI.distance(params, function(err, result){
        should.not.exist(err);
        should.exist(result);
        result.status.should.equal('OK');
        result.should.have.properties([
          'origin_addresses',
          'destination_addresses',
          'rows'
        ]);
        done();
      });

    });

    it('should return the distance matrix with units', function(done){

      var params = {
        origins: 'New York, NY, US|Boston, MA, US',
        destinations: 'Los Angeles, CA, US|San Francisco, CA, US',
        units: 'metric'
      };

      gmAPI.distance(params, function(err, result){
        should.not.exist(err);
        should.exist(result);
        result.status.should.equal('OK');
        result.should.have.properties([
          'origin_addresses',
          'destination_addresses',
          'rows'
        ]);
        done();
      });

    });

  });

});
