var proxyquire = require('proxyquire');
var util = require('util');
var assert = require('assert');

var cfg = {
  url: 'http://dummycore',
  "scheme":"http://"
};

//Test for adding milliore services listing to supercore. This is useful for listing services associated with data sources/targets.
module.exports.it_should_list_services = function(done){
  // mock request module
  var request = {
    get: function(params, cb) {
      return cb(null, {statusCode: 200}, [{
        guid: "someserviceguid",
        title: "Some Service Title"
      }]);
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

  var mcservice = proxyquire('../../lib/services.js', { 'request': request})(cfg);
  mcservice.list(req, function(err, services) {
    assert.ok(!err, 'Unexpected error: ' + util.inspect(err));
    assert.ok(services[0].guid, "Expected A Service Guid");
    return done();
  });
};