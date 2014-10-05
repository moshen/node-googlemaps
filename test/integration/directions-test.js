var vows = require('vows'),
  assert = require('assert'),
  GoogleMapsAPI = require('../../lib/googlemaps');

vows.describe('directions').addBatch({
  'Simple Directions (From: Madison, Wi To: Chicago, Il)': {
    topic: function(){
      var gm = new GoogleMapsAPI();
      gm.directions('Madison , Wi, USA', 'Chicago, Il, USA' , this.callback , 'false');
    },
    'returns as a valid request': function(err, result){
      assert.ifError(err);
      assert.equal(result.status, 'OK');
    },
    'returns expected lat/lng for Chicago': function(err, result){
      assert.equal(result.routes[0].legs[0].steps[0].end_location.lat.toFixed(3) , 43.073);
      assert.equal(result.routes[0].legs[0].steps[0].end_location.lng.toFixed(3) , -89.402);
    }
  }
}).export(module);


vows.describe('directions').addBatch({
  'Simple Directions (From: Madison, Wi To: Chicago, Il) with mode driving and departure time': {
    topic: function(){
      var gm = new GoogleMapsAPI();
      var departureNow = Math.floor((new Date()).getTime()/1000)
      gm.directions('Madison , Wi, USA', 'Chicago, Il, USA' , this.callback , 'false', 'driving', null, null,null, null, null, departureNow);
    },
    'returns as a valid request': function(err, result){
      assert.ifError(err);
      assert.equal(result.status, 'OK');
    },
    'returns expected lat/lng for Chicago': function(err, result){
      assert.equal(result.routes[0].legs[0].steps[0].end_location.lat.toFixed(3) , 43.073);
      assert.equal(result.routes[0].legs[0].steps[0].end_location.lng.toFixed(3) , -89.402);
    }
  }
}).export(module);


vows.describe('directions').addBatch({
  'Simple Directions (From: Waterloo station, London, UK To: Camden Town station, London, UK) with mode transit and departure time': {
    topic: function(){
      var gm = new GoogleMapsAPI();
      var departureNow = Math.floor((new Date()).getTime()/1000)
      gm.directions('Waterloo station, London, UK', 'Camden Town station, London, UK' , this.callback , 'false', 'transit', null, null,null, null, null, departureNow);
    },
    'returns as a valid request': function(err, result){
      assert.ifError(err);
      assert.equal(result.status, 'OK');
    },
    'returns expected lat/lng for London': function(err, result){
      assert.equal(result.routes[0].legs[0].steps[0].end_location.lat.toFixed(1) , 51.5);
      assert.equal(result.routes[0].legs[0].steps[0].end_location.lng.toFixed(1) , -0.1);
    }
  }
}).export(module);
