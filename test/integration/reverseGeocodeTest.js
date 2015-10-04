var should = require('should'),
  GoogleMapsAPI = require('../../lib/index'),
  config = require('../simpleConfig');

describe('reverseGeocode', function() {
  describe('Simple reverse geocode (41.850033 , -87.6500523)', function() {
    var result;
    before(function(done){
      var gm = new GoogleMapsAPI(config);
      gm.reverseGeocode({
        latlng: '41.850033,-87.6500523',
        language: 'en',
        result_type: 'postal_code',
        location_type: 'APPROXIMATE'
      }, function(err, data) {
        should.ifError(err);
        result = data;
        done();
      })
    });

    it('should return as a valid request', function() {
      should.equal(result.status , 'OK');
    });
    it('should return expected name (Pilsen)', function() {
      var locality = result.results[0].address_components.filter(function(el) {
        return el.types.indexOf('locality') !== -1;
      })[0];
      should.equal(locality.long_name , 'Chicago');
    });
  });
});
