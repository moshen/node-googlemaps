var qs = require('querystring'),
    request = require('request'),
    crypto = require("crypto"),
    url = require('url');

var proxy;
var google_client_id;
var google_private_key;
exports.setProxy = function(uri) {
	proxy = uri;
};
exports.setBusinessSpecificParameters = function(client_id, private_key) {
  google_client_id = client_id;
  google_private_key = private_key;
};

// http://code.google.com/apis/maps/documentation/places/
exports.places = function(latlng, radius, key, callback, sensor, types, lang, name) {
	var args = {
		location: latlng,
		radius: radius,
		key: key
	};
	if (types) args.types = types;
	if (lang) args.lang = lang;
	if (name) args.name = name;
	args.sensor = sensor || 'false';

	var path = '/maps/api/place/search/json?' + qs.stringify(args);
	return makeRequest(path, true, returnObjectFromJSON(callback));
};

exports.placeDetails = function(referenceId, key, callback, sensor, lang) {
	var args = { 
		reference: referenceId,
		key: key
	};
	if (lang) args.lang = lang;
	args.sensor = sensor || 'false';
	
	var path = '/maps/api/place/details/json?' + qs.stringify(args);
	return makeRequest(path, true, returnObjectFromJSON(callback));
};

// http://code.google.com/apis/maps/documentation/geocoding/
exports.geocode = function(address , callback , sensor , bounds , region , language){
	var args = {
		'address': address
	};
	if(bounds){ args.bounds = bounds; }
	if(region){ args.region = region; }
	if(language){ args.language = language; }
	args.sensor = sensor || 'false';

	var path = '/maps/api/geocode/json?' + qs.stringify(args);
	
	return makeRequest(path, false, returnObjectFromJSON(callback));
};

// http://code.google.com/apis/maps/documentation/geocoding/#ReverseGeocoding
exports.reverseGeocode = function(latlng , callback , sensor , language ){
	var args = {
		'latlng': latlng
	};
	if(language){ args.language = language; }
	args.sensor = sensor || 'false';
	
	var path = '/maps/api/geocode/json?' + qs.stringify(args);
	
	return makeRequest(path, false, returnObjectFromJSON(callback));
};

// http://code.google.com/apis/maps/documentation/distancematrix/
exports.distance = function(origins, destinations, callback, sensor, mode, alternatives, avoid, units, language){
	var args = {
		'origins': origins,
		'destinations': destinations
	};
	args.sensor = sensor || 'false';
	if(mode){ args.mode = mode; }
	if(avoid){ args.avoid = avoid; }
	if(units){ args.units = units; }
	if(language){ args.language = language; }
	var path = '/maps/api/distancematrix/json?' + qs.stringify(args);
	return makeRequest(path, false, returnObjectFromJSON(callback));
};


// http://code.google.com/apis/maps/documentation/directions/
exports.directions = function(origin , destination , callback , sensor , mode , waypoints , alternatives , avoid , units , language){
	var args = {
		'origin': origin,
		'destination': destination
	};
	args.sensor = sensor || 'false';
	if(mode){ args.mode = mode; }
	if(waypoints){ args.waypoints = waypoints; }
	if(alternatives){ args.alternatives = alternatives; }
	if(avoid){ args.avoid = avoid; }
	if(units){ args.units = units; }
	if(language){ args.language = language; }
	
	var path = '/maps/api/directions/json?' + qs.stringify(args);
	
	return makeRequest(path, false, returnObjectFromJSON(callback));
};

// http://code.google.com/apis/maps/documentation/elevation/
// http://code.google.com/apis/maps/documentation/elevation/#Locations
exports.elevationFromLocations = function(locations , callback , sensor){
	var args = {
		'locations': locations
	};
	args.sensor = sensor || 'false';
	
	var path = '/maps/api/elevation/json?' + qs.stringify(args);
	
	return makeRequest(path, false, returnObjectFromJSON(callback));
};

// http://code.google.com/apis/maps/documentation/elevation/#Paths
exports.elevationFromPath = function(path , samples , callback , sensor){
	var args = {
		'path': path,
		'samples': samples
	};
	args.sensor = sensor || 'false';
	
	var reqPath = '/maps/api/elevation/json?' + qs.stringify(args);
	
	return makeRequest(reqPath, false, returnObjectFromJSON(callback));
};

