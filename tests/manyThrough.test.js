var assert = require('assert')
  , _mongoose = require('mongoose')
  , mongoose = _mongoose.new()
  , document = mongoose.define
  , db = mongoose.connect('mongodb://localhost/mongoose_types_tests')
  , loadTypes = require("../").loadTypes
  , DBRef = _mongoose.DBRef;

// TODO Add mongoose warning if we don't specify oid in schema declaration
loadTypes(mongoose, 'manyThrough');
document('User')
  .oid('_id')
  .string('uname')
  .manyThrough('favorites', 'Tweet', {thru: 'Favorite', from: 'user', to: 'tweet'});

document('Tweet')
  .oid('_id')
  .string('status')
  .manyThrough('lovers', 'User', {thru: 'Favorite', from: 'tweet', to: 'user'});

document('Favorite')
  .oid('_id')
  .dbref('tweet', 'Tweet')
  .dbref('user', 'User');

module.exports = {
  before: function(assert, done){
    db.on('connect', function () {
      mongoose.Favorite.remove({}, function () {
        mongoose.Tweet.remove({}, function () {
          mongoose.User.remove({}, done);
        });
      });
    });
  },
  'a manyThrough relation should be able to determine "quickly" whether it references another object': function (assert, done) {
    mongoose.User.create({uname: 'bnoguchi'}, function (err, user) {
      if (err) throw err;
      mongoose.Tweet.create({status: 'tweet 1'}, function (err, tweet) {
        mongoose.Favorite.create({
          user: new DBRef(user._schema._collection, user._id),
          tweet: new DBRef(tweet._schema._collection, tweet._id)
        }, function (err, fav) {

          // This shouldn't have to de-reference the relation all the way to the user, only to the pass-thru object
          user.favorites.has(tweet, function (err, yes) {
            assert.equal(yes, true);
            mongoose.Tweet.create({status: 'anti-social'}, function (err, tweet2) {
              user.favorites.has(tweet2, function (err, yes) {
                assert.equal(yes, false);
                done();
              });
            });
          });
        });
      });
    });
  },
  'adding an object to a manyThrough relation should create a matching object of the pass-thru type': function (assert, done) {
    mongoose.User.create({uname: 'jt'}, function (err, user) {
      if (err) throw err;
      mongoose.Tweet.create({status: '@jt'}, function (err, tweet) {
        user.favorites.add(tweet, function (err) {
          mongoose.Favorite.first({
            user: new DBRef(user._schema._collection, user._id),
            tweet: new DBRef(tweet._schema._collection, tweet._id)
          }, function (err, found) {
            assert.equal(err, null);
            assert.equal(found instanceof mongoose.Favorite, true);
            done();
          });
        });
      });
    });
  },
//  'a manyThrough relation should determine quickly whether it references one or more objects with aset of attributes': function (assert, done) {
//    // TODO
//  },
//  'a manyThrough relation should determine quickly whether it references an object with a particular id': function (assert, done) {
//    // TODO
//  },
//  'a manyThrough relation should hop to the desired object': function (assert, done) {
//    mongoose.User.create({uname: 'bnoguchi'}, function (err, user) {
//      mongoose.Tweet.create({status: 'tweet 1'}, function (err, tweet) {
//        mongoose.Favorite.create({
//          user: new DBRef(user._schema._collection, user._id),
//          tweet: new DBRef(tweet._schema._collection, tweet._id)
//        }, function (err, fav) {
//          user.favorites.all(function (err, tweets) {
//            assert.equal(tweets.length, 1);
//            var _fav = tweets[0];
//            assert.equal(_fav.id, tweet.id);
//            assert.equal(_fav.status, tweet.status);
//            done();
//          });
//        });
//      });
//    });
//  },
//  'a manyThrough relation should be able to create a new target object (sugar ftw!) with attributes': function (assert, done) {
//    mongoose.User.create({uname: 'brian'}, function (err, user) {
//      user.favorites.create({status: 'hello'}, function (err, tweet) {
//        assert.ok(tweet instanceof mongoose.Tweet);
//        done();
//      });
//    });
//  },
//  'a manyThrough relation should be able to add to itself via DBRef': function (assert, done) {
//    mongoose.Tweet.create({status: 'hello world'}, function (err, createdTweet) {
//      mongoose.User.create({uname: 'nate'}, function (err, user) {
//        user.favorites.create({status: 'hello'}, function (err, tweet) {
//          assert.ok(tweet instanceof mongoose.Tweet);
//          done();
//        });
//      });
//    });
//  },
  teardown: function(){
    mongoose.disconnect();
  }
};
