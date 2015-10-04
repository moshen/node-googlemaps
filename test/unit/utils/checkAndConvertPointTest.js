var should = require('should'),
  GoogleMapsAPI = require('../../../lib/index'),
  gm = new GoogleMapsAPI();

describe('checkAndConvertPoint', function() {
  describe('Using a lat/lng point as a string', function() {
    var result = gm.checkAndConvertPoint('41.874929479660025,-87.62077331542969');
    it('should equal to expected string value', function() {
      should.equal(result, '41.874929479660025,-87.62077331542969');
    });
  });

  describe('Using a lat/lng point as an array of numbers', function() {
    var result = gm.checkAndConvertPoint([41.874929479660025, -87.62077331542969]);
    it('should equal to expected string value', function() {
      should.equal(result, '41.874929479660025,-87.62077331542969');
    });
  });

  describe('Using a lat/lng point as a mixed array', function() {
    var result = gm.checkAndConvertPoint([41.874929479660025, ['-87.62077331542969']]);
    it('result is equal to expected string value', function() {
      should.equal(result, '41.874929479660025,-87.62077331542969');
    });
  });

  describe('Using incorrect lat/lng input (an object)', function() {
    var result;
    try{
      result = gm.checkAndConvertPoint({'lat': 41.874929479660025, 'lng': -87.62077331542969});
    }catch(e){
      result = e;
    }

    it('exception caught is an Error', function() {
      should(result).be.Error();
    });
    it('error thrown was checkAndConvertPoint\'s error', function() {
      should.ok(result.message.search('checkAndConvertPoint') > 0);
    });
  });
});
