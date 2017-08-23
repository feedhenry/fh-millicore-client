var proxyquire = require('proxyquire');
var util = require('util');
var assert = require('assert');



var mocks = {
     "request":{
       "post":function (opts,cb){
          console.log("called mock request");
          return cb(undefined,{"statusCode":200},{});
       }
     }

};

var cfg = {
  url: 'https://testing.feedhenry.me',
  scheme: 'https://'
};

exports.it_should_return_business_objects = function(cb) {
  var businessObjects = proxyquire('../../lib/businessObjects.js',mocks)(cfg);
  var req = {
    millicoreHeaders: {
      "cookie": "feedhenry=x0Jzv53jfmgrNj8R6PUPMaMt;",
      'User-Agent': 'FHC/0.12.0-BUILD-NUMBER linux/2.6.32-38-server',
      host: 'testing.feedhenry.me'
    }
  };
  businessObjects.getBusinessObjects(req, 'cluster', {}, function(err) {
    assert.ok(!err, 'Unexpected error: ' + util.inspect(err));
    return cb();
  });
};
