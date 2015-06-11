var should = require('should');

var GoogleMapsAPI = require('../../lib/index');

var simpleConfig = require('../simpleConfig');

var gmAPI;


describe('streetView', function() {

  before(function() {
    var config = {
      key:              simpleConfig.key,
      encode_polylines: false,
      secure:           true
    };

    var mockRequest = function(options, callback) {
      var res = {
        statusCode: 200
      };
      var data = new Buffer("I'm a string!", "utf-8");
      return callback(null, res, data);
    };

    gmAPI = new GoogleMapsAPI( config, mockRequest );
  });

  describe('failures', function() {

    var invalidCallback = [false, 0, NaN, '', {}, [], new Object, new Date];

    var calls = invalidCallback.map(
      function(invalid) {
        return function() {
          it('should not accept ' + invalid + ' as callback', function() {
            var validParams = {
              
            };
            (function() { gmAPI.streetView( validParams, invalid ) }).should.throw();
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
        encode_polylines:   true,
        secure:             true,
        proxy:              'http://127.0.0.1:9999',
      };

      var mockRequest = function(options, callback) {
        var res = {
          statusCode: 200
        };
        var data = new Buffer("I'm a string!", "utf-8");
        return callback(null, res, data);
      };

      var customGmAPI = new GoogleMapsAPI( config, mockRequest );

      var params = {};
      customGmAPI.streetView( params, function(err, binary) {
        should.not.exist(binary);
        should.exist(err);
        err.message.should.equal('The streetView API requires a key. You can add it to the config.');
        done();
      });

    });


    var invalidParams = [null, undefined, false, 0, NaN, '', [], new Date, function() {}];

    var calls = invalidParams.map(
      function(invalid) {
        return function() {
          it('should not accept ' + invalid + ' as params', function(done){
            gmAPI.streetView( invalid, function(err, binary) {
              should.not.exist(binary);
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
        size: '400x300'
      };
      gmAPI.streetView( params, function(err, binary) {
        should.not.exist(binary);
        should.exist(err);
        err.message.should.equal('params.location or params.pano is required');
        done();
      });

      (function() {gmAPI.streetView( params )}).should.throw('params.location or params.pano is required');
    });

    var invalidSize = [undefined, null, false, 0, NaN, '', [], new Date, function() {}, 'large', '100px_200px'];

    var calls = invalidSize.map(
      function(invalid) {
        return function() {
          it('should not accept ' + invalid + ' as size', function(done){
            var params = {
              location: '444 W Main St Lock Haven PA',
              size: invalid
            };
            gmAPI.streetView( params, function(err, binary) {
              should.not.exist(binary);
              should.exist(err);
              err.message.should.equal('params.size must be specified in the form {horizontal_value}x{vertical_value}');
              done();
            });
          });
        } 
      }
    );

    calls.forEach( function(checkCall){
      checkCall();
    });

    var invalidHeading = [-1, 361];

    var calls = invalidHeading.map(
      function(invalid) {
        return function() {
          it('should not accept ' + invalid + ' as heading', function(done){
            var params = {
              location: '444 W Main St Lock Haven PA',
              size: '400x300',
              heading: invalid
            };
            gmAPI.streetView( params, function(err, binary) {
              should.not.exist(binary);
              should.exist(err);
              err.message.should.equal('params.heading must be between 0 and 360');
              done();
            });
          });
        } 
      }
    );

    calls.forEach( function(checkCall){
      checkCall();
    });

    var invalidFov = [-1, 121];

    var calls = invalidFov.map(
      function(invalid) {
        return function() {
          it('should not accept ' + invalid + ' as fov', function(done){
            var params = {
              location: '444 W Main St Lock Haven PA',
              size: '400x300',
              fov: invalid
            };
            gmAPI.streetView( params, function(err, binary) {
              should.not.exist(binary);
              should.exist(err);
              err.message.should.equal('params.fov must be between 0 and 120');
              done();
            });
          });
        } 
      }
    );

    calls.forEach( function(checkCall){
      checkCall();
    });

    var invalidPitch = [-91, 91];

    var calls = invalidPitch.map(
      function(invalid) {
        return function() {
          it('should not accept ' + invalid + ' as pitch', function(done){
            var params = {
              location: '444 W Main St Lock Haven PA',
              size: '400x300',
              pitch: invalid
            };
            gmAPI.streetView( params, function(err, binary) {
              should.not.exist(binary);
              should.exist(err);
              err.message.should.equal('params.pitch must be between -90 and 90');
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

    it('should accept a call with params.location', function(done){
      var params = {
        location: 'Old Street Station, London, UK',
        size: '400x300'
      };
      gmAPI.streetView( params, function(err, binary) {
        should.not.exist(err);
        should.exist(binary);
        done();
      });
    });

    it('should accept a call with params.location no callback', function(){
      var params = {
        location: 'Duomo di Milano, Milan, Italy',
        size: '1200x1600',
        heading: 110,
        pitch: 10,
        fov: 40
      };
      var result = gmAPI.streetView(params);
      result.should.equal('https://maps.googleapis.com/maps/api/streetview?location=Duomo%20di%20Milano%2C%20Milan%2C%20Italy&size=1200x1600&heading=110&fov=40&pitch=10&key='+simpleConfig.key);
    });

  });

});
