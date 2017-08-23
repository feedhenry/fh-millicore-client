var request = require('request');
var logger = require('./util/logger.js').getLogger();
var util = require('util');
var assert = require('assert');
var applyRequestIdHeaders = require('./util/applyReqIdHeaders');
var getMillicoreHost = require('./util/getMillicoreHost');

module.exports = function(millicoreConfig) {
  var cfg = millicoreConfig;
  var jar = request.jar;

  return {
    listFormTemplates: listFormTemplates,
    listThemeTemplates: listThemeTemplates,
    getFormTemplate : getFormTemplate,
    getThemeTemplate: getThemeTemplate
  };

  function exectuteMillicoreCall(req, url, callType, cb){
    assert.ok(req.millicoreHeaders, "Missing req.millicoreHeaders! (if calling this from a test, use 'req.millicoreHeaders' instead of 'req.headers'");
    var returnObj = {};
    if (!req.millicoreHeaders.host) return cb("Invalid request! Missing 'host' field in headers");

    var reqParams = applyRequestIdHeaders({url: url, headers: req.millicoreHeaders, json:true});

    logger.trace(reqParams, callType +' template read');

    request.get(reqParams, function(err, res, body) {
      if (err) {
        return cb(err, undefined, res.statusCode);
      }
      logger.trace({statusCode: res.statusCode, body: body, url: url, headers: res.headers}, callType +' template response');
      if (res.statusCode !== 200 || (['ok', 'pending', 'complete'].indexOf(body.status) < 0)) return cb('Unexpected response code: ' + res.statusCode +  ' - ' + util.inspect(body));

      body.result = JSON.parse(body.result);

      returnObj[callType] = body.result || [];
      return cb(null, returnObj, res.statusCode);
    });
  }


  function listFormTemplates(req, cb){
    var url = getMillicoreHost(cfg, req) + '/box/api/forms/templates/form';
    exectuteMillicoreCall(req, url, 'forms', cb);
  };

  function getFormTemplate(req, formId, cb){
    var url = getMillicoreHost(cfg, req) + '/box/api/forms/templates/form/' + formId;
    exectuteMillicoreCall(req, url, 'forms', cb);
  };

  function getThemeTemplate(req, themeId, cb){
    var url = getMillicoreHost(cfg, req) + '/box/api/forms/templates/theme/' + themeId;
    exectuteMillicoreCall(req, url, 'themes', cb);
  };

  function listThemeTemplates(req, cb){
    var url = getMillicoreHost(cfg, req) + '/box/api/forms/templates/theme';
    exectuteMillicoreCall(req, url, 'themes', cb);
  };
};