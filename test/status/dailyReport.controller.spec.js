var assert = require('assert');
var dailyReportController = require('../../dist/status/dailyReport.service');


describe('Daily Report Controller', function() {
	describe('getTimeInMins', function() {
		it('Should return 60 if 1 hr', function() {
			dailyReportController.getTimeInMins('1 hr').should.equal(60);
		});
		it('Should return 60 if 1 hrs', function() {
			dailyReportController.getTimeInMins('1 hrs').should.equal(60);
		});
		it('Should return 60 if 1 H', function() {
			dailyReportController.getTimeInMins('1 H').should.equal(60);
		});
		it('Should return 60 if 1Hours', function() {
			dailyReportController.getTimeInMins('1 hrs').should.equal(60);
		});

		it('Should return 90 if 1 hr 30 mins', function() {
			dailyReportController.getTimeInMins('1 hr 30 mins').should.equal(90);
		});
		it('Should return 90 if 1 h 30 m', function() {
			dailyReportController.getTimeInMins('1 h 30 m').should.equal(90);
		});
		it('Should return 90 if 1H 30M', function() {
			dailyReportController.getTimeInMins('1H 30M').should.equal(90);
		});

		it('Should return 30 if 30 mins', function() {
			dailyReportController.getTimeInMins('30 if 30 mins').should.equal(30);
		});
		it('Should return 30 if 30 m', function() {
			dailyReportController.getTimeInMins('30 if 30 m').should.equal(30);
		});
		it('Should return 30 if 30M', function() {
			dailyReportController.getTimeInMins('30 if 30M').should.equal(30);
		});
		it('Should return 30 if 30 Minutes', function() {
			dailyReportController.getTimeInMins('30 if 30 Minutes').should.equal(30);
		});
	});

	describe('getCleanSplittedData', function() {
		it('Should return issue "ACT-470" if msg is "ACT-470 -m Design fixed on the teacher start and end date -t 2 hrs -s Completed"', function() {
			dailyReportController.getCleanSplittedData("ACT-470 -m Design fixed on the teacher's start and end date -t 2 hrs -s Completed", "space").should.equal('ACT-470');
		});
		it('Should return message "Design fixed on the teacher start and end date" if msg is "ACT-470 -m Design fixed on the teacher start and end date -t 2 hrs -s Completed"', function() {
			dailyReportController.getCleanSplittedData("ACT-470 -m Design fixed on the teacher start and end date -t 2 hrs -s Completed", "-m").should.equal('Design fixed on the teacher start and end date');
		});
		it('Should return time "2 hrs" if msg is "ACT-470 -m Design fixed on the teacher start and end date -t 2 hrs -s Completed"', function() {
			dailyReportController.getCleanSplittedData("ACT-470 -m Design fixed on the teacher's start and end date -t 2 hrs -s Completed", "-t").should.equal('2 hrs');
		});
		it('Should return time "0 mins" if msg is "ACT-470 -m Design fixed on the teacher start and end date -s Completed"', function() {
			dailyReportController.getCleanSplittedData("ACT-470 -m Design fixed on the teacher's start and end date -s Completed", "-t").should.equal('0 mins');
		});
		it('Should return state "Completed" if msg is "ACT-470 -m Design fixed on the teacher start and end date -t 2 hrs -s Completed"', function() {
			dailyReportController.getCleanSplittedData("ACT-470 -m Design fixed on the teacher's start and end date -t 2 hrs -s Completed", "-s").should.equal('Completed');
		});
		it('Should return state "In Progress" if msg is "ACT-470 -m Design fixed on the teacher start and end date -t 2 hrs"', function() {
			dailyReportController.getCleanSplittedData("ACT-470 -m Design fixed on the teacher's start and end date -t 2 hrs", "-s").should.equal('In Progress');
		});
	});

	describe('getProjectStatus', function() {
		it('Should return "In Progress" if msg is "in progress"', function() {
			dailyReportController.getProjectStatus('in progress').should.equal('In Progress');
		});
		it('Should return "In Progress" if msg is "Inprogress"', function() {
			dailyReportController.getProjectStatus('Inprogress').should.equal('In Progress');
		});
		it('Should return "In Progress" if msg is "WIP"', function() {
			dailyReportController.getProjectStatus('WIP').should.equal('In Progress');
		});
		it('Should return "Completed" if msg is "Completed"', function() {
			dailyReportController.getProjectStatus('Completed').should.equal('Completed');
		});
		it('Should return "Completed" if msg is "complete"', function() {
			dailyReportController.getProjectStatus('complete').should.equal('Completed');
		});
		it('Should return "In Progress" if msg is ""', function() {
			dailyReportController.getProjectStatus('').should.equal('In Progress');
		});
	});
});
