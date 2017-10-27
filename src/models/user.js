var User = (args) => {
	this.isValid = () => {
		if (args.username && args.reponame) return true;
		return false;
	};

	this.username = args.username || '';
	this.reponame = args.reponame || '';
	this.token = args.token || undefined;
	this.date = args.date || new Date();
};

module.exports = User;