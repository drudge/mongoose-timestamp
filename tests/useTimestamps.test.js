require('should');
var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , db = mongoose.createConnection('mongodb://localhost/mongoose_types_tests')
  , useTimestamps = require("../").useTimestamps;

mongoose.plugin(useTimestamps);

var TimeCopSchema = new Schema({
  email: String
});

mongoose.model('TimeCop', TimeCopSchema);
var TimeCop;

module.exports = {
  before: function(done){
    TimeCop = db.model('TimeCop', TimeCopSchema);
    TimeCop.remove({}, function () {
      done();
    });
  },
  'createdAt and updatedAt should be set to the same value on creation': function (done) {
    var cop = new TimeCop({ email: 'brian@brian.com' });
    cop.save( function (err) {
      cop.createdAt.should.be.an.instanceof(Date);
      cop.updatedAt.should.be.an.instanceof(Date);
      done();
    });
  },
  'updatedAt should be later than createdAt upon updating': function (done) {
    TimeCop.findOne({email: 'brian@brian.com'}, function (err, found) {
      found.email = 'jeanclaude@vandamme.com';
      setTimeout( function () {
        found.save( function (err, updated) {
          updated.updatedAt.should.be.greater.than(updated.createdAt);
          assert.ok(updated.updatedAt > updated.createdAt);
          done();
        });
      }, 1000);
    });
  },
  teardown: function(){
    db.close();
  }
};
