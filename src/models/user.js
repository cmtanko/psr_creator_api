import _ from 'lodash';

var User = function(args) {
	_.extend(this, args);

	this.isValid = function() {
		if (args.username && args.reponame) return true;
		return false;
	};

	this.username12 = args.username;
	this.reponame = args.reponame;
};

module.exports = User;