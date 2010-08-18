var vows = require('vows'),
	assert = require('assert'),
	gm = require('../lib/googlemaps');

vows.describe('elevationFromLocations').addBatch({
	'Simple elevationFromLocations request (41.850033,-87.6500523)': {
		topic: function(){
			gm.elevationFromLocations('41.850033,-87.6500523', this.callback, 'false');
		},
		'returns as a valid request': function(err, result){
			assert.equal(result.status , 'OK');
		},
		'returns the expected elevation for Chicago': function(err, result){
			assert.equal(result.results[0].elevation , 178.6981049);
		}
	}
}).export(module);

/* Elevation from location query results
{
   "status":"OK",
   "results":[
      {
         "location":{
            "lat":41.850033,
            "lng":-87.6500523
         },
         "elevation":178.6981049
      }
   ]
}
*/

vows.describe('elevationFromPath').addBatch({
	'Simple elevationFromPath request (43.07333,-89.4026|41.850033,-87.6500523)': {
		topic: function(){
			gm.elevationFromPath('43.07333,-89.4026|41.850033,-87.6500523', '10', this.callback, 'false');
		},
		'returns as a valid request': function(err, result){
			assert.equal(result.status , 'OK');
		},
		'returns the expected number of samples': function(err, result){
			assert.equal(result.results.length , 10);
		},
		'returns the expected elevation for Chicago': function(err, result){
			assert.equal(result.results[9].elevation , 178.6981049);
		}
	}
}).export(module);

/* Elevation from path query results
{
   "status":"OK",
   "results":[
      {
         "location":{
            "lat":43.07333,
            "lng":-89.4026
         },
         "elevation":271.6759949
      },
      {
         "location":{
            "lat":42.9387406,
            "lng":-89.2044638
         },
         "elevation":259.8457336
      },
      {
         "location":{
            "lat":42.8038109,
            "lng":-89.0071931
         },
         "elevation":269.4146118
      },
      {
         "location":{
            "lat":42.6685442,
            "lng":-88.810782
         },
         "elevation":285.5769958
      },
      {
         "location":{
            "lat":42.5329433,
            "lng":-88.6152249
         },
         "elevation":300.2436218
      },
      {
         "location":{
            "lat":42.3970114,
            "lng":-88.4205162
         },
         "elevation":259.1387939
      },
      {
         "location":{
            "lat":42.2607515,
            "lng":-88.2266502
         },
         "elevation":226.3040619
      },
      {
         "location":{
            "lat":42.1241665,
            "lng":-88.0336213
         },
         "elevation":228.6080322
      },
      {
         "location":{
            "lat":41.9872593,
            "lng":-87.8414239
         },
         "elevation":193.4155426
      },
      {
         "location":{
            "lat":41.850033,
            "lng":-87.6500523
         },
         "elevation":178.6981049
      }
   ]
}
*/