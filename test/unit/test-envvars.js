var proxyquire = require('proxyquire');
var util = require('util');
var assert = require('assert');

var cfg = {
  serviceKey: '12345',
  url: 'http://dummycore'
};

exports.it_should_create_envvars = function(finish) {
  var request = {
    post: function (params, cb) {
      return cb(null, {statusCode: 200}, {});
    }
  };

  var envvars = proxyquire('../../lib/envvars.js', {
    'request': request
  })(cfg);

  var params = {
    guid: 'test',
    env: 'test',
    domain: 'test'
  };

  var body = {
    name: "TEST",
    value: "TEST",
    domain: "test"
  };

  var param = function (p) {
    return params[p] || body[p]
  };

  var req = {
    param: param,
    params: params,
    body: body
  };

  envvars.create(req, function(err, data) {
    assert.ok(!err, 'Unexpected error: ' + util.inspect(err));
    assert.ok(data);
    return finish();
  });
};

exports.it_should_update_envvars = function(finish) {
  var request = {
    put: function (params, cb) {
      return cb(null, {statusCode: 200}, {});
    }
  };

  var envvars = proxyquire('../../lib/envvars.js', {
    'request': request
  })(cfg);

  var params = {
    guid: 'test',
    env: 'test',
    domain: 'test',
    envVarGuid: 'test'
  };

  var body = {
    name: "TEST",
    value: "TEST",
    domain: "test"
  };

  var param = function (p) {
    return params[p] || body[p]
  };

  var req = {
    param: param,
    params: params,
    body: body
  };

  envvars.update(req, function(err, data) {
    assert.ok(!err, 'Unexpected error: ' + util.inspect(err));
    assert.ok(data);
    return finish();
  });
};

exports.it_should_delete_envvars = function(finish) {
  var request = {
    del: function (params, cb) {
      return cb(null, {statusCode: 200}, {});
    }
  };

  var envvars = proxyquire('../../lib/envvars.js', {
    'request': request
  })(cfg);

  var params = {
    guid: 'test',
    env: 'test',
    domain: 'test',
    envVarGuid: 'test'
  };

  var body = {};

  var param = function (p) {
    return params[p] || body[p]
  };

  var req = {
    param: param,
    params: params,
    body: body
  };

  envvars.del(req, function(err, data) {
    assert.ok(!err, 'Unexpected error: ' + util.inspect(err));
    assert.ok(data);
    return finish();
  });
};

exports.it_should_list_envvars = function(finish) {
  var request = {
    get: function (params, cb) {
      return cb(null, {statusCode: 200}, {});
    }
  };

  var envvars = proxyquire('../../lib/envvars.js', {
    'request': request
  })(cfg);

  var params = {
    guid: 'test',
    env: 'test',
    domain: 'test'
  };

  var body = {
  };

  var param = function (p) {
    return params[p] || body[p]
  };

  var req = {
    param: param,
    params: params,
    body: body
  };

  envvars.list(req, 'test', function(err, data) {
    assert.ok(!err, 'Unexpected error: ' + util.inspect(err));
    assert.ok(data);
    return finish();
  });
};
