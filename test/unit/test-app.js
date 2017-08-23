var proxyquire = require('proxyquire');
var util = require('util');
var assert = require('assert');

var cfg = {
  url: 'http://dummycore',
  "scheme":"http://"
};

exports.it_should_read_app = function(cb) {
  // mock request module
  var request = {
    get: function(params, cb) {
      return cb(null, {statusCode: 200}, {});
    }
  };
  var req = {
    millicoreHeaders: {
      "cookie": "feedhenry=nDo4xAKVUGoH6bvm-WxGma4n;",
      'User-Agent': 'FHC/0.12.0-BUILD-NUMBER linux/2.6.32-38-server',
      host: 'testing.feedhenry.me'
    }
  };

  var mcapp = proxyquire('../../lib/app.js', { 'request': request})(cfg);
  mcapp.read(req, 123, function(err, data) {
    assert.ok(!err, 'Unexpected error: ' + util.inspect(err));
    return cb();
  });
};


exports.it_should_list_apps = function(cb) {
  // mock request module
  var request = {
    get: function(params, cb) {
      return cb(null, {statusCode: 200}, {});
    }
  };
  var req = {
    millicoreHeaders: {
      "cookie": "feedhenry=nDo4xAKVUGoH6bvm-WxGma4n;",
      'User-Agent': 'FHC/0.12.0-BUILD-NUMBER linux/2.6.32-38-server',
      host: 'testing.feedhenry.me'
    },
    "query":{}
  };

  var mcapp = proxyquire('../../lib/app.js', { 'request': request})(cfg);
  mcapp.list(req, function(err, data) {
    assert.ok(!err, 'Unexpected error: ' + util.inspect(err));
    return cb();
  });
};

exports.it_should_create_app = function(cb) {
  // mock request module
  var request = {
    post: function(params, cb) {
      return cb(null, {statusCode: 200}, {status:'ok'});
    }
  };
  var req = {
    millicoreHeaders: {
      "cookie": "feedhenry=nDo4xAKVUGoH6bvm-WxGma4n;",
      'User-Agent': 'FHC/0.12.0-BUILD-NUMBER linux/2.6.32-38-server',
      host: 'testing.feedhenry.me'
    }
  };
  var mcapp = proxyquire('../../lib/app.js', { 'request': request})(cfg);
  mcapp.import_url(req, {title: 'New App Name', url: 'url_to_import'}, function(err, data) {
    assert.ok(!err, 'Unexpected error: ' + util.inspect(err));
    return cb();
  });
};