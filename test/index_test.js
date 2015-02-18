
/**
 * @list dependencies
 **/

var mocha = require('mocha');
var should = require('should');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var timestamps = require('../');

mongoose.connect('mongodb://localhost/mongoose_timestamps')
mongoose.connection.on('error', function (err) {
  console.error('MongoDB error: ' + err.message);
  console.error('Make sure a mongoDB server is running and accessible by this application')
});

var TimeCopSchema = new Schema({
  email: String
});
TimeCopSchema.plugin(timestamps);
var TimeCop = mongoose.model('TimeCop', TimeCopSchema);

describe('timestamps', function() {
  it('should be set to the same value on creation', function(done) {
    var cop = new TimeCop({ email: 'brian@brian.com' });
    cop.save( function (err) {
      cop.createdAt.should.equal(cop.updatedAt);
      done();
    });
  })
  
  it('should have updatedAt greater than createdAt upon updating', function(done) {
    TimeCop.findOne({email: 'brian@brian.com'}, function (err, found) {
      found.email = 'jeanclaude@vandamme.com';
      setTimeout( function () {
        found.save( function (err, updated) {
          updated.updatedAt.should.be.above(updated.createdAt);
          done();
        });
      }, 1000);
    });
  })

  it('should not update createdAt upon updating with selection', function(done) {
    TimeCop.findOne({email: 'jeanclaude@vandamme.com'}, function (err, found) {
      var createdAt = found.createdAt;
      TimeCop.findOne({email: 'jeanclaude@vandamme.com'}).select('email').exec(function (err, found) {
        found.email = 'brian@brian.com';
        setTimeout( function () {
          found.save( function (err, updated) {
            createdAt.should.eql(updated.createdAt);
            done();
          });
        }, 1000);
      });
    });
  })
})
