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

  var apiKeyTypes = {
    API_KEY_GIT_TYPE: 'git_repo',
    API_KEY_USER_TYPE: 'user'
  };

  return {
    list: list,
    create: create,
    findOrCreate: findOrCreate,
    apiKeyTypes: apiKeyTypes
  };

  function doReq(url, params, headers, cb) {
    var reqParams = applyRequestIdHeaders({
      url: url,
      json: params,
      headers: headers
    });

    logger.debug(reqParams, 'calling url ' + url);
    request.post(reqParams, function(err, res, body) {
      if (err) return cb(err);
      logger.debug({
        statusCode: res.statusCode,
        reqParams: reqParams
      });
      if (res.statusCode !== 200) return cb('Unexpected response code: ' + res.statusCode + ' - ' + util.inspect(body));
      return cb(null, body);
    });
  };

  //list the user's api keys
  function list(req, type, cb) {
    if (typeof type === 'function') {
      cb = type;
      type = apiKeyTypes.API_KEY_USER_TYPE;
    }
    assert.ok(req.millicoreHeaders, "Missing req.millicoreHeaders! (if calling this from a test, use 'req.millicoreHeaders' instead of 'req.headers'");
    if (!req.millicoreHeaders.host) return cb("Invalid request! Missing 'host' field in headers");

    var headers = req.millicoreHeaders;
    headers["X-FH-AUTH-USER"] = cfg.serviceKey;

    var domain = req.params.domain;
    var url = getMillicoreHost(cfg, req)+ '/box/srv/1.1/ide/' + domain + '/api/list';
    doReq(url, {'type': type}, headers, cb);
  };

  //create a new user's api key
  function create(req, label, type, cb) {
    if (typeof type === 'function') {
      cb = type;
      type = apiKeyTypes.API_KEY_USER_TYPE;
    }

    assert.ok(req.millicoreHeaders, "Missing req.millicoreHeaders! (if calling this from a test, use 'req.millicoreHeaders' instead of 'req.headers'");
    if (!req.millicoreHeaders.host) return cb("Invalid request! Missing 'host' field in headers");

    var headers = req.millicoreHeaders;
    headers["X-FH-AUTH-USER"] = cfg.serviceKey;

    var domain = req.params.domain;
    var url = getMillicoreHost(cfg, req) + '/box/srv/1.1/ide/' + domain + '/api/create';

    doReq(url, {
      type: type,
      label: label,
      fields: {
        label: label
      }
    }, headers, cb);
  };

  function findOrCreate(req, label, type, cb) {
    if (typeof type === 'function') {
      cb = type;
      type = apiKeyTypes.API_KEY_USER_TYPE;
    }
    list(req, type, function(err, body) {
      if(err) return cb(err);
      var found = _.findWhere(body.list, {label: label});
      if(found){
        return cb(null, found);
      } else {
        create(req, label, type, function(err, created) {
          if(err){
            return cb(err);
          } else {
            return cb(null, created.apiKey);
          }
        });
      }
    });
  };
};
