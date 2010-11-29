exports.useTimestamps = function (schema, options) {
  schema
    .date('createdAt')
    .date('updatedAt')
    .pre('save', function () {
      if (!this.createdAt) {
        this.createdAt = this.updatedAt = new Date;
      } else {
        this.updatedAt = new Date;
      }
    });
};
