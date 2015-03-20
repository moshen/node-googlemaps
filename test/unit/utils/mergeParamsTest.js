var should = require('should');

var mergeParams = require('../../../lib/utils/mergeParams');
var _getDefaultConfig = require('../../../lib/config/getDefault');
var _constants        = require('../../../lib/config/constants');

var ACCEPTED_CONFIG_KEYS = _constants.ACCEPTED_CONFIG_KEYS;


describe('mergeParams', function() {

  describe('success', function() {

    it('merge two object with acceptance', function() {
      var defaultConfig = _getDefaultConfig();
      var config = {
        key: 'xxxxxxx',
        google_client_id:   'test-client-id',
        stagger_time:       1000,
        encode_polylines:   false,
        secure:             true,
        proxy:              'http://127.0.0.1:9999',
        google_private_key: 'test-private-key'
      };

      var result = mergeParams(defaultConfig, config, ACCEPTED_CONFIG_KEYS);

      result.key.should.equal(config.key);
      result.google_client_id.should.equal(config.google_client_id);
      result.stagger_time.should.equal(config.stagger_time);
      result.encode_polylines.should.equal(config.encode_polylines);
      result.secure.should.equal(config.secure);
      result.proxy.should.equal(config.proxy);
      result.google_private_key.toString('base64').should.equal('test+private+key');
    });

  });

});
