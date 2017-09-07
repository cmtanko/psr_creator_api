'use strict';

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var User = function User(args) {
	this.isValid = function () {
		if (args.username && args.reponame) return true;
		return false;
	};

	this.username = args.username || '';
	this.reponame = args.reponame || '';
	this.token = args.token || undefined;
	this.date = args.date || new Date();
};

module.exports = User;
//# sourceMappingURL=user.js.map