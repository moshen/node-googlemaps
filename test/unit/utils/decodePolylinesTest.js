var should = require('should');

var decodePolyline = require('../../../lib/utils/decodePolylines');
var encodePolyline = require('../../../lib/utils/encodePolylines');


describe('decodePolyline', function() {

  describe('failures', function() {

    var invalidInputs = [null, undefined, false, 0, NaN, {}, [], new Date, function() {}];

    invalidInputs.forEach(function(invalid) {
      it('should not accept ' + invalid + ' as input', function() {
        (function() { decodePolyline(invalid) }).should.throw('Encoded polyline must be a string');
      });
    });

  });

  describe('success', function() {

    it('should decode Google\'s test vector', function() {
      var encoded = '_p~iF~ps|U_ulLnnqC_mqNvxq`@';
      var expected = [[38.5, -120.2], [40.7, -120.95], [43.252, -126.453]];
      var result = decodePolyline(encoded);
      result.should.eql(expected);
    });

    it('should decode an empty string to an empty array', function() {
      decodePolyline('').should.eql([]);
    });

    it('should round-trip with encodePolyline', function() {
      var points = ['38.5,-120.2', '40.7,-120.95', '43.252,-126.453'];
      var encoded = encodePolyline(points);
      var decoded = decodePolyline(encoded);
      decoded.map(function(c) { return c[0] + ',' + c[1]; }).should.eql(points);
    });

  });

});