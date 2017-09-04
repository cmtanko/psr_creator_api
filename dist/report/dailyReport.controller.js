'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _express = require('express');

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = (0, _express.Router)();
/**
 * @swagger
 * definitions:
 *   Status:
 *     properties:
 *       username:
 *         type: string
 *       reponame:
 *         type: string
 *       token:
 *         type: string
 *       date:
 *         type: string
 */

/**
 * @swagger
 * /api/status:
 *   post:
 *     tags:
 *       - Report Generator
 *     description: Lists Github commits based on given date
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: payload
 *         description: Github commits
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/Status'
 *     responses:
 *       200:
 *         description: Successfully Listed
 */

router.post('/', function (req, res) {
	var query = req.body;
	var url = 'https://api.github.com/repos/' + query.username + '/' + query.reponame + '/events?per_page=300';
	_axios2.default.get(url, {
		method: 'GET',
		headers: { 'Authorization': 'token ' + query.token }
	}).then(function (data) {
		if (data.status === 200) {
			var commits = _lodash2.default.get(data, 'data');
			var repoDatas = [];
			var promises = [];

			commits.forEach(function (c) {
				var createdDate = (0, _moment2.default)(c.created_at).format('YYYY-MM-DD');
				var queryDate = (0, _moment2.default)(query.date).format('YYYY-MM-DD');
				var repoData = {};

				//IF PUSHEVENT TYPE
				if (createdDate === queryDate && c.type === 'PushEvent') {
					var commit = _lodash2.default.get(c, 'payload.commits[0]') || [];
					if (_lodash2.default.get(commit, 'message').toLowerCase().indexOf('merge') === -1) {
						var _repoData = {
							commitMessage: commit.message,
							committedBy: commit.author.email,
							committedDate: c.created_at
						};
						repoDatas.push(_repoData);
					}
				}

				//IF PULLREQUESTEVENT TYPE
				if (createdDate === queryDate && c.type === 'PullRequestEvent') {
					promises.push(_axios2.default.get(_lodash2.default.get(c.payload.pull_request, 'commits_url'), {
						method: 'GET',
						isArray: true,
						headers: { 'Authorization': 'token ' + query.token }
					}));
				}
			}, repoDatas);

			_axios2.default.all(promises).then(function (result) {
				result.forEach(function (data) {
					var results = data.data;
					var repoData = {
						commitMessage: results[0].commit.message,
						committedBy: results[0].commit.author.email,
						committedDate: results[0].commit.author.date
					};
					repoDatas.push(repoData);
				}, undefined);
				onSuccess(repoDatas, res);
			});
		} else {
			res.send({ 'error': 'Unable to fetch data!' + data });
		}
	}).catch(function (data) {
		res.send({ 'error': 'Unable to fetch data!' + data });
	});
});

var getCleanSplittedData = function getCleanSplittedData(data, splitBy) {
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

var getTimeInMins = function getTimeInMins(timeSpent) {
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

var getProjectStatus = function getProjectStatus(status) {
	status = status.toLowerCase();
	if (status === 'wip' || status === 'progress' || status === 'in progress' || status === 'inprogress') {
		return 'In Progress';
	} else if (status === 'completed' || status === 'complete') {
		return 'Completed';
	} else {
		return 'In Progress';
	}
};
var getGitCommitsReport = function getGitCommitsReport(repoDatas, successFn) {
	var reportDatas = [];
	repoDatas.forEach(function (c) {
		var commitMessage = _lodash2.default.get(c, 'commitMessage') || '';
		var reportData = {
			committedBy: c.committedBy || '',
			committedDate: c.committedDate || '',
			taskId: getCleanSplittedData(commitMessage, 'space'),
			taskTitle: getCleanSplittedData(commitMessage, '-m'),
			taskTimeSpent: getTimeInMins(getCleanSplittedData(commitMessage, '-t')),
			taskStatus: getProjectStatus(getCleanSplittedData(commitMessage, '-s'))
		};
		reportDatas.push(reportData);
	}, reportDatas);

	// LETS MERGE COMMITS FOR SAME TASK, TIME SPENT IS ADDED, COMMIT MESSESS WOULD BE THE FIRST COMMIT
	var mergedCommitsDetail = [];
	for (var i = 0; i < reportDatas.length; i++) {
		for (var j = i + 1; j < reportDatas.length; j++) {
			if (reportDatas[i].taskId === reportDatas[j].taskId) {
				reportDatas[i].taskTitle = reportDatas[j].taskTitle;
				reportDatas[i].taskTimeSpent = reportDatas[i].taskTimeSpent + reportDatas[j].taskTimeSpent;
				reportDatas[j].isUnique = false;
			}
		}
		mergedCommitsDetail.push(reportDatas[i]);
	}

	// LETS REMOVE ALL THE NON-UNIQUE TASKS
	var finalCommitsReport = [];
	_lodash2.default.each(mergedCommitsDetail, function (a) {
		if (a.isUnique === undefined) {
			finalCommitsReport.push(a);
		}
	});

	// REMOVE MERGED COMMITS
	var noAutoGeneratedCommitsReport = [];
	_lodash2.default.each(finalCommitsReport, function (a) {
		if (a.committedBy !== 'GitHub') {
			noAutoGeneratedCommitsReport.push(a);
		}
	});
	successFn(noAutoGeneratedCommitsReport);
};

var getUserList = function getUserList(repoDatas, successFn) {
	var userList = [];
	repoDatas.forEach(function (r) {
		if (_lodash2.default.get(r, 'committedBy')) {
			if (!_lodash2.default.includes(userList, r.committedBy) && r.committedBy.toLowerCase() !== 'github') {
				userList.push(r.committedBy);
			}
		}
	}, userList);
	successFn(userList);
};

var onSuccess = function onSuccess(repoDatas, res) {
	getGitCommitsReport(repoDatas, function (commits) {
		getUserList(commits, function (userDatas) {
			var commitsByUsers = [];
			userDatas.forEach(function (a) {
				var newObject = {
					'user': a,
					'commits': []
				};
				var counter = 1;
				var totalTimeSpent = 0;

				commits.forEach(function (r) {
					totalTimeSpent += r.taskTimeSpent / 60;
					if (a === r.committedBy) {
						r.id = counter++;
						newObject['commits'].push(r);
						newObject['totalTime'] = Math.round(totalTimeSpent);
					}
				}, newObject);
				commitsByUsers.push(newObject);
			}, commitsByUsers);

			res.send({ 'commitsByUsers': commitsByUsers, "repoDatas": repoDatas });
		});
	}, function (data) {
		res.send('Error: ' + data);
	});
};

exports.default = router;
//# sourceMappingURL=dailyReport.controller.js.map