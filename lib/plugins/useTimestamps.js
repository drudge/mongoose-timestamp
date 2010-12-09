var mongoose = require('mongoose')
  , ObjectID = mongoose.ObjectID
  , BinaryParser = mongoose.mongo.BinaryParser;

exports.useTimestamps = function (schema, options) {
  schema.date('updatedAt');
  if (schema.oid && schema.oid instanceof ObjectID) {
    schema
      .virtual('createdAt')
        .get( function () {
          var unixtime = BinaryParser.decodeInt(oid.id.slice(0, 4), 32, true, true);
          return new Date(unixtime * 1000);
        })
      .pre('save', function () {
        if (this.isNew) {
          this.updatedAt = this.createdAt;
        } else {
          this.updatedAt = new Date;
        }
      });
  } else {
    schema
      .date('createdAt')
      .pre('save', function () {
        if (!this.createdAt) {
          this.createdAt = this.updatedAt = new Date;
        } else {
          this.updatedAt = new Date;
        }
      });
  }
};
