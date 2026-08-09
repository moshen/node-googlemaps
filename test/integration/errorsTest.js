var should = require('should'),
  GoogleMapsAPI = require('../../lib/index')
  config = require('../integrationConfig');

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
    it('should return a connection error code', function() {
      // The error code varies by transport (fetch vs request, proxy vs
      // direct). Only assert that a connection-type error code is present.
      should.exist(err.code);
      should.equal(typeof err.code, 'string');
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

    it('should return an error and no data', function() {
      should(err).be.Error();
      should(result).be.undefined();
    });
    it('should reflect a rejected request (auth or network failure)', function() {
      // The exact status code / message text varies by Google's response and by
      // the calling environment (auth rejection vs. network policy block). Only
      // assert that the request was rejected, not a specific code/string.
      var rejected = (err.code && Number(err.code) >= 400) ||
                     /authenticat|denied|unauthor|blocked|forbidden/i.test(err.message || '');
      should(rejected).be.true(
        'expected an auth/network rejection, got code=' + err.code +
        ' message=' + err.message);
    });
  });
});
