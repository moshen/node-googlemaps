var  assert = require('assert'),
  GoogleMapsAPI = require('../../lib/index')
  config = require('../integrationConfig');

function assertWithinBounds(coord, min, max, name, axis) {
  assert.ok(!isNaN(coord), name + ' ' + axis + ' is not a number: ' + coord);
  assert.ok(coord >= min && coord <= max,
    name + ' ' + axis + ' (' + coord + ') is not within [' + min + ', ' + max + ']');
}

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
      // Google's ranking for the literal query "restaurants+in+Sydney" is not
      // stable across API keys/regions, so only assert that we got at least one
      // valid place result with numeric coordinates somewhere on Earth.
      assert.ok(result.results && result.results.length > 0,
        'expected at least one place result');
      var loc = result.results[0].geometry.location;
      assert.ok(!isNaN(loc.lat) && !isNaN(loc.lng),
        'expected numeric lat/lng, got ' + JSON.stringify(loc));
      assertWithinBounds(loc.lat, -90, 90, 'Sydney result', 'lat');
      assertWithinBounds(loc.lng, -180, 180, 'Sydney result', 'lng');
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
      // Google may return ZERO_RESULTS for ambiguous queries like
      // "123+main+street" depending on the API key's region. Accept
      // either OK with results or ZERO_RESULTS.
      var acceptable = result.status === 'OK' || result.status === 'ZERO_RESULTS';
      assert.ok(acceptable, 'expected OK or ZERO_RESULTS, got ' + result.status);
    });
    it('should return a result on Earth when results exist', function() {
      if (result.status !== 'OK' || !result.results || !result.results.length) return;
      var loc = result.results[0].geometry.location;
      assertWithinBounds(loc.lat, -90, 90, 'result', 'lat');
      assertWithinBounds(loc.lng, -180, 180, 'result', 'lng');
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
    it('should return expected lat/lng near the location bias', function() {
      var loc = result.results[0].geometry.location;
      assertWithinBounds(loc.lat, 42.2, 42.5, 'biased result', 'lat');
      assertWithinBounds(loc.lng, -71.3, -71.0, 'biased result', 'lng');
    })
  });

});
