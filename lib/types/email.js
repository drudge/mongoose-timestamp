var mongoose = require('mongoose')

module.exports.loadType = function (mongoose) {
  var SchemaTypes = mongoose.SchemaTypes;

  function Email (path, options) {
    SchemaTypes.String.call(this, path, options);
    function validateEmail (val) {
      return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(val);
    }
    this.validate(validateEmail, 'email is invalid');
  }
  Email.prototype.__proto__ = SchemaTypes.String.prototype;
  Email.prototype.cast = function (val) {
    return val.toLowerCase();
  };
  SchemaTypes.Email = Email;
  mongoose.Types.Email = String;
};
