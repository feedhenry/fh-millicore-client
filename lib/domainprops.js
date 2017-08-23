var request = require('request');
var logger = require('./util/logger.js').getLogger();
var util = require('util');
var applyRequestIdHeaders = require('./util/applyReqIdHeaders');
var getMillicoreHost = require('./util/getMillicoreHost');

// Queries the DomainProp Entity tables directly

module.exports = function(millicoreConfig) {
  var cfg = millicoreConfig;
  var headers = {
    "X-FH-AUTH-USER": cfg.serviceKey
  };

  return {
    list: list,
    get: get,
    set: set,
    create: create,
    remove: remove
  };

  // helper function
  function doReq(params, url, cb) {

    var reqParams = applyRequestIdHeaders({url: url, json: params, headers: headers});

    logger.debug(reqParams, 'domain props request');
    request.post(reqParams, function(err, res, body) {
      if (err) return cb(err);
      logger.debug({statusCode: res.statusCode, body: body, url: url, headers: res.headers}, 'domain props response');
      if (res.statusCode !== 200) return cb({msg: 'Unexpected response code', statusCode: res.statusCode, error:body});
      return cb(null, body);
    });
  };

  // list properties for a domain
  function list(domain, cb) {
    var params = {
      'eq': ['domainName', domain]
    };
    var url = getMillicoreHost(cfg, null)+ '/box/srv/1.1/ent/ten/DomainProp/list';
    doReq(params, url, cb);
  };

  // get property for a domain
  function get(domain, prop, cb) {
    var params = {
      'eq': ['domainName', domain, 'name', prop]
    };
    var url = getMillicoreHost(cfg, null) + '/box/srv/1.1/ent/ten/DomainProp/list';
    doReq(params, url, function(err, props) {
      if (err) return cb(err);
      var prop = null, guid = null;
      if (props.list.length > 0) {
        prop = props.list[0].fields.value;
        guid = props.list[0].guid;
      }
      return cb(null, prop, guid);
    });
  };

  // set property for a domain, does a get then either a create or an update
  function set(domain, prop, value, cb) {
    // check if prop already exists
    get(domain, prop, function(err, val, guid) {
      if (err) return cb(err);
      var url, params;
      if (val) {
        // do an update
        url = getMillicoreHost(cfg, null)+ '/box/srv/1.1/ent/ten/DomainProp/update';
        params = {
          'guid': guid,
          'fields': {
            'value': value
          }
        };
        doReq(params, url, cb);
      }else {
        create(domain, prop, value, cb);
      }
    });
  };

  // create property
  function create(domain, prop, value, cb) {
    var url = getMillicoreHost(cfg, null) + '/box/srv/1.1/ent/ten/DomainProp/create';
    var params = {
      'fields': {
        'domainName': domain,
        'name': prop,
        'value': value
      }
    };

    doReq(params, url, cb);
  };

  // remove prop
  function remove(domain, prop, cb) {
    get(domain, prop, function(err, val, guid) {
      if (err) return cb(err);
      if (!val) return cb('Property not found: ' + prop);

      var url = getMillicoreHost(cfg, null) + "/box/srv/1.1/ent/ten/DomainProp/delete"
      var params = {
        'guid': guid
      };

      doReq(params, url, cb);
    });
  };
};