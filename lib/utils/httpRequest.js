/**
 * Minimal drop-in replacement for the `request` module using native fetch.
 *
 * Supports the subset of the request API used by this library:
 *   request(options, callback)
 *
 * options:
 *   - uri:      the full URL to request
 *   - encoding: response encoding (null = Buffer, string = that encoding,
 *               undefined = utf8 string)
 *   - proxy:    optional proxy URL (HTTP proxy only)
 *
 * callback(err, res, body) where res has statusCode and headers.
 */
module.exports = function(options, callback) {

  var fetchOptions = { method: 'GET' };

  if (options.proxy) {
    var dispatcher = createProxyDispatcher(options.proxy);
    if (dispatcher) fetchOptions.dispatcher = dispatcher;
  }

  fetch(options.uri, fetchOptions)
    .then(function(res) {
      var statusCode = res.status;
      var headers = {};
      res.headers.forEach(function(value, key) {
        headers[key] = value;
      });

      var bodyPromise;
      if (options.encoding === null) {
        bodyPromise = res.arrayBuffer().then(function(buf) {
          return Buffer.from(buf);
        });
      } else if (options.encoding === 'binary') {
        bodyPromise = res.arrayBuffer().then(function(buf) {
          return Buffer.from(buf).toString('latin1');
        });
      } else {
        bodyPromise = res.text();
      }

      return bodyPromise.then(function(body) {
        callback(null, { statusCode: statusCode, headers: headers }, body);
      });
    })
    .catch(function(err) {
      // fetch wraps connection errors: the real error (with code) is in
      // err.cause. Surface it so callers see ECONNREFUSED etc.
      if (err && err.cause && err.cause.code && !err.code) {
        err.code = err.cause.code;
      }
      callback(err);
    });

};

function createProxyDispatcher(proxyUrl) {
  try {
    var ProxyAgent = require('undici').ProxyAgent;
    return new ProxyAgent(proxyUrl);
  } catch (e) {
    return null;
  }
}