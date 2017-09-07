"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require("express");

var _report = require("./report/report.controller");

var _report2 = _interopRequireDefault(_report);

var _dailyReport = require("./status/dailyReport.controller");

var _dailyReport2 = _interopRequireDefault(_dailyReport);

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
router.post('/report', (0, _report2.default)().post);

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
router.post('/status', (0, _dailyReport2.default)().post);

exports.default = router;
//# sourceMappingURL=routes.js.map