var vows = require('vows'),
  assert = require('assert'),
  crypto = require('crypto'),
  gm = require('../lib/googlemaps');

vows.describe('staticmaps').addBatch({
  'Complex static map (Lock Haven, PA)': {
    topic: {
      'markers': [
        { 'location': '300 W Main St Lock Haven, PA' },
        { 'location': '444 W Main St Lock Haven, PA',
          'color'   : 'red',
          'label'   : 'A',
          'shadow'  : 'false',
          'icon'    : 'http://chart.apis.google.com/chart?chst=d_map_pin_icon&chld=cafe%7C996600'
        }
      ],

      'styles': [
        { 'feature': 'road', 'element': 'all', 'rules':
          { 'hue': '0x00ff00' }
        }
      ],

      'paths': [
        { 'color': '0x0000ff', 'weight': '5', 'points':
          [ '41.139817,-77.454439', '41.138621,-77.451596' ]
        }
      ]
    },

    'URL': {
      topic: function(options){
        gm.config('encode-polylines', false);
        return gm.staticMap('444 W Main St Lock Haven PA', 15, '500x400',
                            false, false, 'roadmap', options.markers, options.styles, options.paths);
      },
      'returns the expected static map URL': function(result){
        assert.equal(result , "http://maps.googleapis.com/maps/api/staticmap?center=444%20W%20Main%20St%20" +
                              "Lock%20Haven%20PA&zoom=15&size=500x400&maptype=roadmap&markers=%7C300%20W%2" +
                              "0Main%20St%20Lock%20Haven%2C%20PA&markers=%7Ccolor%3Ared%7Clabel%3AA%7Cicon" +
                              "%3Ahttp%3A%2F%2Fchart.apis.google.com%2Fchart%3Fchst%3Dd_map_pin_icon%26chl" +
                              "d%3Dcafe%257C996600%7Cshadow%3Afalse%7C444%20W%20Main%20St%20Lock%20Haven%2" +
                              "C%20PA&style=%7Cfeature%3Aroad%7Celement%3Aall%7Chue%3A0x00ff00&path=weight" +
                              "%3A5%7Ccolor%3A0x0000ff%7C41.139817%2C-77.454439%7C41.138621%2C-77.451596&s" +
                              "ensor=false");
      }
    },

    'PNG data': {
      topic: function(options){
        gm.staticMap('444 W Main St Lock Haven PA', 15, '500x400', this.callback, false, 'roadmap', options.markers, options.styles, options.paths);
      },
      'returns the expected static map PNG data': function(err, data){
        var pos = data.indexOf('PNG');
        assert.notEqual(pos, -1);
      }
    }
  }
}).export(module);

// vim: set expandtab sw=2:
