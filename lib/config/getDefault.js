/**
 * Returns the default configuration object
 */
 module.exports = function() {

  return {
    'encode-polylines': true,
    'google-client-id': null,
    'key':              null,
    'proxy':            null,
    'secure':           false,
    'stagger-time':     200,
    set 'google-private-key'(value) {
      if (typeof value !== 'undefined' && value !== null) {
        // Google private keys are URL friendly base64, needs to be replaced with base64 valid characters
        this.googlePrivateKey = value.replace(/-/g,'+').replace(/_/g,'/');
        this.googlePrivateKey = new Buffer(this.googlePrivateKey, 'base64');
      } else {
        this.googlePrivateKey = null;
      }
    },
    get 'google-private-key'() {
      return this.googlePrivateKey || null;
    }
  };

};
