
var _ = require('underscore');
var logger = require('./logger.js').getLogger();

module.exports = function(reqParams){
  reqParams = reqParams || {
      headers: {}
    };

  reqParams.headers = reqParams.headers || {};

  //Setting the Reqest ID header if required.
  if (_.isFunction(logger.getRequestId)) {
    var reqId = logger.getRequestId();
    if (reqId) {
      reqParams.headers[logger.requestIdHeader] = reqId;
    }
  }

  return reqParams;
};