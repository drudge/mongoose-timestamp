
/**
* @list dependencies
**/

var mocha = require('mocha');
var should = require('should');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var timestamps = require('../');

mongoose.connect('mongodb://localhost/mongoose_timestamps');
mongoose.connection.on('error', function (err) {
    console.error('MongoDB error: ' + err.message);
    console.error('Make sure a mongoDB server is running and accessible by this application')
});

var OptionsTestSchema = new Schema({
    email: String
});

mongoose.plugin(timestamps, {updatedElement:{someOption: "Hello World"}});

var OptionsTest;
try {OptionsTest = mongoose.model('OptionsTest')} catch(e) {OptionsTest = mongoose.model('OptionsTest', OptionsTestSchema)}

after(function(done) {
    mongoose.connection.db.dropDatabase();
    done();
});

describe('timestamps', function() {

    it('should use updatedElement', function(done) {
        OptionsTest.schema.paths.updatedAt.options.someOption.should.equal('Hello World');
        done();
    })

});
