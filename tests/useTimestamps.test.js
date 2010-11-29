var assert = require('assert')
  , mongoose = require('mongoose').new()
  , document = mongoose.define
  , db = mongoose.connect('mongodb://localhost/mongoose_types_tests')
  , loadTypes = require("../").loadTypes
  , useTimestamps = require("../").useTimestamps;

document('TimeCop')
  .email('email')
  .plugin(useTimestamps);

module.exports = {
  before: function(assert, done){
    db.on('connect', function () {
      mongoose.TimeCop.remove({}, function () {
        done();
      });
    });
  },
  'createdAt and updatedAt should be set to the same value on creation': function (assert, done) {
    mongoose.TimeCop.create({ email: 'brian@brian.com' }, function (err, cop) {
      assert.ok(cop.createdAt instanceof Date);
      assert.equal(cop.updatedAt, cop.createdAt);
      done();
    });
  },
  'updatedAt should be later than createdAt upon updating': function (assert, done) {
    mongoose.TimeCop.first({email: 'brian@brian.com'}, function (err, found) {
      found.email = 'jeanclaude@vandamme.com';
      setTimeout( function () {
        found.save( function (err, updated) {
          assert.ok(updated.updatedAt > updated.createdAt);
          done();
        });
      }, 1000);
    });
  },
  teardown: function(){
    mongoose.disconnect();
  }
};
