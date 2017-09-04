'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
var _ = require('lodash');
var nodemailer = require('nodemailer');

var sendEmail = exports.sendEmail = function sendEmail(data, result, cb) {
	var transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: data.email,
			pass: data.password
		}
	});

	var htmlCompose = '';
	result.commitsByUsers.forEach(function (user) {
		htmlCompose += '<h2>' + user.user + '</h2>';
		htmlCompose += '<ul>';
		_.get(user, 'commits').forEach(function (commit) {
			htmlCompose += '<li>' + commit.taskId + ' | ' + commit.taskTitle + '(' + commit.taskStatus + ')</li>';
		}, htmlCompose);
		htmlCompose += '</ul>';
		htmlCompose += '<ul><li>(' + user.totalTime + ' hrs)</li></ul>';
	}, undefined);

	var mailOptions = {
		from: data.email,
		to: data.email_to,
		subject: 'Daily Report | ' + new Date(),
		html: htmlCompose
	};

	transporter.sendMail(mailOptions, function (error, info) {
		if (error) {
			cb(null, error);
		} else {
			cb(null, info);
		}
	});
};

exports.default = sendEmail;
//# sourceMappingURL=emailService.js.map