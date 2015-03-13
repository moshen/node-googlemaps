/**
 * Returns the default configuration object
 */
 module.exports = function() {

  return {
    encode_polylines: true,
    google_client_id: null,
    key:              null,
    proxy:            null,
    secure:           false,
    stagger_time:     200,
    set google_private_key(value) {
      if (typeof value !== 'undefined' && value !== null) {
        // Google private keys are URL friendly base64, needs to be replaced with base64 valid characters
        this.googlePrivateKey = value.replace(/-/g,'+').replace(/_/g,'/');
        this.googlePrivateKey = new Buffer(this.googlePrivateKey, 'base64');
      } else {
        this.googlePrivateKey = null;
      }
    },
    get google_private_key() {
      return this.googlePrivateKey || null;
    }
  };

};
