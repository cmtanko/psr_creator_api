var assert = require('assert');
var dailyReportController = require('../../dist/status/dailyReport.service');


describe('Daily Report Controller', function() {
	describe('getTimeInMins', function() {
		it('Should return 60 if 1 hr', function() {
			assert.equal(60, dailyReportController.getTimeInMins('1 hr'));
		});
		it('Should return 60 if 1 hrs', function() {
			assert.equal(60, dailyReportController.getTimeInMins('1 hrs'));
		});
		it('Should return 60 if 1 H', function() {
			assert.equal(60, dailyReportController.getTimeInMins('1 H'));
		});
		it('Should return 60 if 1Hours', function() {
			assert.equal(60, dailyReportController.getTimeInMins('1 hrs'));
		});

		it('Should return 90 if 1 hr 30 mins', function() {
			assert.equal(90, dailyReportController.getTimeInMins('1 hr 30 mins'));
		});
		it('Should return 90 if 1 h 30 m', function() {
			assert.equal(90, dailyReportController.getTimeInMins('1 h 30 m'));
		});
		it('Should return 90 if 1H 30M', function() {
			assert.equal(90, dailyReportController.getTimeInMins('1H 30M'));
		});

		it('Should return 30 if 30 mins', function() {
			assert.equal(30, dailyReportController.getTimeInMins('30 if 30 mins'));
		});
		it('Should return 30 if 30 m', function() {
			assert.equal(30, dailyReportController.getTimeInMins('30 if 30 m'));
		});
		it('Should return 30 if 30M', function() {
			assert.equal(30, dailyReportController.getTimeInMins('30 if 30M'));
		});
		it('Should return 30 if 30 Minutes', function() {
			assert.equal(30, dailyReportController.getTimeInMins('30 if 30 Minutes'));
		});
	});

	describe('getCleanSplittedData', function() {
		it('Should return issue "ACT-470" if msg is "ACT-470 -m Design fixed on the teacher start and end date -t 2 hrs -s Completed"', function() {
			assert.equal('ACT-470', dailyReportController.getCleanSplittedData("ACT-470 -m Design fixed on the teacher's start and end date -t 2 hrs -s Completed", "space"));
		});
		it('Should return message "Design fixed on the teacher start and end date" if msg is "ACT-470 -m Design fixed on the teacher start and end date -t 2 hrs -s Completed"', function() {
			assert.equal('Design fixed on the teacher start and end date', dailyReportController.getCleanSplittedData("ACT-470 -m Design fixed on the teacher start and end date -t 2 hrs -s Completed", "-m"));
		});
		it('Should return time "2 hrs" if msg is "ACT-470 -m Design fixed on the teacher start and end date -t 2 hrs -s Completed"', function() {
			assert.equal('2 hrs', dailyReportController.getCleanSplittedData("ACT-470 -m Design fixed on the teacher's start and end date -t 2 hrs -s Completed", "-t"));
		});
		it('Should return time "0 mins" if msg is "ACT-470 -m Design fixed on the teacher start and end date -s Completed"', function() {
			assert.equal('0 mins', dailyReportController.getCleanSplittedData("ACT-470 -m Design fixed on the teacher's start and end date -s Completed", "-t"));
		});
		it('Should return state "Completed" if msg is "ACT-470 -m Design fixed on the teacher start and end date -t 2 hrs -s Completed"', function() {
			assert.equal('Completed', dailyReportController.getCleanSplittedData("ACT-470 -m Design fixed on the teacher's start and end date -t 2 hrs -s Completed", "-s"));
		});
		it('Should return state "In Progress" if msg is "ACT-470 -m Design fixed on the teacher start and end date -t 2 hrs"', function() {
			assert.equal('In Progress', dailyReportController.getCleanSplittedData("ACT-470 -m Design fixed on the teacher's start and end date -t 2 hrs", "-s"));
		});
	});

	describe('getProjectStatus', function() {
		it('Should return "In Progress" if msg is "in progress"', function() {
			assert.equal('In Progress', dailyReportController.getProjectStatus('in progress'));
		});
		it('Should return "In Progress" if msg is "Inprogress"', function() {
			assert.equal('In Progress', dailyReportController.getProjectStatus('Inprogress'));
		});
		it('Should return "In Progress" if msg is "WIP"', function() {
			assert.equal('In Progress', dailyReportController.getProjectStatus('WIP'));
		});
		it('Should return "Completed" if msg is "Completed"', function() {
			assert.equal('Completed', dailyReportController.getProjectStatus('Completed'));
		});
		it('Should return "Completed" if msg is "complete"', function() {
			assert.equal('Completed', dailyReportController.getProjectStatus('complete'));
		});
		it('Should return "In Progress" if msg is ""', function() {
			assert.equal('In Progress', dailyReportController.getProjectStatus(''));
		});
	});
});
