var GoogleMapsAPI = require('../../lib/index');
var config = require('../simpleConfig');
var should = require('should');

describe('timezone', function() {

  var gm = new GoogleMapsAPI(config);

  var params = {
    location: '-33.86,151.20',
    timestamp: 1234567890
  };

  it('should return a valid response', function(done) {
    gm.timezone(params, function(err, result) {
      should.not.exist(err);
      should.exist(result);
      result.status.should.equal('OK');
      done();
    });
  });

  // Google response
  // {
  //   dstOffset: 3600,
  //   rawOffset: 36000,
  //   status: 'OK',
  //   timeZoneId: 'Australia/Sydney',
  //   timeZoneName: 'Australian Eastern Daylight Time'
  // }
  it('should return the expected timezone', function(done) {
    gm.timezone(params, function(err, result) {
      should.not.exist(err);
      should.exist(result);
      should.exist(result.dstOffset);
      should.exist(result.rawOffset);
      should.exist(result.timeZoneId);
      should.exist(result.timeZoneName);
      result.timeZoneId.should.equal('Australia/Sydney');
      result.timeZoneName.should.equal('Australian Eastern Daylight Time');
      result.rawOffset.should.equal(36000);
      result.dstOffset.should.equal(3600);
      done();
    });
  });

  // TODO we should add more tests for edge cases Timezones

});
