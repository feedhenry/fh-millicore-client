var proxyquire = require('proxyquire');
var util = require('util');
var assert = require('assert');

var cfg = {
  url: 'http://dummycore'
};

var request = {
  post: function(params, cb) {
    return cb(null, {statusCode: 200}, {
      "userName": "foo",
      "accountType": "devadmin",
      "created": 1384186939392,
      "displayName": "foo",
      "domain": "testing",
      "email": "foo@example.com",
      "prefs": {
        "accountType": "enterprise"
      }
    });
  },

  get: function(params, cb){
    return cb(null, {statusCode: 200}, [{
      "userName": "foo",
      "accountType": "devadmin",
      "created": 1384186939392,
      "displayName": "foo",
      "domain": "testing",
      "email": "foo@example.com",
      "prefs": {
        "accountType": "enterprise"
      }
    }]);
  }
};
exports.it_should_read_user = function(cb) {
  // mock request module

  var req = {
    "cookies": {
      csrf: "nDo4xAKVUGoH6bvm-WxGma4n;"
    },
    millicoreHeaders: {
      "cookie": "feedhenry=nDo4xAKVUGoH6bvm-WxGma4n;",
      'User-Agent': 'FHC/0.12.0-BUILD-NUMBER linux/2.6.32-38-server',
      host: 'testing.feedhenry.me'
    }
  };

  var mcuser = proxyquire('../../lib/user.js', { 'request': request})(cfg);
  mcuser.read(req, function(err, data) {
    assert.ok(!err, 'Unexpected error: ' + util.inspect(err));
    return cb();
  });
};

exports.it_should_list_domain_users = function(cb){
  var req = {
    "cookies": {
      csrf: "nDo4xAKVUGoH6bvm-WxGma4n;"
    },
    millicoreHeaders: {
      "cookie": "feedhenry=nDo4xAKVUGoH6bvm-WxGma4n;",
      'User-Agent': 'FHC/0.12.0-BUILD-NUMBER linux/2.6.32-38-server',
      host: 'testing.feedhenry.me'
    }
  };

  var mcuser = proxyquire('../../lib/user.js', { 'request': request})(cfg);
  mcuser.listForDomain(req, 'testing', function(err){
    assert.ok(!err, 'Unexpected error: ' + util.inspect(err));
    return cb();
  });
}

