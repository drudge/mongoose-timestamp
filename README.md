mongoose-types - Useful types and type plugins for Mongoose
==============

### Types include:
- Email
- Url

### Plugins include:
- useTimestamps
  Adds `createdAt` and `updatedAt` date attributes that get auto-assigned to the most recent create/update timestamp.

### Installation
    npm install mongoose-types

### Setup
To include all of the defined types:
    var mongoose = require("mongoose");
    var db = mongoose.createConnection("mongodb://localhost/sampledb");
    var mongooseTypes = require("mongoose-types");
    mongooseTypes.loadTypes(mongoose);

You can also specify that you only want to load and use a limited subset of the types provided:
    var mongoose = require("mongoose");
    var db = mongoose.createConnection("mongodb://localhost/sampledb");
    var mongooseTypes = require("mongoose-types");
    // Only load the email type
    mongooseTypes.loadTypes(mongoose, "email");

### Using the types
Once you are setup, you can begin to use the new types.

#### Email
    var Email = mongoose.SchemaTypes.Email;
    var UserSchema = new Schema({
      email: {
          work: Email
        , home: Email
      }
    });

#### Url
    var Url = mongoose.SchemaTypes.Url;
    var VisitSchema = new Schema({
        url: Url
      , referer: Url
    });

### Using the plugins

#### The `useTimestamps` plugin

    var mongoose = require("mongoose");
    var db = mongoose.createConnection("mongodb://localhost/sampledb");
    var mongooseTypes = require("mongoose-types")
      , useTimestamps = mongooseTypes.useTimestamps;
    var UserSchema = new Schema({
        username: String
    });
    UserSchema.plugin(useTimestamps);
    mongoose.model('User', UserSchema);
    var User = db.model('User', UserSchema);
    
    var user = new User({username: 'Prince'});
    user.save(function (err) {
      console.log(user.createdAt); // Should be approximately now
      console.log(user.createdAt === user.updatedAt); // true

      // Wait 1 second and then update the user
      setTimeout( function () {
        user.username = 'Symbol';
        user.save( function (err) {
          console.log(user.updatedAt); // Should be approximately createdAt + 1 second
          console.log(user.createdAt < user.updatedAt); // true
        });
      }, 1000);
    });

## Tests
To run tests:
    make test

### Contributors
- [Brian Noguchi](https://github.com/bnoguchi)

### License
MIT License

---
### Author
Brian Noguchi
