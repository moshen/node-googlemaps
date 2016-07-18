var should = require('should'),
  GoogleMapsAPI = require('../../lib/index')
  config = require('../simpleConfig');

describe('errors', function() {
  describe('No connection', function() {
    var result, err;
    before(function(done) {
      var devNullConfig = {
        key: config.key,
        proxy: 'https://127.0.0.1:49151'
      };
      var gm = new GoogleMapsAPI(devNullConfig);
      gm.geocode({ address: 'Hamburg' }, function(maybeErr, data) {
        result = data;
        err = maybeErr;
        done();
      });
    });

    it('should return an error', function() {
      should(result).be.undefined();
      should(err).be.Error();
    });
    it('should return the error code ECONNREFUSED', function() {
      should.equal(err.code, 'ECONNRESET');
    });
  });

  describe('Wrong Credentials', function() {
    var result, err;
    before(function(done) {
      var gm = new GoogleMapsAPI({
        google_client_id: 'clientID',
        google_private_key: 'WRONG-KEY'
      });
      gm.geocode({ address: 'Hamburg' }, function(maybeErr, data) {
        result = data;
        err = maybeErr;
        done();
      });
    });

    it('should return an error', function() {
      should(result).be.undefined();
      should(err).be.Error();
    });
    it('should return status 403 - Unable to authenticate', function() {
      should.equal(err.code, 403);
      should(err.message).startWith('Unable to authenticate');
    });
  });
});
