var proxyquire = require('proxyquire');
var util = require('util');
var assert = require('assert');

var cfg = {
  url: 'http://dummycore'
};

exports.it_should_ping = function(finish) {
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

  var misc = proxyquire('../../lib/misc.js', { 'request': request})(cfg);
  misc.ping(function(err, data) {
    assert.ok(!err, 'Unexpected error: ' + util.inspect(err));
    assert.ok(data);
    return finish();
  });
};
