var request = require('request');
var logger = require('./util/logger.js').getLogger();
var util = require('util');
var assert = require('assert');
var applyRequestIdHeaders = require('./util/applyReqIdHeaders');
var getMillicoreHost = require('./util/getMillicoreHost');

module.exports = function(millicoreConfig) {
  var cfg = millicoreConfig;

  function create(app, key, value, cb) {
    var headers = {};
    headers["X-FH-AUTH-USER"] = cfg.serviceKey;

    var url = getMillicoreHost(cfg, null) + '/box/api/props/app/' + app;
    var prop = {
      key: key,
      value: value
    };

    var reqParams = applyRequestIdHeaders({
      url: url,
      json: prop,
      headers: headers
    });

    logger.trace(reqParams, 'app prop create');
    request.post(reqParams, function(err, res, body) {
      if (err) return cb(err);
      logger.trace({
        statusCode: res.statusCode,
        body: body,
        url: url,
        headers: res.headers
      }, 'app prop create response');
      if (res.statusCode !== 201) return cb('Unexpected response code: ' + res.statusCode + ' - ' + util.inspect(body));

      return cb(null, body);
    });
  }

  // FIXME: App props are really just the App details here
  function read(req, guid, cb) {
    assert.ok(req.millicoreHeaders, "Missing req.millicoreHeaders! (if calling this from a test, use 'req.millicoreHeaders' instead of 'req.headers'");
    if (!req.millicoreHeaders.host) return cb("Invalid request! Missing 'host' field in headers");
    var headers = req.millicoreHeaders;
    headers["X-FH-AUTH-USER"] = cfg.serviceKey;
    if(req.appProps){
      return cb(undefined, req.appProps);
    }
    var url = getMillicoreHost(cfg, req)+ '/box/api/apps/' + guid + "?hierarchy=true";

    var reqParams = applyRequestIdHeaders({
      url: url,
      json: true,
      headers: headers
    });

    logger.trace(reqParams, 'app props request');
    request.get(reqParams, function(err, res, body) {
      if (err) return cb(err);
      logger.trace({
        statusCode: res.statusCode,
        body: '<not shown, too big>',
        url: url,
        headers: res.headers
      }, 'app props response');
      if (res.statusCode !== 200) return cb('Unexpected response code: ' + res.statusCode + ' - ' + util.inspect(body));

      req.appProps = body;

      return cb(null, body);
    });
  }

  function update(req, guid, appProps, cb) {
    assert.ok(req.millicoreHeaders, "Missing req.millicoreHeaders! (if calling this from a test, use 'req.millicoreHeaders' instead of 'req.headers'");
    if (!req.millicoreHeaders.host) return cb("Invalid request! Missing 'host' field in headers");

    var headers = {
      "X-FH-AUTH-USER": cfg.serviceKey
    };

    var url = getMillicoreHost(cfg, req) + '/box/api/apps/' + guid + '/appprops';

    var reqParams = applyRequestIdHeaders({
      url: url,
      json: appProps,
      headers: headers
    });

    logger.trace(reqParams, 'app props update request');

    request.put(reqParams, function(err, res, body) {
      if (err) return cb(err);
      if (res.statusCode !== 200) return cb('Unexpected response code: ' + res.statusCode +  ' - ' + util.inspect(body));

      return cb(null, body);
    });
  }

  function listDeployProps(req, env, guid, cb){
    assert.ok(req.millicoreHeaders, "Missing req.millicoreHeaders! (if calling this from a test, use 'req.millicoreHeaders' instead of 'req.headers'");
    if (!req.millicoreHeaders.host) return cb("Invalid request! Missing 'host' field in headers");

    var headers = req.millicoreHeaders || {};
    headers["X-FH-AUTH-USER"] = cfg.serviceKey;

    var url = getMillicoreHost(cfg, req) + '/box/api/apps/' + guid + '/deployprops/' + env;

    var reqParams = applyRequestIdHeaders({
      url: url,
      headers: headers,
      json: true
    });

    logger.trace(reqParams, 'app props request');
    request.get(reqParams, function(err, res, body) {
      if (err) return cb(err);
      logger.trace({
        statusCode: res.statusCode,
        body: '<not shown, too big>',
        url: url,
        headers: res.headers
      }, 'app deploy props response');
      if (res.statusCode !== 200) return cb('Unexpected response code: ' + res.statusCode + ' - ' + util.inspect(body));

      return cb(null, body);
    });
  }

  return {
    create: create,
    read: read,
    update: update,
    listDeployProps: listDeployProps
  };

};
