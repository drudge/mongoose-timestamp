var assert = require('assert')
  , mongoose = require('mongoose').new()
  , document = mongoose.define
  , db = mongoose.connect('mongodb://localhost/mongoose_types_tests')
  , loadTypes = require("../").loadTypes;

loadTypes(mongoose, 'email');
document('User')
  .oid('_id')
  .email('email');

module.exports = {
  before: function(assert, done){
    db.on('connect', function () {
      mongoose.User.remove({}, function () {
        done();
      });
    });
  },
  'test invalid email validation': function (assert, done) {
    var user = new mongoose.User({email: 'hello'});
    user.save(function (err, _user) {
      assert.ok(_user.errors[0].name === 'email');
      assert.ok(_user.errors[0].path === 'email');
      assert.ok(_user.errors[0].type === 'validation');
      assert.ok(_user.errors[0].message === 'validation email failed for email');
      done();
    });
  },
  'test valid email validation': function (assert, done) {
    mongoose.User.create({ email: 'brian@brian.com' }, function (err, user) {
      assert.equal("undefined", typeof user.errors);
      assert.equal(false, user.isNew);
      done();
    });
  },
  'email should be converted to lowercase': function (assert, done) {
    mongoose.User.create({ email: 'mIxEdCaSe@lowercase.com'}, function (err, user) {
      assert.equal(user.email, 'mixedcase@lowercase.com');
      mongoose.User.findById(user.id, function (err, refreshed) {
        assert.equal(refreshed.email, 'mixedcase@lowercase.com');
        done();
      });
    });
  },
  teardown: function(){
    mongoose.disconnect();
  }
};
