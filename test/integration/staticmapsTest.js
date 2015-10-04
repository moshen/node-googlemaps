var should = require('should'),
  GoogleMapsAPI = require('../../lib/index')
  config = require('../simpleConfig');

describe('staticmaps', function() {
  describe('Complex static map (Lock Haven, PA)', function() {
    var options = {
      markers: [
        {
          location: '300 W Main St Lock Haven, PA',
          label   : 'A',
          color   : 'green',
          shadow  : true
        },
        {
          location: '444 W Main St Lock Haven, PA',
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
    };

    var gm = new GoogleMapsAPI(config);

    describe('URL', function() {
      var params = {
        center: '444 W Main St Lock Haven PA',
        zoom: 15,
        size: '500x400',
        maptype: 'roadmap',
        markers: options.markers,
        style: options.style,
        path: options.path
      };

      it('should return the expected static map URL', function(){
        should.equal(gm.staticMap(params), "https://maps.googleapis.com/maps/api/staticmap?"+
                              "center=444%20W%20Main%20St%20Lock%20Haven%20PA&"+
                              "zoom=15&size=500x400&maptype=roadmap&"+
                              "markers=color%3Agreen%7Clabel%3AA%7Cshadow%3Atrue%7C300%20W%20Main%20St%20Lock%20Haven%2C%20PA&"+
                              "markers=icon%3Ahttp%3A%2F%2Fchart.apis.google.com%2Fchart%3Fchst%3Dd_map_pin_icon%26chld%3Dcafe%257C996600%7C444%20W%20Main%20St%20Lock%20Haven%2C%20PA&"+
                              "path=weight%3A5%7Ccolor%3A0x0000ff%7Cenc%3A%7BbbzFfyvwMnFwP&"+
                              "style=feature%3Aroad%7Celement%3Aall%7Chue%3A0x00ff00&key=AIzaSyD68KmxQFlbJuxJ6r2DLBBNmK4aY7z5xpo");
      });
    });

    describe('PNG data', function() {
      var result;
      before(function(done){
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
        gm.staticMap(params, function(err, data) {
          should.ifError(err);
          result = data;
          done();
        });
      });

      it('should return the expected static map PNG data', function(){
        // Look for the PNG header only
        var buf = new Buffer(result, 'binary');
        should.equal('89504e47', buf.toString('hex').substr(0,8));
      });
    });
  });
});
