require('should');
var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , db = mongoose.createConnection('mongodb://localhost/mongoose_types_tests');

require("../").loadTypes(mongoose, 'url');

var WebpageSchema = new Schema({
  url: mongoose.SchemaTypes.Url
});

mongoose.model('Webpage', WebpageSchema);
var Webpage;

module.exports = {
  before: function(done){
    Webpage = db.model('Webpage', WebpageSchema);
    Webpage.remove({}, function (err) {
      done();
    });
  },
  'test invalid url validation': function (done) {
    var webpage = new Webpage({url: 'file:///home/'});
    webpage.save(function (err) {
      throw err;
      err.should.equal('url is invalid');
      webpage.isNew.should.be.true;
      done();
    });
  },
  'test valid url validation': function (done) {
    var webpage = new Webpage({ url: 'http://www.google.com/' });
    webpage.save(function (err) {
      err.should.eql(null);
      webpage.isNew.should.be.false;
      done();
    });
  },
  'url normalization should remove www.': function (done) {
    var webpage = new Webpage({ url: 'http://www.google.com/'});
    webpage.save(function (err) {
      webpage.url.should.equal('http://google.com/');
      Webpage.findById(webpage._id, function (err, refreshed) {
        refreshed.url.should.equal('http://google.com/');
        done();
      });
    });
  },
  'url normalization should add a trailing slash': function (done) {
    var webpage = new Webpage({ url: 'http://google.com'});
    webpage.save(function (err) {
      webpage.url.should.equal('http://google.com/');
      Webpage.findById(webpage._id, function (err, refreshed) {
        refreshed.url.should.equal('http://google.com/');
        done();
      });
    });
  },
  teardown: function(){
    db.close();
  }
};
