var millicoreClient = require('../../index.js');
var assert = require('assert');

module.exports = {
  "It Should Only Use A Single Client Instance": function(done){
    var mc = millicoreClient({
      confKey: "confVal"
    });


    var mc2 = millicoreClient();

    //Executing the function again should return the same object
    assert.strictEqual(mc, mc2);
    done();
  }
};