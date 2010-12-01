module.exports.loadType = function (mongoose) {
  mongoose.type('counter')
    .extend('number')
    .default(0)
    .setup( function (key, path) { /** @scope is the Schema instance **/
      var schema = this;
      ['incr', 'decr'].forEach( function (methodToAdd) {
        var method = function (path, delta, fn) { /** @scope is a Document instance **/
          if (this.isNew || !this.id) throw new Error("You can only increment keys of documents that already have been persisted to mongodb.");
          var arg1type = typeof arguments[1];
          if (arg1type === "undefined") { // incr(path)
            delta = 1;
          } else if (arg1type === "function") { // incr(path, fn)
            fn = delta;
            delta = 1;
          } // Else we had invoked: incr(path, delta[, fn]); // i.e. arg1type === "number"
          var mongooseDoc = this,
              incObj = {}, fieldsObj = {};
          switch (methodToAdd) {
            case ('incr'):
              incObj[path] = delta;
              break;
            case('decr'):
              incObj[path] = -1 * delta;
              break;
          }
          fieldsObj[path] = 1;
          this._collection.findAndModify({'_id': this._id}, [], {'$inc': incObj}, {'new': true, fields: fieldsObj}, function (err, doc) {
            if (doc) mongooseDoc.set(path, doc[path], true);
            if (fn) fn(err, mongooseDoc);
          });
        };

        // Add the `incr` and `decr` methods
        if (!schema._methods[methodToAdd]) {
          schema.method(methodToAdd, method);
        }

        // If path is -- e.g., 'vote' --
        // then add the `incrVote` and `decrVote` methods
        var ucasePath = path[0].toUpperCase() + path.substring(1);
        schema.method(methodToAdd + ucasePath, function (path) {
          // Currying ftw!
          return function (delta, fn) { /** @scope is a Document instance **/
            method.call(this, path, delta, fn);
          };
        }(path));
      });
    });
};
