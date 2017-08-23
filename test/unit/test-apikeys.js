var proxyquire = require('proxyquire');
var util = require('util');
var assert = require('assert');

var cfg = {
  url: 'http://dummycore',
  "scheme":"http://"
};

exports.it_should_list_keys = function(cb){
  var request = {
    post: function(params, cb) {
      assert.ok(params.url);
      return cb(null, {statusCode: 200}, {});
    }
  };
  var req = {
    millicoreHeaders: {
      "cookie": "feedhenry=nDo4xAKVUGoH6bvm-WxGma4n;",
      'User-Agent': 'FHC/0.12.0-BUILD-NUMBER linux/2.6.32-38-server',
      host: 'testing.feedhenry.me'
    },
    param: function(){
      return '';
    },
    params: {
      domain: 'testing'
    }
  };
  var apikeys = proxyquire('../../lib/apikeys.js', {
    request: request
  })(cfg);
  apikeys.list(req, function(err, data){
    assert.ok(!err);
    return cb();
  });
};

exports.it_should_create_key = function(cb){
  var request = {
    post: function(params, cb) {
      assert.ok(params.url);
      assert.ok(params.json.label);
      return cb(null, {statusCode: 200}, {});
    }
  };

  var req = {
    millicoreHeaders: {
      "cookie": "feedhenry=nDo4xAKVUGoH6bvm-WxGma4n;",
      'User-Agent': 'FHC/0.12.0-BUILD-NUMBER linux/2.6.32-38-server',
      host: 'testing.feedhenry.me'
    },
    param: function(){
      return '';
    },
    params: {
      domain: 'testing'
    }
  };

  var apikeys = proxyquire('../../lib/apikeys.js', {
    request: request
  })(cfg);
  apikeys.create(req, 'test', function(err, data){
    assert.ok(!err);
    return cb();
  });
};

exports.it_should_find_or_create_key = function(cb) {
  var listCalled = false;
  var createCalled = false;
  var req = {
    millicoreHeaders: {
      "cookie": "feedhenry=nDo4xAKVUGoH6bvm-WxGma4n;",
      'User-Agent': 'FHC/0.12.0-BUILD-NUMBER linux/2.6.32-38-server',
      host: 'testing.feedhenry.me'
    },
    param: function(){
      return 'testing';
    },
    params: {
      domain: 'testing'
    }
  };

  var request = {
    post: function (params, cb) {
      if (params.url.indexOf('/list') > -1) {
        listCalled = true;
        return cb(null, {statusCode: 200}, {list: [{label:'nottest'}]});
      } else if (params.url.indexOf('/create') > -1) {
        createCalled = true;
        return cb(null, {statusCode: 200}, {apiKey: 'test'});
      } else {
        return cb();
      }
    }
  };

  var apikeys = proxyquire('../../lib/apikeys.js', {
    request: request
  })(cfg);

  apikeys.findOrCreate(req, 'test', function(err, data) {
    assert.ok(!err);
    assert.ok(data);
    assert.ok(listCalled);
    assert.ok(createCalled);
    return cb();
  });
}

exports.it_should_find_or_create_key_with_different_type = function (cb) {
  var req = {
    millicoreHeaders: {
      "cookie": "feedhenry=nDo4xAKVUGoH6bvm-WxGma4n;",
      'User-Agent': 'FHC/0.12.0-BUILD-NUMBER linux/2.6.32-38-server',
      host: 'testing.feedhenry.me'
    },
    param: function(){
      return 'testing';
    },
    params: {
      domain: 'testing'
    }
  };

  var request = {
    post: function (params, cb) {
      assert.equal(params.json.type, 'git_repo');
      return cb(null, {statusCode: 200}, {apiKey: 'test'});
    }
  }

  var apikeys = proxyquire('../../lib/apikeys.js', {
    request: request
  })(cfg);
  apikeys.findOrCreate(req, 'test', apikeys.apiKeyTypes.API_KEY_GIT_TYPE, function (err, data) {
    assert.ok(!err)
    return cb();
  })
}
