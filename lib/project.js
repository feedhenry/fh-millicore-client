var request = require('request');
var logger = require('./util/logger.js').getLogger();
var util = require('util');
var assert = require('assert');
var _ = require('underscore');
var applyRequestIdHeaders = require('./util/applyReqIdHeaders');
var getMillicoreHost = require('./util/getMillicoreHost');

// Manage user api keys

module.exports = function(millicoreConfig) {
  var cfg = millicoreConfig;

  return {
    list: list,
    read : read
  };

  function doReq(url, headers, cb){

    var reqParams = applyRequestIdHeaders({
      url: url,
      json : true,
      headers: headers
    });

    logger.debug(reqParams, 'calling url ' + url);
    request.get(reqParams, function(err, res, body) {
      if (err) return cb(err);
      logger.debug({
        statusCode: res.statusCode,
        reqParams: reqParams
      });
      if (res.statusCode !== 200) return cb('Unexpected response code: ' + res.statusCode + ' - ' + util.inspect(body));
      return cb(null, body);
    });
  }

  //list the user's projects
  function list(req, cb) {
    assert.ok(req.millicoreHeaders, "Missing req.millicoreHeaders! (if calling this from a test, use 'req.millicoreHeaders' instead of 'req.headers'");
    if (!req.millicoreHeaders.host) return cb("Invalid request! Missing 'host' field in headers");

    var headers = req.millicoreHeaders;
    headers["X-FH-AUTH-USER"] = cfg.serviceKey;

    var url = getMillicoreHost(cfg, req) + '/box/api/projects';

    //Don't want to populate apps as it is a really expensive operation.
    if(req.noProjectApps){
      url += "?apps=false";
    }

    doReq(url, headers, cb);
  }

  //get a single project
  function read(req, projectId, cb) {
    assert.ok(req.millicoreHeaders, "Missing req.millicoreHeaders! (if calling this from a test, use 'req.millicoreHeaders' instead of 'req.headers'");
    if (!req.millicoreHeaders.host) return cb("Invalid request! Missing 'host' field in headers");

    var headers = req.millicoreHeaders;
    headers["X-FH-AUTH-USER"] = cfg.serviceKey;

    var url = getMillicoreHost(cfg, req) + '/box/api/projects/' + projectId;
    doReq(url, headers, cb);
  }
};