module.exports.loadTypes = function () {
  var mongoose = arguments[0],
      types = Array.prototype.slice.call(arguments, 1);
  types.forEach( function (type) {
    require("./" + type).loadType(mongoose);
  });
};
