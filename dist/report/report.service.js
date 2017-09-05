'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
var getAssigneeString = exports.getAssigneeString = function getAssigneeString(assignee) {
	//CONCATENATE ALL ASSIGNEES IF MORE THAN ONE WITH CORRECT FORMAT
	var assigneeString = "";
	var assigneeArray = assignee.split(',');
	assigneeArray.forEach(function (a, i, array) {
		if (i === array.length - 1) {
			assigneeString += 'assignee=' + a;
		} else {
			assigneeString += 'assignee=' + a + '||';
		}
	}, assigneeString);
	return assigneeString;
};

var getStatus = exports.getStatus = function getStatus(statusCode, query) {
	if (statusCode.toLowerCase() === query.inprogress.toLowerCase()) {
		return 'In Progress';
	} else if (statusCode.toLowerCase() === query.completed.toLowerCase()) {
		return 'Completed';
	} else if (statusCode.toLowerCase() === query.todo.toLowerCase()) {
		return 'To Do';
	}
	return statusCode;
};

exports.default = {
	getAssigneeString: getAssigneeString,
	getStatus: getStatus
};
//# sourceMappingURL=report.service.js.map