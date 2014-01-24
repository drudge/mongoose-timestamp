/*!
 * Mongoose Timestamps Plugin
 * Copyright(c) 2012 Nicholas Penree <nick@penree.com>
 * Original work Copyright(c) 2012 Brian Noguchi
 * MIT Licensed
 */

function timestampsPlugin(schema, options) {
  var updatedAt = 'updatedAt';
  var createdAt = 'createdAt';
  if (typeof options === 'object') {
    if (typeof options.updated_at === 'string') {
      updatedAt = options.updated_at;
    }
    if (typeof options.created_at === 'string') {
      createdAt = options.created_at;
    }
  }

  var dataObj = {};
  dataObj[updatedAt] = Date;
  if (schema.path('_id')) {
    schema.add(dataObj);
    schema.virtual(createdAt)
      .get( function () {
        if (this["_" + createdAt]) return this["_" + createdAt];
        return this["_" + createdAt] = this._id.getTimestamp();
      });
    schema.pre('save', function (next) {
      if (this.isNew) {
        this[updatedAt] = this[createdAt];
      } else {
        this[updatedAt] = new Date;
      }
      next();
    });
  } else {
    dataObj[createdAt] = Date;
    schema.add(dataObj);
    schema.pre('save', function (next) {
      if (!this[createdAt]) {
        this[createdAt] = this[updatedAt] = new Date;
      } else {
        this[updatedAt] = new Date;
      }
      next();
    });
  }
}

module.exports = timestampsPlugin;