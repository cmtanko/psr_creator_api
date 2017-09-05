import { Router } from 'express';
import axios from 'axios';
import _ from 'lodash';
import reportService from './report.service';

const router = Router();
/**
 * @swagger
 * definitions:
 *   Report:
 *     properties:
 *       from:
 *         type: string
 *       to:
 *         type: string
 *       url:
 *         type: string
 *       title:
 *         type: string
 *       assignee:
 *         type: string
 *       status:
 *         type: string
 *       token:
 *         type: string
 *       todo:
 *         type: string
 *       inprogress:
 *         type: string
 *       completed:
 *         type: string
 */

/**
 * @swagger
 * /api/report:
 *   post:
 *     tags:
 *       - Report Generator
 *     description: Lists Jira Issues with status
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: payload
 *         description: Jira Issues
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/Report'
 *     responses:
 *       200:
 *         description: Successfully Listed
 */

router.post('/', (req, res) => {
	let query = req.body;
	let assigneeString = reportService.getAssigneeString(query.assignee);
	let assigneeArray = query.assignee.split(',');
	axios.get(query.url + '/rest/api/latest/search?jql=' + assigneeString + '&maxResults=' + 100 * assigneeArray.length,
		{
			method: 'GET',
			headers: { 'Authorization': 'Basic ' + query.token }
		}
	).then((data) => {
		let results = composeTaskResult(_.get(data, 'data.issues'), query);
		res.send({ 'result': results });
	})
		.catch((data) => {
			res.send({ 'error': 'Unable to fetch data!' + data });
		});
});

const composeTaskResult = (results, query) => {
	let issues = [];
	_.each(results, (result) => {
		if (_.get(result, 'fields.status.name') !== 'Backlog') {
			issues.push({
				task_id: result.key,
				task_type: _.get(result, 'fields.issuetype.name'),
				task_description: _.get(result, 'fields.summary'),
				task_creation_date: _.get(result, 'fields.created'),
				task_updated_date: _.get(result, 'fields.updated'),
				task_assignee: _.get(result, 'fields.assignee.displayName'),
				task_project: _.get(result, 'fields.project.key'),
				task_status: reportService.getStatus(_.get(result, 'fields.status.name'), query)
			});
		}
	}, query);
	return _.sortBy(issues, ['task_status', 'task_id']);
};


export default router;