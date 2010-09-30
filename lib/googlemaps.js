var qs = require('querystring'),
	http = require('http');

// http://code.google.com/apis/maps/documentation/geocoding/
exports.geocode = function(address , callback , sensor , bounds , region , language){
	var args = {
		'address': address
	}
	if(bounds){ args.bounds = bounds; }
	if(region){ args.region = region; }
	if(language){ args.language = language; }
	args.sensor = sensor || 'false';

	var path = '/maps/api/geocode/json?' + qs.stringify(args);
	
	makeRequest(path , returnObjectFromJSON(callback));
}

// http://code.google.com/apis/maps/documentation/geocoding/#ReverseGeocoding
exports.reverseGeocode = function(latlng , callback , sensor , language ){
	var args = {
		'latlng': latlng
	}
	if(language){ args.language = language; }
	args.sensor = sensor || 'false';
	
	var path = '/maps/api/geocode/json?' + qs.stringify(args);
	
	makeRequest(path , returnObjectFromJSON(callback));
}

// http://code.google.com/apis/maps/documentation/directions/
exports.directions = function(origin , destination , callback , sensor , mode , waypoints , alternatives , avoid , units , language){
	var args = {
		'origin': origin,
		'destination': destination
	}
	args.sensor = sensor || 'false';
	if(mode){ args.mode = mode; }
	if(waypoints){ args.waypoints = waypoints; }
	if(alternatives){ args.alternatives = alternatives; }
	if(avoid){ args.avoid = avoid; }
	if(units){ args.units = units; }
	if(language){ args.language = language; }
	
	var path = '/maps/api/directions/json?' + qs.stringify(args);
	
	makeRequest(path , returnObjectFromJSON(callback));
}

// http://code.google.com/apis/maps/documentation/elevation/
// http://code.google.com/apis/maps/documentation/elevation/#Locations
exports.elevationFromLocations = function(locations , callback , sensor){
	var args = {
		'locations': locations
	}
	args.sensor = sensor || 'false';
	
	var path = '/maps/api/elevation/json?' + qs.stringify(args);
	
	makeRequest(path , returnObjectFromJSON(callback));
}

// http://code.google.com/apis/maps/documentation/elevation/#Paths
exports.elevationFromPath = function(path , samples , callback , sensor){
	var args = {
		'path': path,
		'samples': samples
	}
	args.sensor = sensor || 'false';
	
	var reqPath = '/maps/api/elevation/json?' + qs.stringify(args);
	
	makeRequest(reqPath , returnObjectFromJSON(callback));
}

//  Helper function to check and convert an array of points, be it strings/numbers/etc
//    into the format used by Google Maps for representing lists of latitude/longitude pairs
exports.checkAndConvertArrayOfPoints = function(input){
	switch(typeof(input)){
		case 'object':
			if(input instanceof Array){
				var output = [];
				for(var i = 0; i < input.length; i++){
					output.push(exports.checkAndConvertPoint(input[i]));
				}
				return output.join('|');
			}
			break;
		case 'string':
			return input;
	}
	throw(new Error("Unrecognized input: checkAndConvertArrayOfPoints accepts Arrays and Strings"));
}

//  Helper function to check and convert an points, be it strings/arrays of numbers/etc
//    into the format used by Google Maps for representing latitude/longitude pairs
exports.checkAndConvertPoint = function(input){
	switch(typeof(input)){
		case 'object':
			if(input instanceof Array){
				return input[0].toString() + ',' + input[1].toString();
			}
			break;
		case 'string':
			return input;
	}
	throw(new Error("Unrecognized input: checkAndConvertPoint accepts Arrays of Numbers and Strings"));
}

//  Wraps the callback function to convert the output to a javascript object
var returnObjectFromJSON = function(callback){
	return function(err, jsonString){
		callback(err , JSON.parse(jsonString));
	}
}

// Makes the request to google maps
var makeRequest = function(path , callback){
	var headers = {
		'Content-Type':'application/json',
		'host': 'maps.google.com'
	}
	
	var client = http.createClient(80, 'maps.google.com');
	var request = client.request('GET', path , headers);
	
	var data = '';
	request.on('response', function (response) {
		response.on('data', function (chunk) {
			data += chunk;
		});
		response.on('end', function () {
			if(response.statusCode == 200){
				callback(null, data);
			}else{
				callback(new Error('Response Status code: ' + response.statusCode), data);
			}
		});
		response.on('error', function (error) {
			callback(error , data);
		});
	});
	request.end();
}