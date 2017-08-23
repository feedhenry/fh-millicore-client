var proxyquire = require('proxyquire');
var util = require('util');
var assert = require('assert');

var cfg = {
  url: 'http://dummycore',
  "scheme":"http://"
};


exports.it_should_list_form_templates = function(finished){
  var request = {
    get: function(params, cb) {
      return cb(null, {statusCode: 200}, {"message": "", "status": "ok", "result": "[{\"_id\":\"formId1234\"}]"});
    }
  };
  var req = {
    millicoreHeaders: {
      "cookie": "feedhenry=nDo4xAKVUGoH6bvm-WxGma4n;",
      'User-Agent': 'FHC/0.12.0-BUILD-NUMBER linux/2.6.32-38-server',
      host: 'testing.feedhenry.me'
    }
  };

  var mcTemplates = proxyquire('../../lib/templates.js', { 'request': request})(cfg);
  mcTemplates.listFormTemplates(req, function(err, data) {
    assert.ok(!err, 'Unexpected error: ' + util.inspect(err));
    assert.ok(data.forms, "Forms should not be undefined");
    assert.ok(Array.isArray(data.forms), "result was not an array " + util.inspect(data));
    assert.ok(data.forms.length === 1);
    assert.ok(data.forms[0]._id === "formId1234");
    return finished();
  });
};


exports.it_should_list_theme_templates = function(finished){
  var request = {
    get: function(params, cb) {
      return cb(null, {statusCode: 200}, {"message": "", "status": "ok", "result": "[{\"_id\":\"themeId1234\"}]"});
    }
  };
  var req = {
    millicoreHeaders: {
      "cookie": "feedhenry=nDo4xAKVUGoH6bvm-WxGma4n;",
      'User-Agent': 'FHC/0.12.0-BUILD-NUMBER linux/2.6.32-38-server',
      host: 'testing.feedhenry.me'
    }
  };

  var mcTemplates = proxyquire('../../lib/templates.js', { 'request': request})(cfg);
  mcTemplates.listThemeTemplates(req, function(err, data) {
    assert.ok(!err, 'Unexpected error: ' + util.inspect(err));
    assert.ok(data.themes, "Themes should not be undefined");
    assert.ok(Array.isArray(data.themes));
    assert.ok(data.themes.length === 1);
    assert.ok(data.themes[0]._id === "themeId1234");
    return finished();
  });
};
