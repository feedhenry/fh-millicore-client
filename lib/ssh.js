var request = require('request');
var logger = require('./util/logger.js').getLogger();
var util = require('util');
var assert = require('assert');
var applyRequestIdHeaders = require('./util/applyReqIdHeaders');
var getMillicoreHost = require('./util/getMillicoreHost');

module.exports = function(millicoreConfig) {
  var cfg = millicoreConfig;

  return {
    add: add
  };

  function preFlightValidate(req, key, cb){
    if (!req.millicoreHeaders) return cb("Missing req.millicoreHeaders! (if calling this from a test, use 'req.millicoreHeaders' instead of 'req.headers'");
    if (!cfg.url) return cb("Invalid request! Missing 'cfg.url' field in config");
    if (!key.label || !key.key) return cb("Invalid request! No key label or key specified");
    return cb();
  }

  // add an SSH key to the user's account
  function add(req, key, cb) {

    preFlightValidate(req, key, function (err){
      if(err) return cb(err);
      // Note: doesn't matter what 'domain' is here in the mc url
      var url = getMillicoreHost(cfg, req) + '/box/srv/1.1/ide/' + req.params.domain + '/user/addKey';
      var headers = req.millicoreHeaders;
      //This kind of defeats the purpose of a CSRF check, but since ngui issues a GET the header is never set. This request should really just be a GET anyway!!
      var csrfCookie = req.cookies.csrf;
      if(csrfCookie) {
        headers['X-CSRF-Token'] = csrfCookie;
      }

      var reqParams = applyRequestIdHeaders({url: url, json: key, headers: req.millicoreHeaders});

      logger.trace(reqParams, 'ssh key add');

      request.post(reqParams, function(err, res, body) {
        if (err) return cb(err);
        logger.trace({statusCode: res.statusCode, body: body, url: url, headers: res.headers}, 'user read response');
        if (res.statusCode !== 200) return cb('Unexpected response code: ' + res.statusCode +  ' - ' + util.inspect(body));
        if (!body || body.status !== "ok") return cb('Unexpected response body: ' + util.inspect(body));
        return cb(null, body);
      });
    });

  }

};
