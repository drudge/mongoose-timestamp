var clone = require('mongoose/utils').clone;

exports.loadTypes = function () {
  var mongoose = arguments[0],
      types = Array.prototype.slice.call(arguments, 1);
  if (types.length) {
    types.forEach( function (type) {
      require("./types/" + type).loadType(mongoose);
    });
  } else {
    var files = require("fs").readdirSync(__dirname + "/types");
    files.forEach( function (filename) {
      var base = filename.slice(0, filename.length-3);
      require("./types/" + base).loadType(mongoose);
    });
  }
};

exports.useTimestamps = require("./plugins/useTimestamps").useTimestamps;
