var request = require('request');
var logger = require('./util/logger.js').getLogger();
var util = require('util');
var applyRequestIdHeaders = require('./util/applyReqIdHeaders');
var getMillicoreHost = require('./util/getMillicoreHost');

module.exports = function(millicoreConfig) {
  var cfg = millicoreConfig;

  function create(user, key, value, cb) {
    var headers = {};
    headers["X-FH-AUTH-USER"] = cfg.serviceKey;

    var url = getMillicoreHost(cfg, null) + '/box/api/props/user/' + user;
    var prop = {
      key: key,
      value: value
    };

    var reqParams = applyRequestIdHeaders({
      url: url,
      json: prop,
      headers: headers
    });

    logger.trace(reqParams, 'user prop create');
    request.post(reqParams, function(err, res, body) {
      if (err) return cb(err);
      logger.trace({
        statusCode: res.statusCode,
        body: body,
        url: url,
        headers: res.headers
      }, 'user prop create response');
      if (res.statusCode !== 201) return cb('Unexpected response code: ' + res.statusCode + ' - ' + util.inspect(body));

      return cb(null, body);
    });
  }

  function list(user, cb) {
    var headers = {};
    headers["X-FH-AUTH-USER"] = cfg.serviceKey;

    var url = getMillicoreHost(cfg, null) + '/box/api/props/user/' + user;

    var reqParams = applyRequestIdHeaders({
      url: url,
      json: true,
      headers: headers
    });

    logger.trace(reqParams, 'user prop list');

    request.get(reqParams, function(err, res, body) {
      if (err) return cb(err);
      logger.trace({
        statusCode: res.statusCode,
        body: body,
        url: url,
        headers: res.headers
      }, 'user prop list response');
      if (res.statusCode !== 200) return cb('Unexpected response code: ' + res.statusCode + ' - ' + util.inspect(body));

      return cb(null, body);
    });
  }

  return {
    create: create,
    list: list
  };

};