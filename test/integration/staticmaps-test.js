var vows = require('vows'),
  assert = require('assert'),
  GoogleMapsAPI = require('../../lib/index')
  config = require('../simpleConfig');


vows.describe('staticmaps').addBatch({
  'Complex static map (Lock Haven, PA)': {
    topic: {
      markers: [
        { location: '300 W Main St Lock Haven, PA' },
        {
          location: '444 W Main St Lock Haven, PA',
          color   : 'red',
          label   : 'A',
          shadow  : 'false',
          icon    : 'http://chart.apis.google.com/chart?chst=d_map_pin_icon&chld=cafe%7C996600'
        }
      ],

      style: [
        {
          feature: 'road',
          element: 'all',
          rules: {
            hue: '0x00ff00'
          }
        }
      ],

      path: [
        {
          color: '0x0000ff',
          weight: '5',
          points: [
            '41.139817,-77.454439',
            '41.138621,-77.451596'
          ]
        }
      ]
    }
    ,
    URL: {
      topic: function(options){
        var gm = new GoogleMapsAPI(config);
        var params = {
          center: '444 W Main St Lock Haven PA',
          zoom: 15,
          size: '500x400',
          maptype: 'satellite',
          markers: options.markers,
          style: options.style,
          path: options.path
        };
        return gm.staticMap(params, this.callback);
      },
      'returns the expected static map URL': function(err, data) {
        var buf = new Buffer(data, 'binary');
        assert.equal('89504e47', buf.toString('hex').substr(0,8));
      }
    }
    ,
    'PNG data': {
      topic: function(options){
        var gm = new GoogleMapsAPI(config);
        var params = {
          center: '444 W Main St Lock Haven PA',
          zoom: 15,
          format: 'png',
          size: '500x400',
          maptype: 'roadmap',
          markers: options.markers,
          style: options.style,
          path: options.path
        };
        gm.staticMap(params, this.callback);
      },
      'returns the expected static map PNG data': function(err, data){
        // Look for the PNG header only
        var buf = new Buffer(data, 'binary');
        assert.equal('89504e47', buf.toString('hex').substr(0,8));
      }
    }
  }
}).export(module);
