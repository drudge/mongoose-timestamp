/*!
 * Mongoose Timestamps Plugin
 * Copyright(c) 2012 Nicholas Penree <nick@penree.com>
 * Original work Copyright(c) 2012 Brian Noguchi
 * MIT Licensed
 */

function timestampsPlugin(schema, options) {
  if (schema.path('_id')) {
    schema.add({
      updatedAt: Date
    });
    schema.virtual('createdAt')
      .get( function () {
        if (this._createdAt) return this._createdAt;
        return this._createdAt = this._id.getTimestamp();
      });
    schema.pre('save', function (next) {
      if (this.isNew) {
        this.updatedAt = this.createdAt;
      } else {
        this.updatedAt = new Date;
      }
      next();
    });
  } else {
    schema.add({
        createdAt: Date
      , updatedAt: Date
    });
    schema.pre('save', function (next) {
      if (!this.createdAt) {
        this.createdAt = this.updatedAt = new Date;
      } else {
        this.updatedAt = new Date;
      }
      next();
    });
  }
}

module.exports = timestampsPlugin;