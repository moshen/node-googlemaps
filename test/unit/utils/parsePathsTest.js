var should = require('should');

var parsePaths = require('../../../lib/utils/parsePaths');


describe('parsePaths', function() {

  describe('faulres', function() {

    var invalidPaths = [null, undefined, false, 0, NaN, '', {}, new Object, new Date, function() {}];

    var calls = invalidPaths.map(
      function(invalid) {
        return function() {
          it('should not accept ' + invalid + ' as paths', function() {
            (function() { parsePaths( invalid ) }).should.throw('paths must be an array');
          });
        } 
      }
    );

    calls.forEach( function(checkCall){
      checkCall();
    });

    it ('should not accept a marker without points', function() {
      var input = [
        {
          color: '0x0000ff',
          weight: 5
        }
      ];

      (function() { parsePaths(input).should.throw('Each path must have an array of points') });
    });

  });

  describe('success', function() {

    it('should transform an array of paths into a string', function() {
      var input = [
        {
          points: [
            '40.737102,-73.990318',
            '40.749825,-73.987963',
            '40.752946,-73.987384',
            '40.755823,-73.986397'
          ],
          color: '0x0000ff',
          weight: 5
        },
        {
          color: '0x00000000',
          weight: 5,
          fillcolor: '0xFFFF0033',
          points: [
            '8th+Avenue+%26+34th+St,New+York,NY',
            '8th+Avenue+%26+42nd+St,New+York,NY',
            'Park+Ave+%26+42nd+St,New+York,NY,NY',
            'Park+Ave+%26+34th+St,New+York,NY,NY'
          ]
        }
      ];

      var output = "weight:5|color:0x0000ff|40.737102,-73.990318|40.749825,-73.987963|40.752946,-73.987384|40.755823,-73.986397|weight:5|color:0x00000000|fillcolor:0xFFFF0033|8th+Avenue+%26+34th+St,New+York,NY|8th+Avenue+%26+42nd+St,New+York,NY|Park+Ave+%26+42nd+St,New+York,NY,NY|Park+Ave+%26+34th+St,New+York,NY,NY";
      var result = parsePaths(input);
      result.should.equal(output);
    });

  });

});
