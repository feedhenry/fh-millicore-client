const assert = require('assert');
const millicoreHost = require('../../lib/util/getMillicoreHost');

// Sample config.
const cfg = {
  url: 'http://dummycore'
};

// Sample request containing host header.
const req = {
  headers: {
    host: 'test-host'
  }
};

// Sample request containing referer.
const req1 = {
  headers: {
    referer: 'test-referer'
  }
};

exports.it_should_return_url = function(done) {
  var res = millicoreHost(cfg, null);
  assert.strictEqual(res, cfg.url);
  done();
};

exports.it_should_overwrite_referer_value = function(done) {
  millicoreHost(cfg, req);
  assert.strictEqual(req.headers.referer, req.headers.host);
  done();
};

exports.it_should_not_overwrite_referer_value = function (done) {
  millicoreHost(cfg, req1)
  assert.strictEqual(req1.headers.referer, req1.headers.referer)
  done();
};

