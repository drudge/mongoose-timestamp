/*!
 * Mongoose Timestamps Plugin
 * Copyright(c) 2012 Nicholas Penree <nick@penree.com>
 * Original work Copyright(c) 2012 Brian Noguchi
 * MIT Licensed
 */

function timestampsPlugin(schema, options) {
  var timeOptions = options || {};
  if (timeOptions.updatedElement) {timeOptions.updatedElement.type = Date} else {timeOptions.updatedElement = {type: Date}}
  if (timeOptions.createdElement) {timeOptions.createdElement.type = Date} else {timeOptions.createdElement = {type: Date}}
  if (schema.path('_id')) {
    schema.add({
      updatedAt: timeOptions.updatedElement
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
        createdAt: timeOptions.createdElement
      , updatedAt: timeOptions.updatedElement
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