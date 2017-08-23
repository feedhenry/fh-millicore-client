var assert = require('assert');
var request = require('request');
var logger = require('./util/logger.js').getLogger();
var applyRequestIdHeaders = require('./util/applyReqIdHeaders');
var getMillicoreHost = require('./util/getMillicoreHost');

// Queries the DomainProp Entity tables directly

module.exports = function(millicoreConfig) {
  assert.ok(millicoreConfig);
  var cfg = millicoreConfig;

  return {
    getBusinessObjects: getBusinessObjects
  };

  // authenticate a user for a specific permission
  function getBusinessObjects(req, busObjPath, businessObjectContext, cb) {
    assert.ok(req.millicoreHeaders, "Missing req.millicoreHeaders! (if calling this from a test, use 'req.millicoreHeaders' instead of 'req.headers'");
    if (!req.millicoreHeaders.host) return cb("Invalid request! Missing 'host' field in headers");

    var url = getMillicoreHost(cfg, req) + '/box/api/businessobjects?businessObject=' + busObjPath;

    var reqParams = applyRequestIdHeaders({url: url, headers: req.millicoreHeaders, json:true,body:businessObjectContext});

    logger.trace(reqParams, 'entity read');
    // TODO is this needed? var statMe = stats.gauge("millicore-read-request-"+url);
    request.post(reqParams, function(err, res, body) {
      if (err || res.statusCode !== 200){
        var err = (err) ? err.toString() : body.message;
        return cb(err);
      }
      return cb(null, body);
    });
  }
};
