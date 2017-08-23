var request = require('request');
var logger = require('./util/logger.js').getLogger();
var util = require('util');
var applyRequestIdHeaders = require('./util/applyReqIdHeaders');
var getMillicoreHost = require('./util/getMillicoreHost');

// Queries the Admin Domain Props endpoint in Millicore

module.exports = function(millicoreConfig) {
  var cfg = millicoreConfig;
  var headers = {
    "X-FH-AUTH-USER": cfg.serviceKey
  };

  function getAdminKey(cb) {
    var url = getMillicoreHost(cfg, null) + '/box/api/repos/admin_key';

    var reqParams = applyRequestIdHeaders({
      url: url,
      json: true,
      headers: headers
    });

    logger.debug(reqParams, 'repo admin key request');
    request.get(reqParams, function(err, res, body) {
      if (err) return cb(err);
      logger.debug({
        statusCode: res.statusCode,
        reqParams: reqParams
      }, 'repo admin key response');
      if (res.statusCode !== 200) return cb('Unexpected response code: ' + res.statusCode + ' - ' + util.inspect(body));
      if (!body || (body && !body.message)) return cb('Missing key from response body - ' + util.inspect(body));
      return cb(null, body.message);
    });
  }

  return {
    getAdminKey: getAdminKey
  };
};