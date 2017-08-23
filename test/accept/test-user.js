var util = require('util');
var assert = require('assert');

var cfg = {
  url: 'https://testing.feedhenry.me',
  scheme: 'https://'
};

exports.it_should_read_user = function(cb) {
  assert.ok(process.env.FH_COOKIE, 'User acceptance test needs a current FH cookie to run');
  var user = require('../../lib/user.js')(cfg);
  var req = {
    cookies : {
      csrf : '1d7c954363472d1c477b8b1ffd043c6d'
    },
    millicoreHeaders: {
      "cookie": "feedhenry=" + process.env.FH_COOKIE + ";",
      'User-Agent': 'FHC/0.12.0-BUILD-NUMBER linux/2.6.32-38-server',
      host: 'testing.feedhenry.me'
    }
  };
  user.read(req, function(err, props) {
    assert.ok(!err, 'Unexpected error: ' + util.inspect(err));
    return cb();
  });
};
