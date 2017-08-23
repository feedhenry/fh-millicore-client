var request = require('request');
var logger = require('./util/logger.js').getLogger();
var util = require('util');
var assert = require('assert');
var applyRequestIdHeaders = require('./util/applyReqIdHeaders');
var getMillicoreHost = require('./util/getMillicoreHost');

module.exports = function(millicoreConfig) {
  var cfg = millicoreConfig;

  return {
    read: read,
    list : list,
    listForCustomerAndReseller:listForCustomerAndReseller,
    listForDomain: listForDomain
  };

  function preFlightValidate(req, cb){
    assert.ok(req.millicoreHeaders, "Missing req.millicoreHeaders! (if calling this from a test, use 'req.millicoreHeaders' instead of 'req.headers'");
    if (!req.millicoreHeaders.host) return cb("Invalid request! Missing 'host' field in headers");
    return cb();
  }

  // get a users information, given a request object (we only pull out the cookie here currently)
  /**
   * @desc read a user from millicore. The returned user is cached for the length of the request.
   * @param req
   * @param cb
   * @returns {*}
   */
  function read(req, cb) {
    var start = new Date().getTime();
    //return cache if already read.
    if(req.user){
      return cb(undefined, req.user);
    }
    logger.debug("#millicore call to read user " + " id " + start );
    preFlightValidate(req,function (err){

      if(err) return cb(err);
      // Note: doesn't matter what 'domain' is here in the mc url
      var url = getMillicoreHost(cfg, req)+ '/box/srv/1.1/ide/dummy/user/read?deep=false&updateLastLogin=false';
      var headers = req.millicoreHeaders;
      //This kind of defeats the purpose of a CSRF check, but since ngui issues a GET the header is never set. This request should really just be a GET anyway!!
      var csrfCookie = req.cookies.csrf;
      if(csrfCookie) {
        headers['X-CSRF-Token'] = csrfCookie;
      }

      var reqParams = applyRequestIdHeaders({url: url, json: {"teams":true}, headers: req.millicoreHeaders});

      logger.debug(reqParams, 'user read');

      request.post(reqParams, function(err, res, body) {
        var end = new Date().getTime();
        var time = end - start;
        logger.debug("#millicore call to millicore completed id " + start + " timing " + time + " ms");
        if (err) return cb(err);
        logger.trace({statusCode: res.statusCode, body: body, url: url, headers: res.headers}, 'user read response');
        if (res.statusCode !== 200) return cb('Unexpected response code: ' + res.statusCode +  ' - ' + util.inspect(body));
        //persist for length of the request
        req.user = body;
        return cb(null, body);
      });
    });

  }

  // list all users which this user is entitled to see
  function list(req, cb){

    preFlightValidate(req,function (err){
      if(err) return cb(err);
      // Note: doesn't matter what 'domain' is here in the mc url
      var url = getMillicoreHost(cfg, req) + '/box/srv/1.1/admin/user/list';

      var reqParams = applyRequestIdHeaders({url: url, json: true, headers: req.millicoreHeaders});

      logger.trace(reqParams, 'user list');

      request.get(reqParams, function(err, res, body) {
        if (err) return cb(err);
        logger.trace({statusCode: res.statusCode, url: url, headers: res.headers}, 'user list response');
        if (res.statusCode !== 200) return cb('Unexpected response code: ' + res.statusCode +  ' - ' + util.inspect(body));
        return cb(null, body);
      });
    });

  }

  function listForCustomerAndReseller(req, reseller,customer, cb){

    preFlightValidate(req,function (err){
      if(err) return cb(err);
      // Note: doesn't matter what 'domain' is here in the mc url
      var url = getMillicoreHost(cfg, req) + '/box/srv/1.1/admin/user/list';
      if(reseller){
        url+="?reseller=" + reseller;
        if(customer){
          url+="&customer=" + customer;
        }
      }
      var reqParams = applyRequestIdHeaders({url: url, json: true, headers: req.millicoreHeaders});
      logger.trace(reqParams, 'user list');

      request.get(reqParams, function(err, res, body) {

        if (err) return cb(err);
        logger.trace({statusCode: res.statusCode, url: url, headers: res.headers}, 'user list response');
        if (res.statusCode !== 200) return cb('Unexpected response code: ' + res.statusCode +  ' - ' + util.inspect(body));
        return cb(null, body);
      });
    });

  }

  function listForDomain(req, domain, cb){
    preFlightValidate(req,function (err){
      if(err) return cb(err);
      // Note: doesn't matter what 'domain' is here in the mc url
      var url = getMillicoreHost(cfg, req)+ '/box/api/domains/' + domain + '/users';

      var reqParams = applyRequestIdHeaders({url: url, json: true, headers: req.millicoreHeaders});
      logger.trace(reqParams, 'user list');

      request.get(reqParams, function(err, res, body) {

        if (err) return cb(err);
        logger.trace({statusCode: res.statusCode, url: url, headers: res.headers, body: body}, 'user list response');
        if (res.statusCode !== 200) return cb('Unexpected response code: ' + res.statusCode +  ' - ' + util.inspect(body));
        return cb(null, body);
      });
    });
  }

};
