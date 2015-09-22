var should = require('should');

var GoogleMapsAPI = require('../../lib/index');

var simpleConfig = require('../simpleConfig');

var gmAPI;


describe('staticMap', function() {

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
            (function() { gmAPI.staticMap( validParams, invalid ) }).should.throw();
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
      customGmAPI.staticMap( params, function(err, binary) {
        should.not.exist(binary);
        should.exist(err);
        err.message.should.equal('The staticMap API requires a key. You can add it to the config.');
        done();
      });

    });


    var invalidParams = [null, undefined, false, 0, NaN, '', [], new Date, function() {}];

    var calls = invalidParams.map(
      function(invalid) {
        return function() {
          it('should not accept ' + invalid + ' as params', function(done){
            gmAPI.staticMap( invalid, function(err, binary) {
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

    it('should not accept a call without params.center', function(done){
      var params = {
        zoom: 15,
        size: '500x400',
        maptype: 'satellite'
      };
      gmAPI.staticMap( params, function(err, binary) {
        should.not.exist(binary);
        should.exist(err);
        err.message.should.equal('params.center is required');
        done();
      });

      (function() {gmAPI.staticMap( params )}).should.throw('params.center is required');
    });

    var invalidZoom = [false, NaN, '', [], new Object, new Date, function() {}];

    var calls = invalidZoom.map(
      function(invalid) {
        return function() {
          it('should not accept ' + invalid + ' as zoom', function(done){
            var params = {
              center: '444 W Main St Lock Haven PA',
              zoom: invalid,
              size: '500x400',
              maptype: 'satellite'
            };
            gmAPI.staticMap( params, function(err, binary) {
              should.not.exist(binary);
              should.exist(err);
              err.message.should.equal('params.zoom is required');
              done();
            });
          });
        } 
      }
    );

    var invalidZoom = [-1, 22];

    var calls = invalidZoom.map(
      function(invalid) {
        return function() {
          it('should not accept ' + invalid + ' as zoom', function(done){
            var params = {
              center: '444 W Main St Lock Haven PA',
              zoom: invalid,
              size: '500x400',
              maptype: 'satellite'
            };
            gmAPI.staticMap( params, function(err, binary) {
              should.not.exist(binary);
              should.exist(err);
              err.message.should.equal('params.zoom must be between 0 and 21');
              done();
            });
          });
        } 
      }
    );

    calls.forEach( function(checkCall){
      checkCall();
    });

    var invalidSize = [undefined, null, false, 0, NaN, '', [], new Date, function() {}, 'large', '100px_200px'];

    var calls = invalidSize.map(
      function(invalid) {
        return function() {
          it('should not accept ' + invalid + ' as size', function(done){
            var params = {
              center: '444 W Main St Lock Haven PA',
              zoom: 10,
              size: invalid,
              maptype: 'satellite'
            };
            gmAPI.staticMap( params, function(err, binary) {
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

    var invalidScale = [0, 3, 5, 12.323];

    var calls = invalidScale.map(
      function(invalid) {
        return function() {
          it('should not accept ' + invalid + ' as scale', function(done){
            var params = {
              center: '444 W Main St Lock Haven PA',
              zoom: 10,
              size: '400x600',
              scale: invalid,
              maptype: 'satellite'
            };
            gmAPI.staticMap( params, function(err, binary) {
              should.not.exist(binary);
              should.exist(err);
              err.message.should.equal('params.scale must be 1, 2, 4');
              done();
            });
          });
        } 
      }
    );

    calls.forEach( function(checkCall){
      checkCall();
    });

    it('should not accept scale 4 for non Google Maps for Work users', function(done){
      var config = {
        key:              'xxxxxxx',
        stagger_time:     1000,
        encode_polylines: true,
        secure:           true,
        proxy:            'http://127.0.0.1:9999',
      };
      var mockRequest = function(options, callback) {
        var res = {
          statusCode: 200
        };
        var data = null;
        return callback(null, res, data);
      };

      var customGmAPI = new GoogleMapsAPI( config, mockRequest );
      var params = {
        center: '444 W Main St Lock Haven PA',
        zoom: 10,
        size: '400x600',
        scale: 4,
        maptype: 'satellite'
      };
      customGmAPI.staticMap( params, function(err, binary) {
        should.not.exist(binary);
        should.exist(err);
        err.message.should.equal('params.scale can be 4 only for GoogleMaps for work users');
        done();
      });
      (function() {customGmAPI.staticMap( params )}).should.throw('params.scale can be 4 only for GoogleMaps for work users');
    });

    var invalidFormat = ['TIFF', 'bmp', 'mp3'];

    var calls = invalidFormat.map(
      function(invalid) {
        return function() {
          it('should not accept ' + invalid + ' as format', function(done){
              var params = {
                center: '444 W Main St Lock Haven PA',
                zoom: 10,
                size: '400x600',
                format: invalid,
                maptype: 'satellite'
              };
              gmAPI.staticMap( params, function(err, binary) {
                should.not.exist(binary);
                should.exist(err);
                err.message.should.equal('Invalid params.format: '+invalid+'. Valid params.format are [png8|png|png32|gif|jpg|jpg-baseline]');
                done();
              });
          });
        } 
      }
    );

    calls.forEach( function(checkCall){
      checkCall();
    });

    var invalidMapType = ['large', 'small'];

    var calls = invalidMapType.map(
      function(invalid) {
        return function() {
          it('should not accept ' + invalid + ' as maptype', function(done){
            var params = {
              center: '444 W Main St Lock Haven PA',
              zoom: 10,
              size: '400x600',
              maptype: invalid
            };
            gmAPI.staticMap( params, function(err, binary) {
              should.not.exist(binary);
              should.exist(err);
              err.message.should.equal('Invalid params.maptype: '+invalid+'. Valid params.maptype are [roadmap|satellite|terrain|hybrid]');
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
      
    it('should accept a call without params.center and params.zoom in case there are paths', function(done){
      var params = {
        size: '500x400',
        maptype: 'satellite',
        path: [
          {
            points: [
              'Old Street Station, London, Uk',
              'St Paul, London, Uk',
              'Holborn Station, London, Uk',
              'Embankment, London, Uk',
              'London Bridge station, London, Uk',
              'Bank Station, London, Uk',
              'Old Street Station, London, Uk'
            ],
            color: '0x0000ff',
            weight: 3
          }
        ]
      };
      gmAPI.staticMap( params, function(err, binary) {
        should.not.exist(err);
        should.exist(binary);
        done();
      });
    });

    it('should accept a call without params.center and params.zoom in case there are markers', function(done){
      var params = {
        markers: [
          { location: '444 W Main St Lock Haven PA' },
          { location: 'Houston Texas, US' }
        ],
        size: '400x400',
        maptype: 'terrain',
        scale: 2
      };
      gmAPI.staticMap( params, function(err, binary) {
        should.not.exist(err);
        should.exist(binary);
        done();
      });
    });

    it('should accept a call without params.center and params.zoom in case there are paths and markers', function(done){
      var params = {
        size: '500x400',
        maptype: 'satellite',
        markers: [
          { location: '444 W Main St Lock Haven PA' },
          { location: 'Houston Texas, US' }
        ],
        path: [
          {
            points: [
              'Old Street Station, London, Uk',
              'St Paul, London, Uk',
              'Holborn Station, London, Uk',
              'Embankment, London, Uk',
              'London Bridge station, London, Uk',
              'Bank Station, London, Uk',
              'Old Street Station, London, Uk'
            ],
            color: '0x0000ff',
            weight: 3
          }
        ]
      };
      gmAPI.staticMap( params, function(err, binary) {
        should.not.exist(err);
        should.exist(binary);
        done();
      });
    });

    it('should return a static map binary', function(done){
      var params = {
        center: 'London, UK',
        zoom: 14,
        size: '1000x2000',
        scale: 2,
        styles: [
          {
            feature: 'road',
            element: 'all',
            rules: {
              hue: '0x00ff00'
            }
          }
        ]
      };
      gmAPI.staticMap( params, function(err, binary) {
        should.not.exist(err);
        should.exist(binary);
        done();
      });

    });

    it('should return a static map binary with style', function(done){

      var params = {
        center: 'Waterloo, London, UK',
        zoom: 15,
        size: '521x512',
        scale: 2,
        maptype: 'roadmap',
        style: [
          {
            feature:'road.local',
            element:'geometry',
            rules: {
              color:'0x00ff00',
              weight:1,
              visibility:'on'
            }
          },
          {
            feature:'landscape',
            element:'geometry.fill',
            rules: {
              color:'0x000000',
              visibility:'on'
            }
          },
          {
            feature:'administrative',
            element:'labels',
            rules: {
              weight:3.9,
              visibility:'on',
              inverse_lightness:true
            }
          },
          {
            feature:'poi',
            rules: {
              visibility:'simplified'
            }
          }
        ]
      };
      gmAPI.staticMap( params, function(err, binary) {
        should.not.exist(err);
        should.exist(binary);
        done();
      });

    });

    it('should return a static map binary with path', function(done){

      var params = {
        center: 'Chancery lane, London, UK',
        zoom: 14,
        size: '1024x512',
        scale: 2,
        maptype: 'roadmap',
        format: 'gif',
        path: [
          {
            points: [
              'Old Street Station, London, Uk',
              'St Paul, London, Uk',
              'Holborn Station, London, Uk',
              'Embankment, London, Uk',
              'London Bridge station, London, Uk',
              'Bank Station, London, Uk',
              'Old Street Station, London, Uk'
            ],
            color: '0x0000ff',
            weight: 3
          }
        ]
      };
      gmAPI.staticMap( params, function(err, binary) {
        should.not.exist(err);
        should.exist(binary);
        done();
      });

    });

  });

});
