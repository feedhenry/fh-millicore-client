var util = require('util');
var request = require('request');
var assert = require('assert');
var logger = require('./util/logger.js').getLogger();
var applyRequestIdHeaders = require('./util/applyReqIdHeaders');
var getMillicoreHost = require('./util/getMillicoreHost');

module.exports = function(millicoreConfig) {
  assert.ok(millicoreConfig, 'Millicore config is null!');
  var cfg = millicoreConfig;

  return {
    ping: ping,
    validateRequest: validateRequest
  };

  // ping millicore - note this is un-authenticated, just checks basic connectivity
  function ping(cb) {

    var reqParams = applyRequestIdHeaders({url: getMillicoreHost(cfg,null) + '/box/srv/1.1/tst/version'});
    request.get(reqParams, function(err, res, body) {
      if (err) return cb(err);
      if (res.statusCode !== 200) return cb('Unexpected response code: ' + res.statusCode + ' - ' + util.inspect(body));
      return cb(null, body);
    });
  };

  function validateRequest(reqHeaders, csrfToken, cb) {
    var headers = reqHeaders;
    headers['X-CSRF-Token'] = csrfToken;
    var reqParams = {
      url: getMillicoreHost(cfg, null) + '/box/api/supercore/validateRequest',
      headers: headers
    };
    request.get(reqParams, function(err, res, body){
      if (err) return cb(err);
      return cb(null, res);
    });
  };
};