import { Router } from 'express';
import axios from 'axios';
import _ from 'lodash';

const router = Router();
const getStatus = (statusCode,query) => {
  console.log(statusCode + '---' + query);
  if (statusCode.toLowerCase() === query.inprogress.toLowerCase()) { return 'In Progress'; }
  else if (statusCode.toLowerCase() === query.completed.toLowerCase()) { return 'Completed'; }
  else if (statusCode.toLowerCase() === query.todo.toLowerCase()) { return 'To Do'; }
  return statusCode;
};

router.post('/', (req, res, next) => {
  let query = req.body;
  let assigneeString = "";
  let assigneeArray = query.assignee.split(',');
  assigneeArray.forEach(function (a, i, array) {
    if (i === array.length - 1) {
      assigneeString += 'assignee=' + a;
    } else {
      assigneeString += 'assignee=' + a + '||';
    }
  }, assigneeString);
  console.log(assigneeString);
  axios.get(query.url + '/rest/api/latest/search?jql=' + assigneeString + '&maxResults=' + 100 * assigneeArray.length,
    {
      method: 'GET',
      headers: { 'Authorization': 'Basic ' + query.token }
    }
  ).then((data) => {
    let results = data.data.issues;
    let issues = [];
    _.each(results, (result) => {
      if (_.get(result, 'fields.status.name') !== 'Done' && _.get(result, 'fields.status.name') !== 'Backlog') {
        issues.push({
          task_id: result.key,
          task_type: _.get(result, 'fields.issuetype.name'),
          task_description: _.get(result, 'fields.summary'),
          task_creation_date: _.get(result, 'fields.created'),
          task_updated_date: _.get(result, 'fields.updated'),
          task_assignee: _.get(result, 'fields.assignee.displayName'),
          task_status: getStatus(_.get(result, 'fields.status.name'),query)
        });
      }
    }, query);
    results = _.sortBy(issues, ['task_status', 'task_id']);
    res.send({ 'result': results });
  })
    .catch((data) => {
      res.send({ 'error': 'Unable to fetch data!' });
    });
});

export default router;