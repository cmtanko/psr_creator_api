'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _report = require('./report.service');

var _report2 = _interopRequireDefault(_report);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = (0, _express.Router)();
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

router.post('/', function (req, res) {
  var query = req.body;
  var assigneeString = _report2.default.getAssigneeString(query.assignee);
  var assigneeArray = query.assignee.split(',');
  _axios2.default.get(query.url + '/rest/api/latest/search?jql=' + assigneeString + '&maxResults=' + 100 * assigneeArray.length, {
    method: 'GET',
    headers: { 'Authorization': 'Basic ' + query.token }
  }).then(function (data) {
    var results = composeTaskResult(_lodash2.default.get(data, 'data.issues'), query);
    res.send({ 'result': results });
  }).catch(function (data) {
    res.send({ 'error': 'Unable to fetch data!' + data });
  });
});

var composeTaskResult = function composeTaskResult(results, query) {
  var issues = [];
  _lodash2.default.each(results, function (result) {
    if (_lodash2.default.get(result, 'fields.status.name') !== 'Backlog') {
      issues.push({
        task_id: result.key,
        task_type: _lodash2.default.get(result, 'fields.issuetype.name'),
        task_description: _lodash2.default.get(result, 'fields.summary'),
        task_creation_date: _lodash2.default.get(result, 'fields.created'),
        task_updated_date: _lodash2.default.get(result, 'fields.updated'),
        task_assignee: _lodash2.default.get(result, 'fields.assignee.displayName'),
        task_project: _lodash2.default.get(result, 'fields.project.key'),
        task_status: _report2.default.getStatus(_lodash2.default.get(result, 'fields.status.name'), query)
      });
    }
  }, query);
  return _lodash2.default.sortBy(issues, ['task_status', 'task_id']);
};

exports.default = router;
//# sourceMappingURL=report.controller.js.map