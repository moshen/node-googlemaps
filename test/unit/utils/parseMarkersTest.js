var should = require('should');

var parseMarkers = require('../../../lib/utils/parseMarkers');


describe('parseMarkers', function() {

  describe('faulres', function() {

    var invalidMarkers = [null, undefined, false, 0, NaN, '', {}, new Object, new Date, function() {}];

    var calls = invalidMarkers.map(
      function(invalid) {
        return function() {
          it('should not accept ' + invalid + ' as markers', function() {
            (function() { parseMarkers( invalid ) }).should.throw('markers must be an array');
          });
        } 
      }
    );

    calls.forEach( function(checkCall){
      checkCall();
    });

    it ('should not accept a marker without location', function() {
      var input = [
        { 'location': '300 W Main St Lock Haven, PA' },
        {
          'color'   : 'red',
          'label'   : 'A',
          'shadow'  : 'false',
          'icon'    : 'http://chart.apis.google.com/chart?chst=d_map_pin_icon&chld=cafe%7C996600'
        }
      ];

      (function() { parseMarkers(input).should.throw('Each marker must have a location') });
    });

  });

  describe('success', function() {

    it('should transform an array of markers into a string', function() {
      var input = [
        { 'location': '300 W Main St Lock Haven, PA' },
        {
          'location': '444 W Main St Lock Haven, PA',
          'color'   : 'red',
          'label'   : 'A',
          'shadow'  : 'false',
          'icon'    : 'http://chart.apis.google.com/chart?chst=d_map_pin_icon&chld=cafe%7C996600'
        }
      ];

      var output = "300 W Main St Lock Haven, PA| color:red|label:A|icon:http://chart.apis.google.com/chart?chst=d_map_pin_icon&chld=cafe%7C996600|shadow:false|444 W Main St Lock Haven, PA";

      var result = parseMarkers(input);
      result.should.equal(output);
    });

  });

});
