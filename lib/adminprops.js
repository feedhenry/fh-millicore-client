var request = require('request');
var logger = require('./util/logger.js').getLogger();
var applyRequestIdHeaders = require('./util/applyReqIdHeaders');
var util = require('util');
var getMillicoreHost = require('./util/getMillicoreHost');

// Queries the Admin Domain Props endpoint in Millicore

module.exports = function(millicoreConfig) {
  var cfg = millicoreConfig;
  var headers = {
    "X-FH-AUTH-USER": cfg.serviceKey
  };

  return {
    list: list,
    getProps: getProps
  };

  // list all our domain props - now way in the api to filter these by key currently, its all or nothing.
  // would be good to cache this stuff..
  function list(domain, cb) {
    var url = getMillicoreHost(cfg, null) + '/box/srv/1.1/sys/admin/domain/props?d=' + domain;

    var reqParams = applyRequestIdHeaders({
      url: url,
      json: {},
      headers: headers
    });

    logger.debug(reqParams, 'domain props request');
    request.post(reqParams, function(err, res, body) {
      if (err) return cb(err);
      logger.debug({
        statusCode: res.statusCode,
        reqParams: reqParams
      }, 'domain props response');
      if (res.statusCode !== 200) return cb('Unexpected response code: ' + res.statusCode + ' - ' + util.inspect(body));
      return cb(null, body);
    });
  }

  //if possible, use this method instead
  //domain is optional if it is available in the req
  function getProps(req, domain, cb){
    var d = domain;
    var callback = cb;
    if(typeof domain === 'function'){
      d = req.param('domain');
      callback = domain;
    }

    if(req.props) {
      return callback(null, req.props);
    } else {
      list(d, function(err, domainProps){
        if(err){
          return callback(err);
        }
        req.props = domainProps.props;
        return callback(null, domainProps.props);
      });
    }
  }
};