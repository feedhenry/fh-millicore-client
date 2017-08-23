var proxyquire = require('proxyquire');
var util = require('util');
var assert = require('assert');

var cfg = {
  url: 'http://dummycore',
  serviceKey: '1234567'
};

exports.it_should_list_props = function(finish) {
  // mock request module
  var request = {
    post: function(params, cb) {
      return cb(null, {statusCode: 200}, {yo:'ho'});
    }
  };

  var dp = proxyquire('../../lib/domainprops.js', { 'request': request})(cfg);
  dp.list('dummydomain', function(err, data) {
    assert.ok(!err, 'Unexpected error: ' + util.inspect(err));
    return finish();
  });
};

exports.it_should_set_prop = function(finish) {
  var gotUpdate = false;
  // mock request module
  var request = {
    post: function(params, cb) {
      if (params.url.indexOf('list') !== -1) {
        return cb(null, {statusCode: 200}, {list: [{guid: 123, fields:{value:'val'}}]});
      }
      if (params.url.indexOf('update') !== -1) {
        if (params.json.fields.value  === 'val') gotUpdate = true;
      }
      return cb(null, {statusCode: 200}, {});
    }
  };

  var dp = proxyquire('../../lib/domainprops.js', { 'request': request})(cfg);
  dp.set('dummydomain', 'prop', 'val', function(err, data) {
    assert.ok(!err, 'Unexpected error: ' + util.inspect(err));
    assert.ok(gotUpdate, "Expected to get 'update' correctly");
    return finish();
  });
};

exports.it_should_create_prop = function(finish) {
  // mock request module
  var request = {
    post: function(params, cb) {
      return cb(null, {statusCode: 200}, {list: [{guid: 123, fields:{value:'val'}}]});
    }
  };

  var dp = proxyquire('../../lib/domainprops.js', { 'request': request})(cfg);
  dp.create('dummydomain', 'prop', 'val', function(err, data) {
    assert.ok(!err, 'Unexpected error: ' + util.inspect(err));
    return finish();
  });
};

exports.it_should_remove_prop = function(finish) {
  // mock request module
  var request = {
    post: function(params, cb) {
      return cb(null, {statusCode: 200}, {list: [{guid: 123, fields:{value:'val'}}]});
    }
  };

  var dp = proxyquire('../../lib/domainprops.js', { 'request': request})(cfg);
  dp.remove('dummydomain', 'prop', function(err, data) {
    assert.ok(!err, 'Unexpected error: ' + util.inspect(err));
    return finish();
  });
};
