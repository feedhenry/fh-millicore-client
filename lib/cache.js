var util = require('util');
var request = require('request');
var assert = require('assert');
var logger = require('./util/logger.js').getLogger();
var applyRequestIdHeaders = require('./util/applyReqIdHeaders');
var getMillicoreHost = require('./util/getMillicoreHost');

// Client Millicore API for caching, hits LogBean in millicore.
module.exports = function(millicoreConfig) {
  assert.ok(millicoreConfig, 'Millicore config is null!');
  var cfg = millicoreConfig;
  var jar = request.jar;

  var headers = {
    "X-FH-AUTH-USER": cfg.serviceKey
  };

  return {
    readCache: readCache,
    createCache: createCache,
    appendCache: appendCache,
    updateCache: updateCache,
    invalidateUserCache:  invalidateUserCache,

    // constants taken from LogManagerBase in Millicore, used in updateCache.
    COMPLETE: 'complete',
    ERROR: 'error',
    PENDING: 'pending'
  };

  /**
   *
   * @param guid
   * @param cb
   * @doc This will cause the user version to be updated and so invalidate the users current context and ensure the next request
   * causes perms to be re requested
   */
  function invalidateUserCache(guid, cb) {
    var url = getMillicoreHost(cfg, null) + '/box/srv/1.1/ent/ten/User/update';
    var reqParams = applyRequestIdHeaders({url: url, json: {"guid": guid , "fields":{}}, headers: headers});
    request.post(reqParams, function (err, res, body) {
      logger.trace({"error ": err, statusCode: res.statusCode, body: body, url: url, headers: res.headers}, 'user cache response');
      if (err) return cb(err);
      if (res.statusCode !== 200) return cb('Unexpected response code: ' + res.statusCode + ' - ' + util.inspect(body));
      return cb(null, body);
    });
  }

  function readCache(cacheKeys, cb){
    var url = getMillicoreHost(cfg, null) + '/box/srv/1.1/dat/log/read?cacheKeys='+ JSON.stringify(cacheKeys);

    var reqParams = applyRequestIdHeaders({url: url, headers: {}});

    logger.trace(reqParams, 'Millicore readCacheKey request');
    request.get(reqParams, cb);
  }

  function createCache(cacheKey, cb) {
    assert.ok(cacheKey, 'Missing cacheKey');
    var payload = {
      cacheKey: cacheKey
    };

    var reqParams = applyRequestIdHeaders({url: getMillicoreHost(cfg, null)+ '/box/srv/1.1/dat/log/create', json: payload});
    logger.trace(reqParams, 'Millicore createCache request');
    request.post(reqParams, cb);
  }

  // Note: progress can be null here
  function appendCache(cacheKey, logMsg, progress, cb) {
    assert.ok(cacheKey, 'Missing cacheKey');
    assert.ok(logMsg, 'Missing logMsg');
    assert.ok(cb, 'Missing callback, check number of params');
    var payload = {
      logMsg: logMsg,
      progress: progress,
      cacheKey: cacheKey
    };

    var reqParams = applyRequestIdHeaders({url: getMillicoreHost(cfg, null) + '/box/srv/1.1/dat/log/append', json: payload});

    logger.trace(reqParams, 'Millicore appendCache request');
    request.post(reqParams, cb);
  }

  // Note: action & error can both be null
  // action must be an object
  function updateCache(cacheKey, status, action, error, cb) {
    assert.ok(cacheKey, 'Missing cacheKey');
    assert.ok(status, 'Missing status');
    if (action) assert.equal(typeof action, 'object');

    var payload = {
      status: status,
      cacheKey: cacheKey
    };
    if (action) payload.action = action;
    if (error) payload.error = error;

    var reqParams = applyRequestIdHeaders({url: getMillicoreHost(cfg, null) + '/box/srv/1.1/dat/log/update', json: payload});

    logger.trace(reqParams, 'Millicore updateCache request');
    request.post(reqParams, cb);
  }
};
