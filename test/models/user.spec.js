var User = require('../../dist/models/user');

describe('User Model', function() {
	var user;
	beforeEach(function() {
		user = new User({ username: 'username', reponame: 'reponame' });
	});
	describe('isValid', function() {
		it('Should return true if username & reponame is present', function() {
			var isValid = user.isValid();
			isValid.should.equal(true);
		});
		it('Should return false if username is missing', function() {
			user = new User({ reponame: 'reponame' });
			var isValid = user.isValid();
			isValid.should.equal(false);
		});
		it('Should return false if reponame is missing', function() {
			user = new User({ username: 'username' });
			var isValid = user.isValid();
			isValid.should.equal(false);
		});
	});
});
