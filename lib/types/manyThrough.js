var _mongoose = require('mongoose')
  , ObjectID = _mongoose.ObjectID
  , DBRef = _mongoose.DBRef;

module.exports.loadType = function (mongoose) {
  function ManyThrough (docs, parentDoc, path, hydrate) {
    this.parent = parentDoc;
    this.arr = [];

    var type = parentDoc._schema.paths[path];
    this.memberType = type.subtype;
    this.referredThruType = mongoose[type.options.thru];
    this.parentReferredAs = type.options.from;
    this.targetReferredAs = type.options.to;
  }

  // TODO What about querying when we have paginated sets?
  ManyThrough.prototype.has = function (desired, fn) {
    var didDerefMembers = this.arr.length > 0,
        conditions = {};
    if (desired instanceof this.memberType) { // A fully resolved mongoose Document instance
      if (!didDerefMembers) {
        conditions[this.parentReferredAs] = new DBRef(this.parent._schema._collection, this.parent._id);
        conditions[this.targetReferredAs] = new DBRef(desired._schema._collection, desired._id);
        this.referredThruType.find(conditions).first( function (err, found) {
          if (err) fn(err, null);
          else if (found) fn(null, true);
          else fn(null, false);
        });
      } else {
        // TODO
        throw new Error("Unimplemented");
      }
    } else if (desired instanceof ObjectID || typeof desired === "string") { // A mongodb oid
      // TODO
      throw new Error("Unimplemented");
    } else if (typeof desired === "object") { // Set of attributes
      // TODO
      throw new Error("Unimplemented");
    } else {
      // TODO Test
      throw new Error("Type error");
    }
  };

  ManyThrough.prototype.create = function (attrs) {
    var self = this;
    this.memberType(attrs).create(attrs, function (err, target) {
      var proxyAttrs = {};
      proxyAttrs[self.parentReferredAs] = new DBRef(self.parent._schema._collection, self.parent._id);
      proxyAttrs[self.targetReferredAs] = new DBRef(target._schema._collection, target._id);
      this.referredThruType.create(proxyAttrs, function (err, proxy) {
      });
    });
  };

  mongoose.type('manyThrough')
    .setup( function () { /* @scope is the Schema instance */
    })
    .get( function (val, path) {
      if (! ('mthrus' in this._) ) this._.mthrus = {};
      if (!this._.mthrus[path]) {
        this._.mthrus[path] = new ManyThrough(null, this, path);
      }
      return this._.mthrus[path];
    })
};
