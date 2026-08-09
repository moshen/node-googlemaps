var  assert = require('assert'),
  GoogleMapsAPI = require('../../lib/index')
  config = require('../integrationConfig');

function assertWithinBounds(coord, min, max, name, axis) {
  assert.ok(!isNaN(coord), name + ' ' + axis + ' is not a number: ' + coord);
  assert.ok(coord >= min && coord <= max,
    name + ' ' + axis + ' (' + coord + ') is not within [' + min + ', ' + max + ']');
}

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
      var loc = result.routes[0].legs[0].steps[0].end_location;
      assertWithinBounds(loc.lat, 43.0, 43.1, 'first step end', 'lat');
      assertWithinBounds(loc.lng, -89.5, -89.3, 'first step end', 'lng');
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
      var loc = result.routes[0].legs[0].steps[0].end_location;
      assertWithinBounds(loc.lat, 43.0, 43.1, 'first step end', 'lat');
      assertWithinBounds(loc.lng, -89.5, -89.3, 'first step end', 'lng');
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
      var loc = result.routes[0].legs[0].steps[0].end_location;
      assertWithinBounds(loc.lat, 51.4, 51.6, 'first step end', 'lat');
      assertWithinBounds(loc.lng, -0.2, 0.0, 'first step end', 'lng');
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
      var loc = result.routes[0].legs[0].steps[0].end_location;
      assertWithinBounds(loc.lat, 42.3, 42.5, 'first step end', 'lat');
      assertWithinBounds(loc.lng, -71.2, -71.0, 'first step end', 'lng');
    });
  });
});
