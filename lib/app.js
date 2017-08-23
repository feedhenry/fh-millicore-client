var request = require('request');
var logger = require('./util/logger.js').getLogger();
var util = require('util');
var assert = require('assert');
var internalStats = require('fh-internal-stats');
var applyRequestIdHeaders = require('./util/applyReqIdHeaders');
var getMillicoreHost = require('./util/getMillicoreHost');

module.exports = function(millicoreConfig) {
  var cfg = millicoreConfig;
  var stats = internalStats(millicoreConfig);
  var jar = request.jar;

  return {
    read: read,
    list: list,
    import_url: import_url
  };

  // get an apps information
  function read(req, appId, cb) {
    assert.ok(req.millicoreHeaders, "Missing req.millicoreHeaders! (if calling this from a test, use 'req.millicoreHeaders' instead of 'req.headers'");
    if (!req.millicoreHeaders.host) return cb("Invalid request! Missing 'host' field in headers");

    var url = getMillicoreHost(cfg, req) + '/box/api/forms/readapp/'+appId;

    var statMe = stats.gauge("millicore-read-request-"+url);

    var reqParams = applyRequestIdHeaders({url: url, headers: req.millicoreHeaders, json:true});
    logger.trace(reqParams, 'app read');

    request.get(reqParams, function(err, res, body) {
      statMe.record();
      if (err) {
        return cb(err, undefined, res.statusCode);
      }
      logger.trace({statusCode: res.statusCode, body: body, url: url, headers: res.headers}, 'app read response');
      if (res.statusCode !== 200) return cb('Unexpected response code: ' + res.statusCode +  ' - ' + util.inspect(body), null, res.statusCode);
      return cb(null, body, res.statusCode);
    });
  };

  function list(req, cb) {
    assert.ok(req.millicoreHeaders, "Missing req.millicoreHeaders! (if calling this from a test, use 'req.millicoreHeaders' instead of 'req.headers'");
    if (!req.millicoreHeaders.host) return cb("Invalid request! Missing 'host' field in headers");

    // Note: doesn't matter what 'domain' is here in the mc url
    var appTypeV3 = req.query.appTypeV3 || false;
    var url = getMillicoreHost(cfg, req) + '/box/api/forms/listapps?appTypeV3=' + appTypeV3;
    var statMe = stats.gauge("millicore-list-request-"+url);

    var reqParams = applyRequestIdHeaders({url: url, headers: req.millicoreHeaders, json:true});
    logger.trace(reqParams, 'app list');

    request.get(reqParams, function(err, res, body) {
      statMe.record();
      if (err) return cb(err);
      logger.trace({statusCode: res.statusCode, body: body, url: url, headers: res.headers}, 'app list response');
      if (res.statusCode !== 200) return cb('Unexpected response code: ' + res.statusCode +  ' - ' + util.inspect(body));
      return cb(null, body);
    });
  };
  
  function import_url(req, app, cb) {
    assert.ok(req.millicoreHeaders, "Missing req.millicoreHeaders! (if calling this from a test, use 'req.millicoreHeaders' instead of 'req.headers'");
    if (!req.millicoreHeaders.host) {
      return cb("Invalid request! Missing 'host' field in headers");
    }
    // Note: doesn't matter what 'domain' is here in the mc url
    // e.g. app
    // {
    //   "url":"https://github.com/feedhenry/AppForms-Template/archive/phase3-demo.zip",
    //   "title":"test",
    //   "csrftoken":"xxxxx"
    // }
    var url = getMillicoreHost(cfg, req) + '/box/api/forms/import_url';

    var reqParams = applyRequestIdHeaders({url: url, json: app, headers: req.millicoreHeaders});

    logger.trace(reqParams, 'app import_url');

    request.post(reqParams, function(err, res, body) {
      if (err) return cb(err);
      logger.trace({statusCode: res.statusCode, body: body, url: url, headers: res.headers}, 'app import_url response');
      if (res.statusCode !== 200 || (['ok', 'pending', 'complete'].indexOf(body.status) < 0)) return cb('Unexpected response code: ' + res.statusCode +  ' - ' + util.inspect(body));
      return cb(null, body);
    });
  }
};