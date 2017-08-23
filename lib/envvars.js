var request = require('request');
var logger = require('./util/logger.js').getLogger();
var util = require('util');
var assert = require('assert');
var applyRequestIdHeaders = require('./util/applyReqIdHeaders');
var getMillicoreHost = require('./util/getMillicoreHost');

module.exports = function (millicoreConfig) {
  var cfg = millicoreConfig;

  return {
    create: create,
    update: update,
    del: del,
    unset: unset,
    list: list
  };

  //POST /apps/{appguid}/env/{env}/envvars
  function create(req, cb) {
    var guid = req.param('guid');
    var env = req.param('env');
    var domain = req.param('domain');
    var envVar = req.body;

    var headers = {
      "X-FH-AUTH-USER": cfg.serviceKey
    };

    var url = getMillicoreHost(cfg, req) + '/box/api/apps/' + guid + '/env/' + env + '/envvars';

    var reqParams = applyRequestIdHeaders({
      url: url,
      json: envVar,
      headers: headers
    });

    logger.trace(reqParams, 'envvars.create');

    request.post(reqParams, function (err, res, body) {
      if (err) return cb(err);
      if (res.statusCode !== 200) return cb('Unexpected response code: ' + res.statusCode + ' - ' + util.inspect(body));

      return cb(null, body);
    });
  }

  //PUT /apps/{appguid}/env/{env}/envvars/{guid}
  function update(req, cb) {
    var guid = req.param('guid');
    var env = req.param('env');
    var domain = req.param('domain');
    var envVarGuid = req.param('envvarguid');
    var envVar = req.body;

    var headers = {
      "X-FH-AUTH-USER": cfg.serviceKey
    };

    var url = getMillicoreHost(cfg, req) + '/box/api/apps/' + guid + '/env/' + env + '/envvars/' + envVarGuid;


    var reqParams = applyRequestIdHeaders({
      url: url,
      json: envVar,
      headers: headers
    });

    logger.trace(reqParams, 'envvars.update');

    request.put(reqParams, function (err, res, body) {
      if (err) return cb(err);
      if (res.statusCode !== 200) return cb('Unexpected response code: ' + res.statusCode + ' - ' + util.inspect(body));

      return cb(null, body);
    });
  }

  //DELETE /apps/{appguid}/env/{env}/envvars/{guid}
  function del(req, cb) {
    var guid = req.param('guid');
    var env = req.param('env');
    var domain = req.param('domain');
    var envVarGuid = req.param('envvarguid');

    var headers = {
      "X-FH-AUTH-USER": cfg.serviceKey
    };

    var url = getMillicoreHost(cfg, req) + '/box/api/apps/' + guid + '/env/' + env + '/envvars/' + envVarGuid;

    var reqParams = applyRequestIdHeaders({
      url: url,
      json: true,
      headers: headers
    });

    logger.trace(reqParams, 'envvars.del');

    request.del(reqParams, function (err, res, body) {
      if (err) return cb(err);
      if (res.statusCode !== 200) return cb('Unexpected response code: ' + res.statusCode + ' - ' + util.inspect(body));

      return cb(null, body);
    });
  }

  //PUT /apps/{appguid}/env/{env}/envvars/unset
  function unset(req, cb) {
    var guid = req.param('guid');
    var env = req.param('env');
    var domain = req.param('domain');
    var envVarIds = req.param('envVarIds');

    var headers = {
      "X-FH-AUTH-USER": cfg.serviceKey
    };

    var url = getMillicoreHost(cfg, req) + '/box/api/apps/' + guid + '/env/' + env + '/envvars/unset';

    var reqParams = applyRequestIdHeaders({
      url: url,
      json: envVarIds,
      headers: headers
    });

    logger.trace(reqParams, 'envvars.unset');

    request.put(reqParams, function (err, res, body) {
      if (err) return cb(err);
      if (res.statusCode !== 200) return cb('Unexpected response code: ' + res.statusCode + ' - ' + util.inspect(body));

      return cb(null, body);
    });
  }

  //GET /apps/{appguid}/env/{env}/envvars
  function list(req, env, cb) {
    var guid = req.params.guid;

    var headers = {
      "X-FH-AUTH-USER": cfg.serviceKey
    };

    var url = getMillicoreHost(cfg, req) + '/box/api/apps/' + guid + '/env/' + env + '/envvars';

    var reqParams = applyRequestIdHeaders({
      url: url,
      json: true,
      headers: headers
    });

    logger.trace(reqParams, 'envvars.list');

    request.get(reqParams, function (err, res, body) {
      if (err) return cb(err);
      if (res.statusCode !== 200) return cb('Unexpected response code: ' + res.statusCode + ' - ' + util.inspect(body));

      return cb(null, body);
    });
  }

};