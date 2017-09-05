export const getAssigneeString = (assignee) => {
	//CONCATENATE ALL ASSIGNEES IF MORE THAN ONE WITH CORRECT FORMAT
	let assigneeString = "";
	let assigneeArray = assignee.split(',');
	assigneeArray.forEach((a, i, array) => {
		if (i === array.length - 1) {
			assigneeString += 'assignee=' + a;
		} else {
			assigneeString += 'assignee=' + a + '||';
		}
	}, assigneeString);
	return assigneeString;
};

export const getStatus = (statusCode, query) => {
	if (statusCode.toLowerCase() === query.inprogress.toLowerCase()) {
		return 'In Progress';
	} else if (statusCode.toLowerCase() === query.completed.toLowerCase()) {
		return 'Completed';
	} else if (statusCode.toLowerCase() === query.todo.toLowerCase()) {
		return 'To Do';
	}
	return statusCode;
};

export default {
	getAssigneeString,
	getStatus
};
