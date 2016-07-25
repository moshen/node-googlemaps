var should = require('should');

var GoogleMapsAPI = require('../../lib/index');


describe('constructor', function() {

  describe('defaults', function() {

    it('should default config if none is passed', function() {
      (function() { new GoogleMapsAPI() }).should.not.throw();
      var gmAPI = new GoogleMapsAPI();
      should.exist( gmAPI.config );
    });

    it('should default request if none is passed', function() {
      var validConfig = {};
      (function() { new GoogleMapsAPI( validConfig ) }).should.not.throw();
      var gmAPI = new GoogleMapsAPI( validConfig );
      should.exist( gmAPI.request );
      gmAPI.request.should.be.instanceof(Function);
    });

    var invalidRequest = [false, 0, NaN, '', {}, [], new Object, new Date];
    var calls = invalidRequest.map(
      function(invalid) {
        return function() {
          it('should default request if ' + invalid + ' is passed', function() {
            var validConfig = {};
            (function() { new GoogleMapsAPI( validConfig, invalid ) }).should.not.throw();
            var gmAPI = new GoogleMapsAPI( validConfig, invalid )
            should.exist( gmAPI.request );
            gmAPI.request.should.be.instanceof(Function);
          });
        }
      }
    );

    calls.forEach( function(checkCall) {
      checkCall();
    });

  });

  describe('success', function() {

    it('should accept configurations', function() {

      var config = {
        key:                'xxxxxxxxxxxxxxxx',
        google_client_id:   'test-client-id',
        google_channel:     'test-channel',
        stagger_time:       1000,
        encode_polylines:   false,
        secure:             true,
        proxy:              'http://127.0.0.1:9999',
        google_private_key: 'test-private-key'
      };

      var gmAPI = new GoogleMapsAPI( config );

      should.exist( gmAPI.config );

      gmAPI.config.key.should.equal( config.key );
      gmAPI.config.google_client_id.should.equal( config.google_client_id );
      gmAPI.config.google_channel.should.equal( config.google_channel );
      gmAPI.config.stagger_time.should.equal( config.stagger_time );
      gmAPI.config.encode_polylines.should.equal( config.encode_polylines );
      gmAPI.config.secure.should.equal( config.secure );
      gmAPI.config.proxy.should.equal( config.proxy );

      should.exist( gmAPI.config.google_private_key );

    });

    it('should accept a configuration without keys', function() {

      var config = {
        stagger_time:       1000,
        encode_polylines:   false,
        secure:             true,
        proxy:              'http://127.0.0.1:9999'
      };

      var gmAPI = new GoogleMapsAPI( config );

      should.exist( gmAPI.config );

      should.not.exist(gmAPI.config.key);
      should.not.exist(gmAPI.config.google_client_id);
      should.not.exist( gmAPI.config.google_private_key );
      gmAPI.config.stagger_time.should.equal( config.stagger_time );
      gmAPI.config.encode_polylines.should.equal( config.encode_polylines );
      gmAPI.config.secure.should.equal( config.secure );
      gmAPI.config.proxy.should.equal( config.proxy );
    });

    it('should accept any injected request function', function() {

      var customRequest = function(options, callback){
        return callback(null, {}, "{}");
      };

      var gmAPI = new GoogleMapsAPI( {}, customRequest );

      should.exist( gmAPI.request );

      gmAPI.request.should.eql( customRequest );

    });

  });

  describe('configurations logic', function() {

    it('should not set arbitrary configuration keys', function() {

      var config = {
        'some-random-unaccepted-key': '##'
      };

      var gmAPI = new GoogleMapsAPI( config );

      should.exist( gmAPI.config );
      gmAPI.config.should.not.have.property( 'some-random-unaccepted-key' );

    });

    it('should base64 encode google_private_key after normalizing', function() {

      var config = {
        google_private_key: 'test-private_key'
      };

      var normalizedGooglePrivateKey = 'test+private/key';

      var gmAPI = new GoogleMapsAPI( config );

      should.exist( gmAPI.config );

      gmAPI.config.google_private_key.should.be.instanceof( Buffer );
      gmAPI.config.google_private_key.should.eql( new Buffer( normalizedGooglePrivateKey, 'base64' ) );

    });

  });

  describe('non global object', function() {

    it('should not return a singleton', function() {

      var config1 = {
        google_private_key: 'test_private_key_1',
        stagger_time:       5000,
        secure:             false
      };

      var gmAPI_1 = new GoogleMapsAPI( config1 );

      var config2 = {
        key:                'xxxxxxx',
        google_client_id:   'test-client-id',
        stagger_time:       1000,
        encode_polylines:   false,
        secure:             true,
        proxy:              'http://127.0.0.1:9999',
        google_private_key: 'test_private_key_2'
      };

      var gmAPI_2 = new GoogleMapsAPI( config2 );

      gmAPI_1.config.should.not.eql( gmAPI_2.config );
      gmAPI_1.config.secure.should.be.false;

      gmAPI_1.config.stagger_time.should.equal(config1.stagger_time);
      gmAPI_2.config.stagger_time.should.equal(config2.stagger_time);

      should.not.exist(gmAPI_1.config.key);

    });

  });

});
