var should = require('should');

var _encodePolyline = require('../../../lib/utils/encodePolylines');


describe('encode polylines', function() {

  describe('success', function() {

    it('should encode a single pair of points', function() {
      var result = _encodePolyline('38.5,-120.2');
      result.should.equal('_p~iF~ps|U');
    });

    it('should encode many pairs of points', function() {
      var result = _encodePolyline('38.5,-120.2|40.7,-120.95|43.252,-126.453');
      result.should.equal('_p~iF~ps|U_ulLnnqC_mqNvxq`@');
    });

  });

});
