var should = require('should');

var jsonParser = require('../../../lib/utils/jsonParser');

describe('jsonParser', function() {

  describe('failures', function() {

    var invalidCallbacks = [null, undefined, false, 0, NaN, '', {}, new Object, new Date]

    invalidCallbacks.forEach(function(invalid) {
      it('should return false upon receiving ' + invalid + ' as callback', function() {
        (jsonParser(invalid).should.eql(false));
      })
    });

    it('should return parent error', function() {

      var parser = jsonParser(function(err, jsonObj) {
        should.not.exist(jsonObj);
        should.exist(err);
        err.should.eql('test error');
      });

      parser('test error');

    });

    it('should fail to parse an invalid json string', function() {

      var parser = jsonParser(function(err, jsonObj) {
        should.not.exist(jsonObj);
        should.exist(err);
        err.message.should.startWith('Unexpected token i');
      });

      parser(null, 'i am an invalid json string');

    });

    it('should call the callback only once if an error is thrown in callback execution', function() {

      var callbackCount = 0;

      var parser = jsonParser(function(err, jsonObj) {
        callbackCount += 1;
        if(!err) {
          var err = new Error('test error');
          throw err;
        }
      });

      try {
        parser(null, '{"a":"b"}');
      } catch(e) {
        // do nothing
      }

      callbackCount.should.eql(1);

    })

  });

  describe('success', function() {

    it('should parse a valid json string', function() {

      var parser = jsonParser(function(err, jsonObj) {
        should.not.exist(err);
        should.exist(jsonObj);
        jsonObj.should.have.property('a');
        jsonObj.a.should.eql('b');
      });

      parser(null, '{"a":"b"}');

    })

  });

});
