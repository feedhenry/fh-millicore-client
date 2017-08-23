var proxyquire = require('proxyquire');
var util = require('util');
var assert = require('assert');

var cfg = {
  url: 'http://dummycore',
  "scheme":"http://"
};

exports.it_should_post_notification_message = function(cb) {
  // mock request module
  var request = {
    post: function(params, cb) {
      return cb(null, {statusCode: 202}, {});
    }
  };
  var req = {
    millicoreHeaders: {
      "cookie": "feedhenry=nDo4xAKVUGoH6bvm-WxGma4n;",
      'User-Agent': 'FHC/0.12.0-BUILD-NUMBER linux/2.6.32-38-server',
      host: 'testing.feedhenry.me'
    }
  };

  var formsNotification = proxyquire('../../lib/forms_notifications.js', { 'request': request})(cfg);
  formsNotification.submissionNotification(req, {"test":"test"}, function(err) {
    assert.ok(!err, 'Unexpected error: ' + util.inspect(err));
    return cb();
  });
};
