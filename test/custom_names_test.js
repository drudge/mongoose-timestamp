
/**
 * @list dependencies
 **/

var mocha = require('mocha');
var should = require('should');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var timestamps = require('../');

mongoose.connect('mongodb://localhost/mongoose_timestamps')
mongoose.connection.on('error', function (err) {
	console.error('MongoDB error: ' + err.message);
	console.error('Make sure a mongoDB server is running and accessible by this application')
});

mongoose.plugin(timestamps, {createdAt: 'customNameCreatedAt', updatedAt: 'customNameUpdatedAt'});

var CustomizedNameTimeCopSchema = new Schema({
	email: String
});

var CustomizedNameTimeCop = mongoose.model('CustomizedNameTimeCop', CustomizedNameTimeCopSchema);

after(function(done) {
	mongoose.connection.db.dropDatabase();
	mongoose.connection.close();
	done();
})

describe('timestamps custom names', function() {
	it('should have updatedAt and createdAt customized named field equal', function(done) {
		var customCop = new CustomizedNameTimeCop({email: 'example@example.com'});
		customCop.save(function (err) {
			customCop["customNameCreatedAt"].should.equal(customCop["customNameUpdatedAt"]);
			done();
		});
	})
});