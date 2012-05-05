var vows = require('vows'),
  assert = require('assert'),
  gm = require('../lib/googlemaps');

//vows.describe().addBatch({
//
//}).export(module);

vows.describe('checkAndConvertPoint').addBatch({
  'Using a lat/lng point as a string': {
    topic: gm.checkAndConvertPoint('41.874929479660025,-87.62077331542969'),
    'result is equal to expected string value': function(result){
      assert.equal(result, '41.874929479660025,-87.62077331542969');
    }
  },
  'Using a lat/lng point as an array of numbers': {
    topic: gm.checkAndConvertPoint([41.874929479660025, -87.62077331542969]),
    'result is equal to expected string value': function(result){
      assert.equal(result, '41.874929479660025,-87.62077331542969');
    }
  },
  'Using a lat/lng point as a mixed array': {
    topic: gm.checkAndConvertPoint([41.874929479660025, ['-87.62077331542969']]),
    'result is equal to expected string value': function(result){
      assert.equal(result, '41.874929479660025,-87.62077331542969');
    }
  },
  'Using incorrect lat/lng input (an object)': {
    topic: function(){
      try{
        return [gm.checkAndConvertPoint({'lat': 41.874929479660025, 'lng': -87.62077331542969}), false];
      }catch(e){
        return [e, true];
      }
    },
    'an exception was caught': function(result){
      assert.ok(result[1]);
    },
    'exception caught is an Error': function(result){
      assert.instanceOf(result[0], Error);
    },
    'error thrown was checkAndConvertPoint\'s error': function(result){
      assert.ok(result[0].message.search('checkAndConvertPoint') > 0);
    }
  }
}).export(module);


vows.describe('checkAndConvertArrayOfPoints').addBatch({
  'Using a list of lat/lng points as a string': {
    topic: gm.checkAndConvertArrayOfPoints('41.874929479660025,-87.62077331542969|41.874929479660025,-87.62077331542969'),
    'result is equal to expected string value': function(result){
      assert.equal(result, '41.874929479660025,-87.62077331542969|41.874929479660025,-87.62077331542969');
    }
  },
  'Using a list of lat/lng points as a matrix of numbers': {
    topic: gm.checkAndConvertArrayOfPoints([[41.874929479660025, -87.62077331542969],[41.874929479660025, -87.62077331542969]]),
    'result is equal to expected string value': function(result){
      assert.equal(result, '41.874929479660025,-87.62077331542969|41.874929479660025,-87.62077331542969');
    }
  },
  'Using a list of lat/lng points as a mixed array': {
    topic: gm.checkAndConvertArrayOfPoints([['41.874929479660025', [-87.62077331542969]],[41.874929479660025, ['-87.62077331542969']]]),
    'result is equal to expected string value': function(result){
      assert.equal(result, '41.874929479660025,-87.62077331542969|41.874929479660025,-87.62077331542969');
    }
  },
  'Using incorrect lat/lng input (an object)': {
    topic: function(){
      try{
        return [gm.checkAndConvertArrayOfPoints({'lat': 41.874929479660025, 'lng': -87.62077331542969}), false];
      }catch(e){
        return [e, true];
      }
    },
    'an exception was caught': function(result){
      assert.ok(result[1]);
    },
    'exception caught is an Error': function(result){
      assert.instanceOf(result[0], Error);
    },
    'error thrown was checkAndConvertArrayOfPoints\'s error': function(result){
      assert.ok(result[0].message.search('checkAndConvertArrayOfPoints') > 0);
    }
  }
}).export(module);

// vim: set expandtab sw=2:
