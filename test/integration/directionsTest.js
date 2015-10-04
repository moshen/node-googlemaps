var  assert = require('assert'),
  GoogleMapsAPI = require('../../lib/index')
  config = require('../simpleConfig');

describe('directions', function() {
  var gm = new GoogleMapsAPI(config);

  describe('Simple Directions (From: Madison, Wi To: Chicago, Il)', function() {
    var result;
    before(function(done){
      gm.directions({
        origin: 'Madison , Wi, USA',
        destination: 'Chicago, Il, USA'
      }, function(err, data) {
        assert.ifError(err);
        result = data;
        done();
      });
    });

    it('should return as a valid request', function() {
      assert.equal(result.status, 'OK');
    });
    it('should return expected lat/lng for Chicago', function() {
      assert.equal(result.routes[0].legs[0].steps[0].end_location.lat.toFixed(3) , 43.073);
      assert.equal(result.routes[0].legs[0].steps[0].end_location.lng.toFixed(3) , -89.402);
    });
  });

  describe('Simple Directions (From: Madison, Wi To: Chicago, Il) with mode driving and departure time',
  function() {
    var result;
    before(function(done){
      gm.directions({
        origin: 'Madison , Wi, USA',
        destination: 'Chicago, Il, USA',
        mode: 'driving',
        departure_time: new Date()
      }, function(err, data) {
        assert.ifError(err);
        result = data;
        done();
      });
    });

    it('should return as a valid request', function(){
      assert.equal(result.status, 'OK');
    });
    it('should return expected lat/lng for Chicago', function(){
      assert.equal(result.routes[0].legs[0].steps[0].end_location.lat.toFixed(3) , 43.073);
      assert.equal(result.routes[0].legs[0].steps[0].end_location.lng.toFixed(3) , -89.402);
    });
  });

  describe('Simple Directions (From: Waterloo station, London, UK To: Camden Town station, London, UK) with mode transit and departure time',
  function() {
    var result;
    before(function(done){
      gm.directions({
        origin: 'Waterloo station, London, UK',
        destination: 'Camden Town station, London, UK',
        mode: 'transit',
        departure_time: new Date()
      }, function(err, data) {
        assert.ifError(err);
        result = data;
        done();
      });
    });

    it('should return as a valid request', function() {
      assert.equal(result.status, 'OK');
    });
    it('should return expected lat/lng for London', function(){
      assert.equal(result.routes[0].legs[0].steps[0].end_location.lat.toFixed(1) , 51.5);
      assert.equal(result.routes[0].legs[0].steps[0].end_location.lng.toFixed(1) , -0.1);
    });
  });

  describe('Simple Directions (From: Boston,MA to Concord, MA) with waypoints', function() {
    var result;
    before(function(done){
      gm.directions({
        origin: 'Boston, MA, USA',
        destination: 'Concord, MA, USA',
        mode: 'driving',
        waypoints: 'optimize:true|via:Charlestown,MA|Lexington,MA'
      }, function(err, data) {
        assert.ifError(err);
        result = data;
        done();
      });
    });

    it('should return as a valid request', function(){
      assert.equal(result.status, 'OK');
    });
    it('should return expected lat/lng for Boston', function(){
      assert.equal(result.routes[0].legs[0].steps[0].end_location.lat.toFixed(1), 42.4);
      assert.equal(result.routes[0].legs[0].steps[0].end_location.lng.toFixed(1), -71.1);
      // TODO add more checks
    });
  });
});
