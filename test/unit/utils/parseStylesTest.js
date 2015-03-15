var should = require('should');

var parseStyles = require('../../../lib/utils/parseStyles');


describe('parseStyles', function() {

  describe('faulres', function() {

    var invalidStyles = [null, undefined, false, 0, NaN, '', {}, new Object, new Date, function() {}];

    var calls = invalidStyles.map(
      function(invalid) {
        return function() {
          it('should not accept ' + invalid + ' as styles', function() {
            (function() { parseStyles( invalid ) }).should.throw('styles must be an array');
          });
        } 
      }
    );

    calls.forEach( function(checkCall){
      checkCall();
    });

  });

  describe('success', function() {

    it('should transform an array of styles into a string', function() {
      var input = [
        {
          'feature': 'road',
          'element': 'all',
          'rules': {
            'hue': '0x00ff00'
          }
        },
        {
          'feature': 'landscape',
          'element': 'all',
          'rules': {
            'visibility': 'off'
          }
        }
      ];

      var output = "feature:road|element:all|hue:0x00ff00|feature:landscape|element:all|visibility:off";

      var result = parseStyles(input);
      result.should.equal(output);
    });

  });

});
