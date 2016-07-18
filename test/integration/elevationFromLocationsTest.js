var  should = require('should'),
  GoogleMapsAPI = require('../../lib/index')
  config = require('../simpleConfig');

describe('elevationFromLocations', function() {
  var gm = new GoogleMapsAPI(config);

  it('Simple elevationFromLocations request (41.850033,-87.6500523)', function() {
    var result;
    before(function(done){
      gm.elevationFromLocations({
        locations: '41.850033,-87.6500523'
      }, function(err, data) {
        should.ifError(err);
        result = data;
        done();
      });
    });

    it('returns as a valid request', function(){
      should.equal(result.status , 'OK');
    });
    it('returns the expected elevation for Chicago', function(){
      should.notEqual(result.results, false);
      should.notEqual(result.results.length, 0);
      should.equal(Math.round(result.results[0].elevation) , 179);
    });
  });
});
