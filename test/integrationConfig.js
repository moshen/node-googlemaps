/**
 * Returns a config object for integration tests.
 *
 * Reads the API key and (optional) secure flag from the environment so that
 * no real credentials are committed to the repository.
 *
 *   GOOGLE_MAPS_API_KEY   - Google Maps API key (required to run the suite)
 *   GOOGLE_MAPS_SECURE    - "true" / "false", defaults to "true"
 *
 * For local development you may also create a git-ignored
 * test/simpleConfig.json ({ "key": "...", "secure": true }) which will be
 * used as a fallback only when GOOGLE_MAPS_API_KEY is unset.
 */
var path = require('path');

function getConfig() {
  var key = process.env.GOOGLE_MAPS_API_KEY;

  if (key) {
    return {
      key: key,
      secure: process.env.GOOGLE_MAPS_SECURE !== 'false'
    };
  }

  try {
    return require(path.join(__dirname, 'simpleConfig'));
  } catch (e) {
    throw new Error(
      'No API key configured for integration tests. Set the ' +
      'GOOGLE_MAPS_API_KEY environment variable (or provide ' +
      'test/simpleConfig.json) before running the integration suite.'
    );
  }
}

module.exports = getConfig();