require('should');
var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , db = mongoose.createConnection('mongodb://localhost/mongoose_types_tests');

require("../").loadTypes(mongoose, 'email');

var UserSchema = new Schema({
  email: mongoose.SchemaTypes.Email
});

mongoose.model('User', UserSchema);
var User;

module.exports = {
  before: function(){
    User = db.model('User', UserSchema);
    User.remove({}, function (err) {});
  },
  'test invalid email validation': function () {
    var user = new User({email: 'hello'});
    user.save(function (err) {
      err.message.should.equal('Validator "email is invalid" failed for path email');
      user.isNew.should.be.true;
    });
  },
  'test valid email validation': function () {
    var user = new User({ email: 'brian@brian.com' });
    user.save(function (err) {
      err.should.eql(null);
      user.isNew.should.be.false;
    });
  },
  'email should be converted to lowercase': function () {
    var user = new User({ email: 'mIxEdCaSe@lowercase.com'});
    user.save(function (err) {
      user.email.should.equal('mixedcase@lowercase.com');
      User.findById(user._id, function (err, refreshed) {
        refreshed.email.should.equal('mixedcase@lowercase.com');
      });
    });
  },
  teardown: function(){
    db.close();
  }
};
