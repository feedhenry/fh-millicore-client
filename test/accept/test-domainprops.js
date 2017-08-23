var util = require('util');
var assert = require('assert');

var cfg = {
  url: 'https://localhost',
  "serviceKey": "ZYXWVUTSRQPONM0987654321"
};

exports.it_should_list_domain_props = function(cb) {
  var dp = require('../../lib/domainprops.js')(cfg);
  dp.list('testing', function(err, props) {
    assert.ok(!err, 'Unexpected error: ' + util.inspect(err));
    assert.ok(props.list);
    return cb();
  });
};

exports.it_should_get_set_remove_domain_prop = function(cb) {
  var dp = require('../../lib/domainprops.js')(cfg);
  dp.set('testing', 'prop1', 'val1', function(err, data) {
    assert.ok(!err, 'Unexpected error: ' + util.inspect(err));

    // now get the prop and see if its ok..
    dp.get('testing', 'prop1', function(err, val) {
      assert.ok(!err, 'Unexpected error: ' + util.inspect(err));
      assert.equal(val, 'val1');

      dp.remove('testing', 'prop1', function(err, data) {
        assert.ok(!err, 'Unexpected error: ' + util.inspect(err));

        // get it again, make sure removed..
        dp.get('testing', 'prop1', function(err, val) {
          assert.ok(!err, 'Unexpected error: ' + util.inspect(err));
          assert.equal(val, null);
          return cb();
        });
      });
    });
  });
};

exports.it_should_fail_when_create_called_twuce = function(cb) {
  var dp = require('../../lib/domainprops.js')(cfg);
  dp.remove('testing', 'p1', function(err, data) {
    // err purposely ignored

    dp.create('testing', 'p1', 'v1', function(err, data) {
      assert.ok(!err, 'Unexpected error: ' + util.inspect(err));

      dp.create('testing', 'p1', 'v2', function(err, data) {
        assert.ok(err, 'Expected an error here as propery already set');
        cb();
      });
    });
  });
};
