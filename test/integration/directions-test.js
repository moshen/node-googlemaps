var vows = require('vows'),
  assert = require('assert'),
  GoogleMapsAPI = require('../../lib/index')
  config = require('../simpleConfig');

vows.describe('directions').addBatch({
  'Simple Directions (From: Madison, Wi To: Chicago, Il)': {
    topic: function(){
      var gm = new GoogleMapsAPI(config);
      gm.directions({
        origin: 'Madison , Wi, USA',
        destination: 'Chicago, Il, USA'
      }, this.callback);
    },
    'returns as a valid request': function(err, result){
      assert.ifError(err);
      assert.equal(result.status, 'OK');
    },
    'returns expected lat/lng for Chicago': function(err, result){
      assert.equal(result.routes[0].legs[0].steps[0].end_location.lat.toFixed(3) , 43.073);
      assert.equal(result.routes[0].legs[0].steps[0].end_location.lng.toFixed(3) , -89.402);
    }
  },
  'Simple Directions (From: Madison, Wi To: Chicago, Il) with mode driving and departure time': {
    topic: function(){
      var gm = new GoogleMapsAPI(config);
      gm.directions({
        origin: 'Madison , Wi, USA',
        destination: 'Chicago, Il, USA',
        mode: 'driving',
        departure_time: new Date()
      }, this.callback);
    },
    'returns as a valid request': function(err, result){
      assert.ifError(err);
      assert.equal(result.status, 'OK');
    },
    'returns expected lat/lng for Chicago': function(err, result){
      assert.equal(result.routes[0].legs[0].steps[0].end_location.lat.toFixed(3) , 43.073);
      assert.equal(result.routes[0].legs[0].steps[0].end_location.lng.toFixed(3) , -89.402);
    }
  },
  'Simple Directions (From: Waterloo station, London, UK To: Camden Town station, London, UK) with mode transit and departure time': {
    topic: function(){
      var gm = new GoogleMapsAPI(config);
      gm.directions({
        origin: 'Waterloo station, London, UK',
        destination: 'Camden Town station, London, UK',
        mode: 'transit',
        departure_time: new Date()
      }, this.callback);
    },
    'returns as a valid request': function(err, result){
      assert.ifError(err);
      assert.equal(result.status, 'OK');
    },
    'returns expected lat/lng for London': function(err, result){
      assert.equal(result.routes[0].legs[0].steps[0].end_location.lat.toFixed(1) , 51.5);
      assert.equal(result.routes[0].legs[0].steps[0].end_location.lng.toFixed(1) , -0.1);
    }
  },
  'Simple Directions (From: Boston,MA to Concord, MA) with waypoints': {
    topic: function(){
      var gm = new GoogleMapsAPI(config);
      gm.directions({
        origin: 'Boston, MA, USA',
        destination: 'Concord, MA, USA',
        mode: 'driving',
        waypoints: 'optimize:true|via:Charlestown,MA|Lexington,MA'
      }, this.callback);
    },
    'returns as a valid request': function(err, result){
      assert.ifError(err);
      assert.equal(result.status, 'OK');
    },
    'returns expected lat/lng for Boston': function(err, result){
      assert.equal(result.routes[0].legs[0].steps[0].end_location.lat.toFixed(1), 42.4);
      assert.equal(result.routes[0].legs[0].steps[0].end_location.lng.toFixed(1), -71.1);
      // TODO add more checks
    }
  }

}).export(module);
