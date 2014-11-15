var should = require('should');

var GoogleMapsAPI = require('../../lib/googlemaps');

var placeDetailsMoskResult = require('../mocks/placeDetails');

var gmAPI;


describe('GoogleMapsAPI placeDetails', function() {

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
      var data = JSON.stringify(placeDetailsMoskResult);
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
            (function() { gmAPI.placeDetails( validParams, invalid ) }).should.throw();
          });
        } 
      }
    );

    calls.forEach( function(checkCall){
      checkCall();
    });

    it('should not accept calls without key', function(done){
      var config = {
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
        var data = JSON.stringify([]);
        return callback(null, res, data);
      };

      var customGmAPI = new GoogleMapsAPI( config, mockRequest );

      var params = {};
      customGmAPI.placeDetails( params, function(err, results) {
        should.not.exist(results);
        should.exist(err);
        err.message.should.equal('The placeDetails API requires a key. You can add it to the config.');
        done();
      });

    });


    var invalidParams = [null, undefined, false, 0, NaN, '', [], new Date, function() {}];

    var calls = invalidParams.map(
      function(invalid) {
        return function() {
          it('should not accept ' + invalid + ' as params', function(done){
              gmAPI.placeDetails( invalid, function(err, results) {
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

    it('should not accept a call without params.placeid', function(done){
      var params = {};

      gmAPI.placeDetails( params, function(err, results) {
        should.not.exist(results);
        should.exist(err);
        err.message.should.equal('params.placeid is required');
        done();
      });      
    });

  });

  describe('success', function() {

    it('should return the place details', function(done){

      var params = {
        placeid: 'ChIJN1t_tDeuEmsRUsoyG83frY4'
      };

      gmAPI.placeDetails(params, function(err, result){
        should.not.exist(err);
        should.exist(result);
        result.status.should.equal('OK');
        result.result.should.have.properties([
          'address_components',
          'events',
          'reviews',
          'types',
          'url',
          'formatted_address',
          'formatted_phone_number',
          'geometry',
          'icon',
          'id',
          'international_phone_number',
          'name',
          'place_id',
          'scope',
          'alt_ids',
          'rating',
          'reference',
          'vicinity',
          'website'
        ]);
        done();
      });      

    });

  });

});
