var proxyquire = require('proxyquire');
var util = require('util');
var assert = require('assert');

var cfg = {
  url: 'http://dummycore',
  "scheme":"http://"
};

exports.it_should_list_alerts = function(cb) {
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

  var alerts = proxyquire('../../lib/alerts.js', { 'request': request})(cfg);
  alerts.list(req, 'test',"env", function(err, data) {
    assert.ok(!err, 'Unexpected error: ' + util.inspect(err));
    assert.ok(data);
    return cb();
  });
};


exports.it_should_create_alert = function(cb) {
  // mock request module
  var request = {
    post: function(params, cb) {
      return cb(null, {statusCode: 200}, {});
    }
  };
  var req = {
    "body":{},
    millicoreHeaders: {
      "cookie": "feedhenry=nDo4xAKVUGoH6bvm-WxGma4n;",
      'User-Agent': 'FHC/0.12.0-BUILD-NUMBER linux/2.6.32-38-server',
      host: 'testing.feedhenry.me'
    }
  };

  var alerts = proxyquire('../../lib/alerts.js', { 'request': request})(cfg);
  alerts.create(req, 'test',"env", function(err, data) {
    assert.ok(!err, 'Unexpected error: ' + util.inspect(err));
    assert.ok(data);
    return cb();
  });
};


exports.it_should_delete_alert = function(cb) {
  // mock request module
  var request = {
    post: function(params, cb) {
      return cb(null, {statusCode: 200}, {});
    }
  };
  var req = {
    "body":{},
    millicoreHeaders: {
      "cookie": "feedhenry=nDo4xAKVUGoH6bvm-WxGma4n;",
      'User-Agent': 'FHC/0.12.0-BUILD-NUMBER linux/2.6.32-38-server',
      host: 'testing.feedhenry.me'
    }
  };

  var alerts = proxyquire('../../lib/alerts.js', { 'request': request})(cfg);
  alerts.del(req, 'test',"env", function(err, data) {
    assert.ok(!err, 'Unexpected error: ' + util.inspect(err));
    assert.ok(data);
    return cb();
  });
};


exports.it_should_update_alert = function(cb) {
  // mock request module
  var request = {
    post: function(params, cb) {
      return cb(null, {statusCode: 200}, {});
    }
  };
  var req = {
    "body":{},
    millicoreHeaders: {
      "cookie": "feedhenry=nDo4xAKVUGoH6bvm-WxGma4n;",
      'User-Agent': 'FHC/0.12.0-BUILD-NUMBER linux/2.6.32-38-server',
      host: 'testing.feedhenry.me'
    }
  };

  var alerts = proxyquire('../../lib/alerts.js', { 'request': request})(cfg);
  alerts.update(req, 'test',"env", function(err, data) {
    assert.ok(!err, 'Unexpected error: ' + util.inspect(err));
    assert.ok(data);
    return cb();
  });
};

exports.it_should_test_emails = function(cb) {
  // mock request module
  var request = {
    post: function(params, cb) {
      return cb(null, {statusCode: 200}, {});
    }
  };
  var req = {
    "body":{},
    millicoreHeaders: {
      "cookie": "feedhenry=nDo4xAKVUGoH6bvm-WxGma4n;",
      'User-Agent': 'FHC/0.12.0-BUILD-NUMBER linux/2.6.32-38-server',
      host: 'testing.feedhenry.me'
    }
  };

  var alerts = proxyquire('../../lib/alerts.js', { 'request': request})(cfg);
  alerts.testEmails(req, 'test',"env", function(err, data) {
    assert.ok(!err, 'Unexpected error: ' + util.inspect(err));
    assert.ok(data);
    return cb();
  });
};
