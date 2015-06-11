var should = require('should');

var GoogleMapsAPI = require('../../lib/index');

var direstionsMockResult = require('../mocks/direction');

var gmAPI;


describe('direstions', function() {

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
      customGmAPI.directions( params, function(err, results) {
        should.not.exist(results);
        should.exist(err);
        err.message.should.equal('The directions API requires a key. You can add it to the config.');
        done();
      });

    });

    var invalidParams = [null, undefined, false, 0, NaN, '', [], new Date, function() {}];

    var calls = invalidParams.map(
      function(invalid) {
        return function() {
          it('should not accept ' + invalid + ' as params', function(done){
              gmAPI.directions( invalid, function(err, results) {
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

    it('should not accept a call without params.origin', function(done){
      var params = {
        destination: 'New York, NY, US'
      };

      gmAPI.directions( params, function(err, results) {
        should.not.exist(results);
        should.exist(err);
        err.message.should.equal('params.origin is required');
        done();
      });
    });

    it('should not accept a call without params.destination', function(done){
      var params = {
        origin: 'New York, NY, US'
      };

      gmAPI.directions( params, function(err, results) {
        should.not.exist(results);
        should.exist(err);
        err.message.should.equal('params.destination is required');
        done();
      });
    });

    it('should not accept a call with mode transit but without params.arrival_time', function(done){
      var params = {
        origin: 'New York, NY, US',
        destination: 'Los Angeles, CA, US',
        mode: 'transit'
      };

      gmAPI.directions( params, function(err, results) {
        should.not.exist(results);
        should.exist(err);
        err.message.should.equal('When specifying params.mode = transit either params.departure_time or params.arrival_time must be provided');
        done();
      });
    });

    it('should not accept a call with mode transit and invalid params.departure_time', function(done){
      var params = {
        origin: 'New York, NY, US',
        destination: 'Los Angeles, CA, US',
        mode: 'transit',
        departure_time: Date.now()
      };

      gmAPI.directions( params, function(err, results) {
        should.not.exist(results);
        should.exist(err);
        err.message.should.equal('When specifying params.mode = transit either params.departure_time or params.arrival_time must be provided');
        done();
      });
    });

    it('should not accept a call with mode transit and params.waypoints', function(done){
      var params = {
        origin: 'New York, NY, US',
        destination: 'Los Angeles, CA, US',
        mode: 'transit',
        departure_time: new Date(),
        waypoints: 'via:Boston,MA,US'
      };

      gmAPI.directions( params, function(err, results) {
        should.not.exist(results);
        should.exist(err);
        err.message.should.equal('It is not possible to specify waypoints when params.mode = transit');
        done();
      });
    });

    it('should not accept a call with params.departure_time and params.mode walking', function(done){
      var params = {
        origin: 'New York, NY, US',
        destination: 'Los Angeles, CA, US',
        mode: 'walking',
        departure_time: new Date()
      };

      gmAPI.directions( params, function(err, results) {
        should.not.exist(results);
        should.exist(err);
        err.message.should.equal('params.departure_time or params.arrival_time can only be specified when params.mode = [driving|transit]');
        done();
      });
    });

    it('should not accept a call with params.avoid: desert', function(done){
      var params = {
        origin: 'New York, NY, US',
        destination: 'Los Angeles, CA, US',
        avoid: 'desert'
      };

      gmAPI.directions( params, function(err, results) {
        should.not.exist(results);
        should.exist(err);
        err.message.should.equal('Invalid params.avoid: desert. Valid params.avoid are [tolls|highways|ferries]');
        done();
      });
    });

    it('should not accept a call with params.units: natural', function(done){
      var params = {
        origin: 'New York, NY, US',
        destination: 'Los Angeles, CA, US',
        units: 'natural'
      };

      gmAPI.directions( params, function(err, results) {
        should.not.exist(results);
        should.exist(err);
        err.message.should.equal('Invalid params.units: natural. Valid params.units are [metric|imperial]');
        done();
      });
    });

  });

  describe('success', function() {

    it('should return directions', function(done){

      var params = {
        origin: 'New York, NY, US',
        destination: 'Los Angeles, CA, US'
      };

      gmAPI.directions(params, function(err, result){
        should.not.exist(err);
        should.exist(result);
        result.status.should.equal('OK');
        result.should.have.property('routes');
        should.exist(result.routes[0]);
        result.routes[0].should.have.properties(['summary', 'legs']);
        done();
      });

    });

    it('should return directions with departure_time', function(done){

      var params = {
        origin: 'New York, NY, US',
        destination: 'Los Angeles, CA, US',
        mode: 'transit',
        departure_time: new Date()
      };

      gmAPI.directions(params, function(err, result){
        should.not.exist(err);
        should.exist(result);
        result.status.should.equal('OK');
        result.should.have.property('routes');
        should.exist(result.routes[0]);
        result.routes[0].should.have.properties(['summary', 'legs']);
        done();
      });

    });

    it('should return directions with arrival_time', function(done){

      var params = {
        origin: 'New York, NY, US',
        destination: 'Los Angeles, CA, US',
        mode: 'transit',
        arrival_time: new Date()
      };

      gmAPI.directions(params, function(err, result){
        should.not.exist(err);
        should.exist(result);
        result.status.should.equal('OK');
        result.should.have.property('routes');
        should.exist(result.routes[0]);
        result.routes[0].should.have.properties(['summary', 'legs']);
        done();
      });

    });

    it('should return directions with mode', function(done){

      var params = {
        origin: 'New York, NY, US',
        destination: 'Los Angeles, CA, US',
        mode: 'walking'
      };

      gmAPI.directions(params, function(err, result){
        should.not.exist(err);
        should.exist(result);
        result.status.should.equal('OK');
        result.should.have.property('routes');
        should.exist(result.routes[0]);
        result.routes[0].should.have.properties(['summary', 'legs']);
        done();
      });

    });

    it('should return directions with avoid', function(done){

      var params = {
        origin: 'New York, NY, US',
        destination: 'Los Angeles, CA, US',
        avoid: 'tolls'
      };

      gmAPI.directions(params, function(err, result){
        should.not.exist(err);
        should.exist(result);
        result.status.should.equal('OK');
        result.should.have.property('routes');
        should.exist(result.routes[0]);
        result.routes[0].should.have.properties(['summary', 'legs']);
        done();
      });

    });

    it('should return directions with units', function(done){

      var params = {
        origin: 'New York, NY, US',
        destination: 'Los Angeles, CA, US',
        units: 'metric'
      };

      gmAPI.directions(params, function(err, result){
        should.not.exist(err);
        should.exist(result);
        result.status.should.equal('OK');
        result.should.have.property('routes');
        should.exist(result.routes[0]);
        result.routes[0].should.have.properties(['summary', 'legs']);
        done();
      });

    });

    it('should return directions with alternatives', function(done){

      var params = {
        origin: 'New York, NY, US',
        destination: 'Los Angeles, CA, US',
        alternatives: true
      };

      gmAPI.directions(params, function(err, result){
        should.not.exist(err);
        should.exist(result);
        result.status.should.equal('OK');
        result.should.have.property('routes');
        should.exist(result.routes[0]);
        result.routes[0].should.have.properties(['summary', 'legs']);
        done();
      });

    });

    it('should return directions with language', function(done){

      var params = {
        origin: 'New York, NY, US',
        destination: 'Los Angeles, CA, US',
        language: 'de'
      };

      gmAPI.directions(params, function(err, result){
        should.not.exist(err);
        should.exist(result);
        result.status.should.equal('OK');
        result.should.have.property('routes');
        should.exist(result.routes[0]);
        result.routes[0].should.have.properties(['summary', 'legs']);
        done();
      });

    });

    it('should return directions with region', function(done){

      var params = {
        origin: 'New York, NY, US',
        destination: 'Los Angeles, CA, US',
        region: 'us'
      };

      gmAPI.directions(params, function(err, result){
        should.not.exist(err);
        should.exist(result);
        result.status.should.equal('OK');
        result.should.have.property('routes');
        should.exist(result.routes[0]);
        result.routes[0].should.have.properties(['summary', 'legs']);
        done();
      });

    });

    it('should return directions with waypoints', function(done){

      var params = {
        origin: 'New York, NY, US',
        destination: 'Los Angeles, CA, US',
        waypoints: 'optimize:true|via:Boston,MA,US|San Francisco,CA,US'
      };

      gmAPI.directions(params, function(err, result){
        should.not.exist(err);
        should.exist(result);
        result.status.should.equal('OK');
        result.should.have.property('routes');
        should.exist(result.routes[0]);
        result.routes[0].should.have.properties(['summary', 'legs']);
        done();
      });

    });

  });

});
