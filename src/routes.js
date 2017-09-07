import { Router } from 'express';
import report from "./report/report.controller";
import dailyReport from "./status/dailyReport.controller";

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
router.post('/report', report().post);

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
router.post('/status', dailyReport().post);

export default router;
