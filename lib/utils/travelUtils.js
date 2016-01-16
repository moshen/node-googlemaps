var travelUtils = {}

var _err = function(err) {
  return { valid: false, error: err }
}

/**
 * Validates all arguments shared by directions and distance-matrix services
 *
 * Returns object with result and error if present
 */
travelUtils.validateCommonArgs = function(args) {
  if (args.mode != null) {
    args.mode = args.mode.toLowerCase();
    if (args.mode !== 'driving' && args.mode !== 'walking' && args.mode !== 'bicycling' && args.mode !== 'transit') {
      return _err('Invalid transport mode: '+args.mode+'. Valid params.mode are [driving|walking|bicycling|transit]');
    }
    if (args.mode == 'transit') {
      if (args.departure_time == null && args.arrival_time == null) {
        return _err('When specifying params.mode = transit either params.departure_time or params.arrival_time must be provided');
      }
      if (args.waypoints != null) {
        return _err('It is not possible to specify waypoints when params.mode = transit');
      }
    } 
  }

  if (args.avoid != null) {
    args.avoid = args.avoid.toLowerCase();
    if (args.avoid !== 'tolls' && args.avoid !== 'highways' && args.avoid !== 'ferries') {
      return _err('Invalid params.avoid: '+args.avoid+'. Valid params.avoid are [tolls|highways|ferries]');
    }
  }

  if (args.units != null) {
    args.units = args.units.toLowerCase();
    if (args.units !== 'metric' && args.units !== 'imperial') {
      return _err('Invalid params.units: '+args.units+'. Valid params.units are [metric|imperial]');
    }
  }

  if (args.departure_time != null || args.arrival_time != null) {
    if (args.mode && args.mode !== 'driving' && args.mode !== 'transit') {
      return _err('params.departure_time or params.arrival_time can only be specified when params.mode = [driving|transit]');
    }
  }

  if (args.traffic_model != null) {
    if (args.mode && args.mode !== 'driving') {
      return _err('params.traffic_model can only be specified when params.mode = ["driving"|null]');
    }
    if (args.departure_time == null || args.departure_time < (new Date()).getTime()) {
      return _err('params.departure_time must be set and be after current time when params.traffic_model is set');
    }
    if (args.traffic_model !== 'best_guess' && args.traffic_model !== 'pessimistic' && args.traffic_model !== 'optimistic') {
      return _err('Invalid params.traffic_model: '+args.traffic_model+'. Valid params.traffic_model are [best_guess|pessimistic|optimistic]');
    }
  }

  return { valid: true }
}

travelUtils.convertTargetTimes = function(args) {
  // convert departure_time in UNIX timestamp
  if (args.departure_time != null) {
    args.departure_time = Math.floor( args.departure_time/1000 )
  }

  // convert arrival_time in UNIX timestamp
  if (args.arrival_time != null) {
    args.arrival_time = Math.floor( args.arrival_time/1000 )
  }
}

module.exports = travelUtils;