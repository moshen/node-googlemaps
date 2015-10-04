var should = require('should'),
  GoogleMapsAPI = require('../../lib/index'),
  config = require('../simpleConfig');

describe('geocode', function() {
  var gm = new GoogleMapsAPI(config);

  describe('Free geocode (Chicago)', function() {
    var result;
    before(function(done) {
      gm.geocode({ address: 'Chicago, Il, USA' }, function(err, data) {
        should.ifError(err);
        result = data;
        done();
      });
    });

    it('should return a valid request', function() {
      should.equal(result.status , 'OK');
    });
    it('should return the expected lat/lng for Chicago', function() {
      should.equal(result.results[0].geometry.location.lat.toFixed(2), 41.88);
      should.equal(result.results[0].geometry.location.lng.toFixed(2), -87.63);
    });
  });

  describe('Curtain Road (London, UK)', function() {
    var result;
    before(function(done) {
      gm.geocode({
        address:    "121, Curtain Road, EC2A 3AD, London UK",
        components: "components=country:GB",
        bounds:     "55,-1|54,1",
        language:   "en",
        region:     "uk"
      }, function(err, data) {
        should.ifError(err);
        result = data;
        done();
      });
    });

    it('should return a valid request', function() {
      should.equal(result.status , 'OK');
    });
    it('should return the expected lat/lng for London', function() {
      should.equal(result.results[0].geometry.location.lat.toFixed(2), 51.53);
      should.equal(result.results[0].geometry.location.lng.toFixed(2), -0.08);
    });
  });
});
