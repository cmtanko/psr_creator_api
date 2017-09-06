import _ from 'lodash';
import axios from 'axios';

export const getTimeInMins = (timeSpent) => {
	let timeInMin = '';
	if (!_.isNumber(parseFloat(timeSpent))) {
		timeInMin = '0 mins';
	}
	if (timeSpent.toLowerCase().indexOf('h') !== -1 && timeSpent.toLowerCase().indexOf('m') !== -1) {
		let hourSplit = timeSpent.toLowerCase().split('h')[0].trim();
		let minSplit = timeSpent.toLowerCase().split('m')[0].trim().split(' ');
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

export const getCleanSplittedData = (data, splitBy) => {
	switch (splitBy) {
		case 'space': {
			return data.trim().split(' ')[0].trim();
		}
		case '-m': {
			let messageDetail = data.trim().split('-m')[1];

			return messageDetail === undefined ? data.trim() : messageDetail.split('-')[0].trim();
		}
		case '-t': {
			let timeDetail = data.trim().split('-t')[1];

			return timeDetail === undefined ? '0 mins' : timeDetail.split('-')[0].trim();
		}
		case '-s': {
			let statusDetail = data.trim().split('-s')[1];

			return statusDetail === undefined ? 'In Progress' : statusDetail.split('-')[0].trim();
		}
		default:
			return data;
	}
};

export const getProjectStatus = (status) => {
	status = status.toLowerCase();
	if (status === 'wip' || status === 'progress' || status === 'in progress' || status === 'inprogress') {
		return 'In Progress';
	} else if (status === 'completed' || status === 'complete') {
		return 'Completed';
	} else {
		return 'In Progress';
	}
};

export const getGitRepos = (username, reponame, token, successFn, failFn) => {
	let url = 'https://api.github.com/repos/' + username + '/' + reponame + '/events?per_page=300';
	axios.get(url,
		{
			method: 'GET',
			headers: { 'Authorization': 'token ' + token }
		}
	).then((data) => successFn(data))
		.catch((data) => failFn(data));
};

export default {
	getTimeInMins,
	getCleanSplittedData,
	getProjectStatus,
	getGitRepos
};
