var assert = require('assert');
var reportController = require('../../dist/report/report.service');
var should = require('chai').should();

describe('Weekly Report Controller', function() {
	describe('getAssigneeString', function() {
		it('Should return "assignee=suchan" if input assignee is "suchan"', function() {
			reportController.getAssigneeString('suchan').should.equal('assignee=suchan');
		});
		it('Should return "assignee=suchan||assignee=suraj" if input assignee is "suchan,suraj"', function() {
			reportController.getAssigneeString('suchan,suraj').should.equal("assignee=suchan||assignee=suraj");
		});
		it('Should return "assignee=suchan||assignee=suraj||assignee=sanjib" if input assignee is "suchan,suraj,sanjib"', function() {
			reportController.getAssigneeString('suchan,suraj,sanjib').should.equal("assignee=suchan||assignee=suraj||assignee=sanjib");
		});
	});
});
