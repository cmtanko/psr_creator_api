'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.getGitRepos = exports.getProjectStatus = exports.getCleanSplittedData = exports.getTimeInMins = undefined;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getTimeInMins = exports.getTimeInMins = function getTimeInMins(timeSpent) {
	var timeInMin = '';
	if (!_lodash2.default.isNumber(parseFloat(timeSpent))) {
		timeInMin = '0 mins';
	}
	if (timeSpent.toLowerCase().indexOf('h') !== -1 && timeSpent.toLowerCase().indexOf('m') !== -1) {
		var hourSplit = timeSpent.toLowerCase().split('h')[0].trim();
		var minSplit = timeSpent.toLowerCase().split('m')[0].trim().split(' ');
		timeInMin = parseFloat(hourSplit) * 60 + parseFloat(minSplit[minSplit.length - 1]);
	} else if (timeSpent.toLowerCase().indexOf('h') !== -1) {
		timeInMin = parseFloat(timeSpent) * 60;
	} else if (timeSpent.toLowerCase().indexOf('m') !== -1) {
		timeInMin = parseFloat(timeSpent);
	} else if (timeSpent < 8) {
		timeInMin = parseFloat(timeSpent) * 60;
	} else {
		timeInMin = parseFloat(timeSpent);
	}

	return timeInMin;
};

var getCleanSplittedData = exports.getCleanSplittedData = function getCleanSplittedData(data, splitBy) {
	switch (splitBy) {
		case 'space':
			{
				return data.trim().split(' ')[0].trim();
			}
		case '-m':
			{
				var messageDetail = data.trim().split('-m')[1];

				return messageDetail === undefined ? data.trim() : messageDetail.split('-')[0].trim();
			}
		case '-t':
			{
				var timeDetail = data.trim().split('-t')[1];

				return timeDetail === undefined ? '0 mins' : timeDetail.split('-')[0].trim();
			}
		case '-s':
			{
				var statusDetail = data.trim().split('-s')[1];

				return statusDetail === undefined ? 'In Progress' : statusDetail.split('-')[0].trim();
			}
		default:
			return data;
	}
};

var getProjectStatus = exports.getProjectStatus = function getProjectStatus(status) {
	status = status.toLowerCase();
	if (status === 'wip' || status === 'progress' || status === 'in progress' || status === 'inprogress') {
		return 'In Progress';
	} else if (status === 'completed' || status === 'complete') {
		return 'Completed';
	} else {
		return 'In Progress';
	}
};

var getGitRepos = exports.getGitRepos = function getGitRepos(user, successFn, failFn) {
	var url = 'https://api.github.com/repos/' + user.username + '/' + user.reponame + '/events?per_page=300';
	_axios2.default.get(url, {
		method: 'GET',
		headers: { 'Authorization': 'token ' + user.token }
	}).then(function (data) {
		return successFn(data);
	}).catch(function (data) {
		return failFn(data);
	});
};

exports.default = {
	getTimeInMins: getTimeInMins,
	getCleanSplittedData: getCleanSplittedData,
	getProjectStatus: getProjectStatus,
	getGitRepos: getGitRepos
};
//# sourceMappingURL=dailyReport.service.js.map