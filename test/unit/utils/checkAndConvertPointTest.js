var should = require('should'),
  GoogleMapsAPI = require('../../../lib/index'),
  gm = new GoogleMapsAPI();

describe('checkAndConvertPoint', function() {

  describe('Using a lat/lng point as a string', function() {
    var input = '41.874929479660025,-87.62077331542969'
    it('should equal to expected string value', function() {
      gm.checkAndConvertPoint(input).should.equal(input);
    });
  });

  describe('Using a lat/lng point as an array of numbers', function() {
    var lat = 41.874929479660025
    var lng = -87.62077331542969
    var input = [lat, lng];
    it('should equal to expected string value', function() {
      gm.checkAndConvertPoint(input).should.eql(lat + ',' + lng);
    });
  });

  describe('Using a lat/lng point as a mixed array', function() {
    var lat = 41.874929479660025
    var lng = ['-87.62077331542969']
    it('result is equal to expected string value', function() {
      gm.checkAndConvertPoint([lat, lng]).should.equal(lat + ',' + lng[0]);
    });
  });

  describe('Using incorrect lat/lng input (an object)', function() {
    it ('should throw', function() {
      (function(){
        gm.checkAndConvertPoint({'lat': 41.874929479660025, 'lng': -87.62077331542969});
      }).should.throw('Unrecognized input: checkAndConvertPoint accepts Arrays of Numbers and Strings')
    });
  });

});
