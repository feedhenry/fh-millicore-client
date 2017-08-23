var proxyquire = require('proxyquire');
var util = require('util');
var assert = require('assert');

var cfg = {
  url: 'http://dummycore'
};

var request = {
  post: function (params, cb) {
    return cb(null, { statusCode: 200 }, {
      "status": "ok"
    });
  }
};
exports.it_should_add_key = function (cb) {
  // mock request module

  var req = {
    "cookies": {
      csrf: "nDo4xAKVUGoH6bvm-WxGma4n;"
    },
    params: {
      domain: 'testing'
    },
    millicoreHeaders: {
      "cookie": "feedhenry=nDo4xAKVUGoH6bvm-WxGma4n;",
      'User-Agent': 'FHC/0.12.0-BUILD-NUMBER linux/2.6.32-38-server',
      host: 'testing.feedhenry.me'
    }
  };

  var mcssh = proxyquire('../../lib/ssh.js', { 'request': request })(cfg);
  mcssh.add(req, { key: '1a', label: 'somelabel' }, function (err, data) {
    assert.ok(!err, 'Unexpected error: ' + util.inspect(err));
    return cb();
  });
};
