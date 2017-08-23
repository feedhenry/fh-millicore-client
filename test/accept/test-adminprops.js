var util = require('util');
var assert = require('assert');

var cfg = {
  url: 'https://localhost',
  "serviceKey": "ZYXWVUTSRQPONM0987654321"
};

exports.it_should_list_admin_props = function(cb) {
  var ap = require('../../lib/adminprops.js')(cfg);
  ap.list('testing', function(err, props) {
    assert.ok(!err, 'Unexpected error: ' + util.inspect(err));
    return cb();
  });
};
