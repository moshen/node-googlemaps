var  assert = require('assert'),
  GoogleMapsAPI = require('../../lib/index')
  config = require('../simpleConfig');

describe('placeSearchText', function() {
  var gm = new GoogleMapsAPI(config);

  describe('Search for restaurants near Sydney.', function() {
    var result;
    before(function(done){
      gm.placeSearchText({
        query: 'restaurants+in+Sydney',
      }, function(err, data) {
        assert.ifError(err);
        result = data;
        done();
      });
    });

    it('should return as a valid request', function() {
      assert.equal(result.status, 'OK');
    });
    it('should return expected lat/lng for Sydney', function() {
      assert.equal(result.results[0].geometry.location.lat.toFixed(3) , -33.876);
      assert.equal(result.results[0].geometry.location.lng.toFixed(3) , 151.206);
    });

  });

  describe('Search for an incomplete address, in this case, a street address that does not include a city or state or country', function() {
    var result;
    before(function(done){
      gm.placeSearchText({
        query: '123+main+street',
      }, function(err, data) {
        assert.ifError(err);
        result = data;
        done();
      });
    });

    it('should return as a valid request', function() {
      assert.equal(result.status, 'OK');
    });
    it('should return expected lat/lng for Estados Unidos', function() {
      assert.equal(result.results[0].geometry.location.lat.toFixed(3) , 45.535);
      assert.equal(result.results[0].geometry.location.lng.toFixed(3) , -74.997);
    })
  });

  describe('Search for the same incomplete addres, and includes location and radius parameters to bias the results to a region of interest.', function() {
    var result;
    before(function(done){
      gm.placeSearchText({
        query: '123+main+street',
        location: '42.3675294,-71.186966',
        radius: 10000
      }, function(err, data) {
        assert.ifError(err);
        result = data;
        done();
      });
    });

    it('should return as a valid request', function() {
      assert.equal(result.status, 'OK');
    });
    it('should return expected lat/lng for Estados Unidos', function() {
      assert.equal(result.results[0].geometry.location.lat.toFixed(3) , 42.368);
      assert.equal(result.results[0].geometry.location.lng.toFixed(3) , -71.187);
    })
  });

});
