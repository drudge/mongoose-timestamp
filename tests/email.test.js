require('should');
var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , db = mongoose.createConnection('mongodb://localhost/mongoose_types_tests');

require("../").loadTypes(mongoose, 'email')

var UserSchema = new Schema({
  email: mongoose.SchemaTypes.Email
});

mongoose.model('User', UserSchema);
var User;

module.exports = {
  before: function(done){
    User = db.model('User', UserSchema);
    User.remove({}, function (err) {
      done();
    });
  },
  'test invalid email validation': function (done) {
    var user = new User({email: 'hello'});
    user.save(function (err) {
      err.should.equal('email is invalid');
      done();
    });
  },
  'test valid email validation': function (done) {
    var user = new User({ email: 'brian@brian.com' });
    user.save(function (err) {
      err.should.eql(null);
      user.isNew.should.be.false;
      done();
    });
  },
  'email should be converted to lowercase': function (done) {
    var user = new User({ email: 'mIxEdCaSe@lowercase.com'});
    user.save(function (err) {
      assert.equal(user.email, 'mixedcase@lowercase.com');
      User.findById(user._id, function (err, refreshed) {
        assert.equal(refreshed.email, 'mixedcase@lowercase.com');
        done();
      });
    });
  },
  teardown: function(){
    db.close();
  }
};
