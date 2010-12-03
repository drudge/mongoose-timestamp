## mongoose-types - Useful types and type plugins for Mongoose
---

### Types include:
- Counter
- Email
- Url

### Plugins include:
- useTimestamps
  Adds `createdAt` and `updatedAt` date attributes that get auto-assigned to the create and most-recently-updated datetime respectively.

### Installation
    npm install mongoose-types

### Setup
To include all of the defined types:
    var mongoose = require("mongoose");
    mongoose.connect("mongodb://localhost/sampledb");
    var mongooseTypes = require("mongoose-types");
    mongooseTypes.loadTypes(mongoose);

You can also specify that you only want to load and use a limited subset of the types provided:
    var mongoose = require("mongoose");
    mongoose.connect("mongodb://localhost/sampledb");
    var mongooseTypes = require("mongoose-types");
    // Only load the email and counter types
    mongooseTypes.loadTypes(mongoose, "email", "counter");

### Using the types
Once you are setup, you can begin to use the new types.

#### Counter
    mongoose.define('NewsItem')
      .oid('_id')
      .counter('votes');

    mongoose.NewsItem.create({votes: 0}, function (err, item) {
      console.log(item.votes); // 0
      // We have an incr(...) method
      item.incr('votes', 1, function (err, item) {
        console.log(item.votes); // 1
        // We also have an auto-generated incrVotes(...) method - syntactic sugar ftw!
        item.incrVotes(5, function (err, item) {
          console.log(item.votes); // 6
          // What goes up can also come down :)
          item.decr('votes', 2, function (err, item) {
            console.log(item.votes); // 4
            item.decrVotes(3, function (err, item) {
              console.log(item.votes); // 1
            });
          });
        });
      });
    });

#### Email
    mongoose.define('User')
      .oid('_id')
      .email('homeEmail');
      .email('workEmail');

#### Url
    mongoose.define('Visit')
      .oid('_id')
      .url('url')
      .url('referer');

### Using the plugins

#### The `useTimestamps` plugin

    var mongoose = require("mongoose");
    mongoose.connect("mongodb://localhost/sampledb");
    var mongooseTypes = require("mongoose-types")
      , useTimestamps = mongooseTypes.useTimestamps;
    mongoose.define('User')
      .oid('_id')
      .string('username')
      .plugin(useTimestamps);
    mongoose.User.create({username: 'Prince'}, function (err, user) {
      console.log(user.createdAt); // Should be approximately now
      console.log(user.createdAt === user.updatedAt); // true

      // Wait 1 second and then update the user
      setTimeout( function () {
        user.username = 'Symbol';
        user.save( function (err, user) {
          console.log(user.updatedAt); // Should be approximately createdAt + 1 second
          console.log(user.createdAt < user.updatedAt); // true
        });
      }, 1000);
    });
