var Url = require("url");

module.exports.loadType = function (mongoose) {
  type('url')
    .extend('string')
    .validate('url', function (val, callback) {
      var urlRegexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
      return callback(urlRegexp.test(val));
    })
    .castSet(function (val, path) {
      return module.exports.normalizeUrl(val);
    });
};

// See http://en.wikipedia.org/wiki/URL_normalization
module.exports.normalizeUrl = (function () {
  var reorderQuery = function (query) {
    var orderedKeys = [], name, i, len, key, querystr = [];
    for (name in query) {
      for (i = 0, len = orderedKeys.length; i < len; i++) {
        if (orderedKeys[i] >= name) break;
      }
      orderedKeys.splice(i, 0, name);
    }
    for (i = 0, len = orderedKeys.length; i < len; i++) {
      key = orderedKeys[i];
      querystr.push(key + "=" + query[key]);
    }
    return querystr.join("&");
  };

  return function (uri) {
    var parsedUrl = Url.parse(uri, true),
        urlstr = "";
    urlstr += parsedUrl.protocol.toLowerCase() + "//" + parsedUrl.hostname.toLowerCase().replace(/^www\./, "") + // Convert scheme and host to lower case; remove www. if it exists in hostname
      (parsedUrl.pathname ?
         parsedUrl.pathname.replace(/\/\.{1,2}\//g, "/").replace(/\/{2,}/, "/") : // Remove dot-segments; Remove duplicate slashes
         "/" // Add trailing /
      );
    if (parsedUrl.query) {
      urlstr += "?" + reorderQuery(parsedUrl.query);
    }
    if (parsedUrl.hash) {
      urlstr += parsedUrl.hash;
    }
    return urlstr;
  };
})();
