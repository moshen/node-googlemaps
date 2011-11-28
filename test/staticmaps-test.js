var assert = require('assert'),
	gm = require('../lib/googlemaps');

//vows.describe().addBatch({
//	
//}).export(module);

markers = [
	{ 'location': '440 W Main St Lock Haven, PA', 'color': 'blue', 'label': 'C', 'size': 'tiny' },
	{ 'location': '444 W Main St Lock Haven, PA', 'color': 'red', 'label': 'A' },
]

gm.staticMap('444 W Main St Lock Haven PA', 15, '500x400', false, function(error, results) {
	console.log(results);
}, 'roadmap', markers);