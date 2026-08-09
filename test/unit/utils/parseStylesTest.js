var should = require('should');

var parseStyles = require('../../../lib/utils/parseStyles');


describe('parseStyles', function() {

  describe('failures', function() {

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

    it('should transform an array of styles into an array of strings', function() {
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

      var output = [
          "feature:road|element:all|hue:0x00ff00",
          "feature:landscape|element:all|visibility:off"
      ];

      var result = parseStyles(input);
      result.should.eql(output);
    });

    it('should support Google\'s newer style format (featureType/elementType/stylers)', function() {
      var input = [
        {
          'elementType': 'geometry',
          'stylers': [
            { 'color': '#1d2c4d' }
          ]
        },
        {
          'featureType': 'administrative.country',
          'elementType': 'geometry.stroke',
          'stylers': [
            { 'color': '#4b6878' }
          ]
        },
        {
          'featureType': 'water',
          'stylers': [
            { 'visibility': 'off' }
          ]
        }
      ];

      var output = [
        'element:geometry|color:0x1d2c4d',
        'feature:administrative.country|element:geometry.stroke|color:0x4b6878',
        'feature:water|visibility:off'
      ];

      var result = parseStyles(input);
      result.should.eql(output);
    });

  });

});
