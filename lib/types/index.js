module.exports.loadTypes = function () {
  var mongoose = arguments[0],
      types = Array.prototype.slice.call(arguments, 1);
  if (types.length) {
    types.forEach( function (type) {
      require("./" + type).loadType(mongoose);
    });
  } else {
    var files = require("fs").readdirSync(__dirname);
    files.forEach( function (filename) {
      var base = filename.slice(0, filename.length-3);
      if (base !== "index") require("./" + base).loadType(mongoose);
    });
  }
};
