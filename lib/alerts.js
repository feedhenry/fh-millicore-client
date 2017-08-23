var request = require('request');
var assert = require('assert');
var util = require('util');
var logger = require('./util/logger.js').getLogger();
var _ = require('underscore');
var applyRequestIdHeaders = require('./util/applyReqIdHeaders');
var getMillicoreHost = require('./util/getMillicoreHost');

module.exports = function (millicoreConfig) {
  var cfg = millicoreConfig;

  function list(req, guid, env, cb) {

    assert.ok(req.millicoreHeaders, "Missing req.millicoreHeaders! (if calling this from a test, use 'req.millicoreHeaders' instead of 'req.headers'");
    if (!req.millicoreHeaders.host) return cb("Invalid request! Missing 'host' field in headers");

    var url = getMillicoreHost(cfg, req) + '/box/srv/1.1/cm/eventlog/alert/list?uid=' + guid + '&env=' + env;

    var reqParams = applyRequestIdHeaders({"json": true, url: url, headers: req.millicoreHeaders});

    logger.trace(reqParams, 'events list');

    request.get(reqParams, function (err, res, body) {
      if (err) return cb(err);
      logger.trace({statusCode: res.statusCode, body: body, url: url, reqParams: reqParams}, 'service list response');
      if (res.statusCode !== 200) return cb('Unexpected response code: ' + res.statusCode + ' - ' + util.inspect(body));
      return cb(null, body);
    });
  }

  function testEmails(req, guid, env, cb) {
    assert.ok(req.millicoreHeaders, "Missing req.millicoreHeaders! (if calling this from a test, use 'req.millicoreHeaders' instead of 'req.headers'");
    if (!req.millicoreHeaders.host) return cb("Invalid request! Missing 'host' field in headers");


    req.body.uid = guid;
    req.body.env = env;
    var url = getMillicoreHost(cfg, req) + '/box/srv/1.1/cm/eventlog/alert/testEmails';

    var reqParams = applyRequestIdHeaders({url: url, json: req.body, headers: req.millicoreHeaders});
    logger.trace(reqParams, 'alert test emails');
    request.post(reqParams, function (err, res, body) {
      if (err) return cb(err);
      logger.trace({statusCode: res.statusCode, body: body, url: url, headers: res.headers}, 'domain props response');
      if (res.statusCode !== 200) return cb({msg: 'Unexpected response code', statusCode: res.statusCode, error: body});
      return cb(null, body);
    });
  }

  function create(req, guid, env, cb) {
    assert.ok(req.millicoreHeaders, "Missing req.millicoreHeaders! (if calling this from a test, use 'req.millicoreHeaders' instead of 'req.headers'");
    if (!req.millicoreHeaders.host) return cb("Invalid request! Missing 'host' field in headers");
    req.body.uid = guid;
    req.body.env = env;
    var url = getMillicoreHost(cfg, req) + '/box/srv/1.1/cm/eventlog/alert/create';
    var reqParams = applyRequestIdHeaders({url: url, json: req.body, headers: req.millicoreHeaders});
    logger.trace(reqParams, 'events create');
    request.post(reqParams, function (err, res, body) {
      if (err) return cb(err);
      logger.trace({statusCode: res.statusCode, body: body, url: url, headers: res.headers}, 'domain props response');
      if (res.statusCode !== 200) return cb({msg: 'Unexpected response code', statusCode: res.statusCode, error: body});
      return cb(null, body);
    });
  }

  function update(req, alertId, env, cb) {
    assert.ok(req.millicoreHeaders, "Missing req.millicoreHeaders! (if calling this from a test, use 'req.millicoreHeaders' instead of 'req.headers'");
    if (!req.millicoreHeaders.host) return cb("Invalid request! Missing 'host' field in headers");
    req.body.guid = alertId;
    req.body.env = env;
    var url = getMillicoreHost(cfg, req) + '/box/srv/1.1/cm/eventlog/alert/update';
    var reqParams = applyRequestIdHeaders({url: url, json: req.body, headers: req.millicoreHeaders});
    logger.trace(reqParams, 'events create');

    request.post(reqParams, function (err, res, body) {
      if (err) return cb(err);
      logger.trace({statusCode: res.statusCode, body: body, url: url, headers: res.headers}, 'domain props response');
      if (res.statusCode !== 200) return cb({msg: 'Unexpected response code', statusCode: res.statusCode, error: body});
      return cb(null, body);
    });
  }

  function del(req, alertId, env, cb) {
    //
    assert.ok(req.millicoreHeaders, "Missing req.millicoreHeaders! (if calling this from a test, use 'req.millicoreHeaders' instead of 'req.headers'");
    if (!req.millicoreHeaders.host) return cb("Invalid request! Missing 'host' field in headers");
    req.body.guid = alertId;
    req.body.env = env;
    var url = getMillicoreHost(cfg, req) + '/box/srv/1.1/cm/eventlog/alert/delete';
    var reqParams = applyRequestIdHeaders({url: url, json: req.body, headers: req.millicoreHeaders});
    logger.trace(reqParams, 'events create');
    request.post(reqParams, function (err, res, body) {
      if (err) return cb(err);
      logger.trace({statusCode: res.statusCode, body: body, url: url, headers: res.headers}, 'domain props response');
      if (res.statusCode !== 200) return cb({msg: 'Unexpected response code', statusCode: res.statusCode, error: body});
      return cb(null, body);
    });
  }

  return {
    list: list,
    create: create,
    update: update,
    del: del,
    testEmails: testEmails
  };
};
