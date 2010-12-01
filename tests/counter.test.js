var assert = require('assert')
  , mongoose = require('mongoose').new()
  , document = mongoose.define
  , db = mongoose.connect('mongodb://localhost/mongoose_types_tests')
  , loadTypes = require("../").loadTypes;

loadTypes(mongoose, 'counter');
document('NewsItem')
  .oid('_id')
  .string('title')
  .counter('votes');

var item;

module.exports = {
  before: function (assert, done){
    db.on('connect', function () {
      mongoose.NewsItem.remove({}, function () {
        mongoose.NewsItem.create({title: 'Yep'}, function (err, _item) {
          if (err) throw err;
          item = _item;
          done();
        });
      });
    });
  },
  'test incr': function (assert, done) {
    assert.equal(item.votes, 0);
    item.incr('votes', 1, function (err, _item) {
      assert.equal(_item.votes, 1);
      mongoose.NewsItem.findById(item.id, function (err, found) {
        assert.equal(1, found.votes);
        done();
      });
    });
  },
  'test decr': function (assert, done) {
    mongoose.NewsItem.findById(item.id, function (err, found) {
      assert.equal(1, found.votes);
      found.decr('votes', 2, function (err, _item) {
        assert.equal(-1, _item.votes);
        mongoose.NewsItem.findById(found.id, function (err, refreshed) {
          assert.equal(-1, refreshed.votes);
          done();
        });
      });
    });
  },
  'test incr<Path>': function (assert, done) {
    mongoose.NewsItem.findById(item.id, function (err, found) {
      assert.equal(-1, found.votes);
      found.incrVotes(3, function (err, _item) {
        assert.equal(2, _item.votes);
        mongoose.NewsItem.findById(found.id, function (err, refreshed) {
          assert.equal(2, refreshed.votes);
          done();
        });
      });
    });
  },
  'test decr<Path>': function (assert, done) {
    mongoose.NewsItem.findById(item.id, function (err, found) {
      assert.equal(2, found.votes);
      found.decrVotes(1, function (err, _item) {
        assert.equal(1, _item.votes);
        mongoose.NewsItem.findById(found.id, function (err, refreshed) {
          assert.equal(1, refreshed.votes);
          done();
        });
      });
    });
  },
  teardown: function(){
    mongoose.disconnect();
  }
};
