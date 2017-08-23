var request = require('request');
var util = require('util');
var logger = require('./util/logger.js').getLogger();
var applyRequestIdHeaders = require('./util/applyReqIdHeaders');

module.exports = function(config) {
  return {
    "submissionNotification": function postSubmissionNotification(req, notificationMessage, cb) {
      var url = config.url + '/box/api/forms/submission';
      var headers = {
        "X-FH-AUTH-USER": config.serviceKey
      };

      var reqParams = applyRequestIdHeaders({
        "url": url,
        "headers": headers,
        "json": notificationMessage
      });
      request.post(reqParams, function (err, res, body) {
        if (err) {
          return cb(err);
        }
        logger.trace(reqParams, 'service list response');
        if (res.statusCode !== 202){
          return cb('Unexpected response code: ' + res.statusCode + ' - ' + util.inspect(body));
        }
        return cb();
      });
    }
  };
};
