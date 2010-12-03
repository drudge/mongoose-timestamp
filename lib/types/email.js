module.exports.loadType = function (mongoose) {
  mongoose.type('email')
    .validate('email', function (value, callback) {
      return callback( /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(value) );
    })
    .set( function (val) {
      return val.toLowerCase();
    })
};
