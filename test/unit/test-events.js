var proxyquire = require('proxyquire');
var util = require('util');
var assert = require('assert');

var cfg = {
  url: 'http://dummycore',
  "scheme":"http://"
};

exports.it_should_list_events = function(cb) {
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

  var events = proxyquire('../../lib/events.js', { 'request': request})(cfg);
  events.list(req, 'test',"env", function(err, data) {
    assert.ok(!err, 'Unexpected error: ' + util.inspect(err));
    assert.ok(data);
    return cb();
  });
};
