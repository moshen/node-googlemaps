var qs = require('querystring'),
	http = require('http');

var googlemaps = exports;

googlemaps.base = 'maps.google.com';
googlemaps.endpoints = {
	geocode: '/maps/api/geocode/json',
	directions: '/maps/api/directions/json',
	elevation: '/maps/api/elevation/json'
}


exports.geocode = function(address , callback , sensor){
	args = {
		'address': address
	}
	args.sensor = sensor || 'false';

	var path = googlemaps.endpoints.geocode + '?' + qs.stringify(args);
	
	makeRequest(path , returnObjectFromJSON(callback));
}

exports.reverseGeocode = function(latlng , callback , sensor , bounds , region , language ){
	var args = {
		'latlng': latlng
	}
	if(bounds){ args.bounds = bounds; }
	if(region){ args.region = region; }
	if(language){ args.language = language; }
	args.sensor = sensor || 'false';
	
	var path = googlemaps.endpoints.geocode + '?' + qs.stringify(args);
	
	makeRequest(path , returnObjectFromJSON(callback));
}

exports.directions = function(origin , destination , callback , sensor , mode , waypoints , alternatives , avoid , units , language){
	var args = {
		'origin': origin,
		'destination': destination
	}
	args.sensor = sensor || 'false';
	if(mode){ args.mode = mode; }
	if(waypoints){ args.waypoints = waypoints; }
	if(aleternatives){ args.aleternatives = aleternatives; }
	if(avoid){ args.avoid = avoid; }
	if(units){ args.units = units; }
	if(language){ args.language = language; }
	
	var path = googlemaps.endpoints.directions + '?' + qs.stringify(args);
	
	makeRequest(path , returnObjectFromJSON(callback));
}

exports.elevationFromLocations = function(locations , callback , sensor){
	var args = {
		'locations': locations
	}
	args.sensor = sensor || 'false';
	
	var path = googlemaps.endpoints.elevation + '?' + qs.stringify(args);
	
	makeRequest(path , returnObjectFromJSON(callback));
}

exports.elevationFromPath = function(path , samples , callback , sensor){
	var args = {
		'path': path,
		'samples': samples
	}
	args.sensor = sensor || 'false';
	
	var reqPath = googlemaps.endpoints.elevation + '?' + qs.stringify(args);
	
	makeRequest(reqPath , returnObjectFromJSON(callback));
}

var returnObjectFromJSON = function(callback){
	return function(jsonString){
		callback(JSON.parse(jsonString));
	}
}

var makeRequest = function(path , callback){
	var headers = {
		'Content-Type':'application/json',
		'host': googlemaps.base
	}
	
	var client = http.createClient(80, googlemaps.base);
	var request = client.request('GET', path , headers);
	
	var data = '';
	request.on('response', function (response) {
		response.on('data', function (chunk) {
			data += chunk;
		});
		response.on('end', function () {
			callback(data);
		});
	});
	request.end();
}