var proxyquire = require('proxyquire');
var util = require('util');
var assert = require('assert');

var cfg = {
  url: 'http://dummycore',
  scheme: 'https://'
};

exports.it_should_have_permission = function(cb) {
  // mock request module
  var mockProps = {
    domain: 'testing',
    props: {
      'account.registration.free': 'false'
    }
  };

  var request = {
    post: function(params, cb) {
      return cb(null, {statusCode: 200}, mockProps);
    }
  };

  var ap = proxyquire('../../lib/adminprops.js', { 'request': request})(cfg);
  ap.list('testing', function(err, props) {
    assert.ok(!err, 'Unexpected error: ' + util.inspect(err));
    assert.equal(props.domain, 'testing');
    return cb();
  });
};

exports.test_get_props = function(cb){
  var mockProps = {
    domain: 'testing',
    props: {
      'account.registration.free': 'false'
    }
  };
  var request = {
    post: function(params, cb) {
      return cb(null, {statusCode: 200}, mockProps);
    }
  };
  var mockReq = {
    param: function(){
      return 'testing';
    }
  };
  var ap = proxyquire('../../lib/adminprops.js', { 'request': request})(cfg);
  ap.getProps(mockReq, function(err, props){
    assert.ok(!err);
    assert.equal(props['account.registration.free'], 'false');
    cb();
  });
};