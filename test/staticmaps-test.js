var assert = require('assert'),
	gm = require('../lib/googlemaps');

//vows.describe().addBatch({
//	
//}).export(module);

markers = [
	{ 'location': '300 W Main St Lock Haven, PA' },
	{ 'location': '444 W Main St Lock Haven, PA', 'color': 'red', 'label': 'A' },
]

styles = [
	{ 'feature': 'road', 'element': 'all', 'rules': 
		{ 'hue': '0x00ff00' }
	}
]

gm.staticMap('444 W Main St Lock Haven PA', 15, '500x400', false, function(error, results) {
	console.log(results);
}, 'roadmap', markers, styles);