var vows = require('vows'),
  assert = require('assert'),
  nock = require('nock'),
  gm = require('../lib/googlemaps');

var location = { lat: 37.7749295, lng: -122.4194155 };
var now = 1384901494;

var googleTimezone = nock('https://maps.googleapis.com:443')
  .get('/maps/api/timezone/json?location=37.7749295%2C-122.4194155&timestamp=1384901494&sensor=false&language=en')
  .reply(200, "{\n   \"dstOffset\" : 0,\n   \"rawOffset\" : -28800,\n   \"status\" : \"OK\",\n   \"timeZoneId\" : \"America/Los_Angeles\",\n   \"timeZoneName\" : \"Pacific Standard Time\"\n}\n")
  .get('/maps/api/timezone/json?location=37.7749295%2C-122.4194155&timestamp=1384901494&sensor=true&language=en')
  .reply(200, "{\n   \"dstOffset\" : 0,\n   \"rawOffset\" : -28800,\n   \"status\" : \"OK\",\n   \"timeZoneId\" : \"America/Los_Angeles\",\n   \"timeZoneName\" : \"Pacific Standard Time\"\n}\n")
  .get('/maps/api/timezone/json?location=37.7749295%2C-122.4194155&timestamp=1384901494&sensor=false&language=es')
  .reply(200, "{\n   \"dstOffset\" : 0,\n   \"rawOffset\" : -28800,\n   \"status\" : \"OK\",\n   \"timeZoneId\" : \"America/Los_Angeles\",\n   \"timeZoneName\" : \"Hora estÃ¡ndar del PacÃ­fico\"\n}\n");

vows.describe('timezone').addBatch({
  'Simple timezone (San Francisco)': {
    topic: function(){
      gm.timezone(location, now, this.callback);
    },
    'returns as a valid request': function(err, result){
      assert.equal(result.status , 'OK');
    },
    'returns the expected timeZoneId': function(err, result){
      assert.equal(result.timeZoneId , 'America/Los_Angeles');
    },
  },

  'Timezone with sensor (San Francisco)': {
    topic: function(){
      gm.timezone(location, now, this.callback, true);
    },
    'returns as a valid request': function(err, result){
      assert.equal(result.status , 'OK');
    },
    'returns the expected timeZoneId': function(err, result){
      assert.equal(result.timeZoneId , 'America/Los_Angeles');
    },
  },

  'Timezone in Spanish (San Francisco)': {
    topic: function(){
      gm.timezone(location, now, this.callback, false, 'es');
    },
    'returns as a valid request': function(err, result){
      assert.equal(result.status , 'OK');
    },
    'returns the expected timeZoneId': function(err, result){
      assert.equal(result.timeZoneId , 'America/Los_Angeles');
    },
    'returns the timeZoneName in Spanish': function(err, result){
      assert.match(result.timeZoneName , /Hora/);
    },
  }

}).addBatch({
  'Teardown': {
    'assert the googleTimezone nock is done': function () {
      googleTimezone.done();
    },
  },
}).export(module);

// vim: set expandtab sw=2:
