var request = require('request');
var assert = require('assert');
var util = require('util');
var logger = require('./util/logger.js').getLogger();
var applyRequestIdHeaders = require('./util/applyReqIdHeaders');
var getMillicoreHost = require('./util/getMillicoreHost');

module.exports = function(millicoreConfig) {
  var cfg = millicoreConfig;
  function list(req, cb) {

    assert.ok(req.millicoreHeaders, "Missing req.millicoreHeaders! (if calling this from a test, use 'req.millicoreHeaders' instead of 'req.headers'");
    if (!req.millicoreHeaders.host) return cb("Invalid request! Missing 'host' field in headers");

    var url = getMillicoreHost(cfg, req) + '/box/api/connectors';

    var reqParams = applyRequestIdHeaders({url: url, headers: req.millicoreHeaders , "json":true});

    logger.trace(reqParams, 'service list');

    request.get(reqParams, function(err, res, body) {
      if (err) return cb(err);
      logger.trace({statusCode: res.statusCode, body: body, url: url, headers: res.headers}, 'service list response');
      if (res.statusCode !== 200) return cb('Unexpected response code: ' + res.statusCode +  ' - ' + util.inspect(body));
      return cb(null, body);
    });
  }

  return {
    list: list
  };
};