// http://code.google.com/apis/maps/documentation/staticmaps
exports.staticMap = function(center , zoom , size , callback , sensor ,
                             maptype , markers, styles, paths){
	var args = {
		'center': center,
		'zoom': zoom,
		'size': size
	};
	var i , k;

	if(maptype){ args.maptype = maptype; }
	if(markers){
		args.markers = [];
		for(i=0; i < markers.length; i++) {
			var marker = '';
			if(markers[i].size)    { marker += '|size:'   + markers[i].size;   }
			if(markers[i].color)   { marker += '|color:'  + markers[i].color;  }
			if(markers[i].label)   { marker += '|label:'  + markers[i].label;  }
			if(markers[i].icon)    { marker += '|icon:'   + markers[i].icon;   }
			if(markers[i].shadow)  { marker += '|shadow:' + markers[i].shadow; }
			if(markers[i].location){ marker += '|'      + markers[i].location; }
			args.markers[i] = marker;
		}
	}
	if(styles){
		args.style = [];
		for(i=0; i < styles.length; i++) {
			var new_style = '';
			if(styles[i].feature){ new_style += '|feature:' + styles[i].feature; }
			if(styles[i].element){ new_style += '|element:' + styles[i].element; }
			
			var rules = styles[i].rules;
			
			if(rules){ 
				for(k in rules) {
					var rule = rules[k];
					new_style += '|' + k + ':' + rule;
				}
			}
			args.style[i] = new_style;
		}
	}
	if(paths){
		args.path = [];
		for(i=0; i < paths.length; i++) {
			var new_path = '';
			if(paths[i].weight)   { new_path += '|weight:' + paths[i].weight; }
			if(paths[i].color)    { new_path += '|color:' + paths[i].color;   }
			if(paths[i].fillcolor){ new_path += '|fillcolor:' + paths[i].fillcolor; }
			
			var points = paths[i].points;

			if(points){
				for(k=0; k < points.length; k++) {
					new_path += '|' + points[k];
				}
			}
			args.path[i] = new_path.replace(/^\|/, '');
		}
	}
	args.sensor = sensor || 'false';

	var path = '/maps/api/staticmap?' + qs.stringify(args);

	return makeRequest( path , false , callback , 'binary' );
};

// http://code.google.com/apis/maps/documentation/streetview
exports.streetView = function(size , location , callback , sensor ,
                             heading , fov , pitch){
  var args = {
    'size': size,
    'location': location
  };
  if(heading){
    heading = parseInt(heading);
    if( heading >= 0 && heading <= 360)
      args.heading = heading;
  }
  if(fov){
    fov = parseInt(fov);
    if( fov >= 0 && fov <= 120)
      args.fov = fov;
  }
  if(pitch){
    pitch = parseInt(pitch);
    if( pitch >= -90 && pitch <= 90)
      args.pitch = pitch;
  }
  args.sensor = sensor || 'false';

  var path = '/maps/api/streetview?' + qs.stringify(args);

  return makeRequest( path , false , callback , 'binary' );
};

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
};

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
};

//  Wraps the callback function to convert the output to a javascript object
var returnObjectFromJSON = function(callback){
  if( typeof( callback ) === 'function' ){
  	return function(err, jsonString){
  		callback(err , JSON.parse(jsonString));
  	};
	}
	return false;
};

// Sign any google request with Business/Premier signature
var signGoogleRestApiRequest = function(urlToParse){
  // Parse url so we can get just the pathname + search portion of the url /p/a/t/h?query=string also append client id
  var urlObj = url.parse(urlToParse + "&client="+google_client_id);
  // Google private keys are URL friendly base64, needs to be replaced with base64 valid characters
  var private_key = google_private_key.replace(/-/g,'+').replace(/_/g,'/');
  // Create signer object passing in the key, telling it the key is in base64 format
  var signer = crypto.createHmac('sha1', new Buffer(private_key, 'base64'));
  // Get the signature, telling it to return the sig in base64 format
  var signature = signer.update(urlObj.path).digest('base64');
  // Format the base64 sig in the URL friendly format required by Google
  signature = signature.replace(/\+/g,'-').replace(/\//g,'_');
  // Add the signature to the url (there should already always be at least the client id)
  urlObj.search = urlObj.search + "&signature=" + signature;
  
  return url.format(urlObj);
}

// Makes the request to Google Maps API.
// If secure is true, uses https. Otherwise http is used.
var makeRequest = function(path, secure, callback, encoding){
	var options = {
		uri: (secure ? 'https' : 'http') + '://maps.googleapis.com' + path
	};
	if( google_client_id && google_private_key ) {
	  options.uri = signGoogleRestApiRequest(options.uri);
	}
	if( encoding ) {
		options.encoding = encoding;
	}
	if( proxy ) {
		options.proxy = proxy;
	}
  if( typeof( callback ) === 'function' ){
  	request(options, function (error, res, data) {
  		if( error ) {
  			return callback(error);
  		}
  		if (res.statusCode === 200) {
  			return callback(null, data);
  		}
  		return callback(new Error("Response status code: " + res.statusCode), data);
  	});
	}
	
	return options.uri;
};
