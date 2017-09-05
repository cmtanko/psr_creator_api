var assert = require('assert');
var reportController = require('../../dist/report/report.service');


describe('Weekly Report Controller', function() {
	describe('getAssigneeString', function() {
		it('Should return "assignee=suchan" if input assignee is "suchan"', function() {
			assert.equal("assignee=suchan", reportController.getAssigneeString('suchan'));
		});
		it('Should return "assignee=suchan||assignee=suraj" if input assignee is "suchan,suraj"', function() {
			assert.equal("assignee=suchan||assignee=suraj", reportController.getAssigneeString('suchan,suraj'));
		});
		it('Should return "assignee=suchan||assignee=suraj||assignee=sanjib" if input assignee is "suchan,suraj,sanjib"', function() {
			assert.equal("assignee=suchan||assignee=suraj||assignee=sanjib", reportController.getAssigneeString('suchan,suraj,sanjib'));
		});
	});
});
