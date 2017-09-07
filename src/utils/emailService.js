var _ = require('lodash');
var nodemailer = require('nodemailer');

export const sendEmail = (data, result, cb) => {
	var transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: data.email,
			pass: data.password
		}
	});

	var htmlCompose = '';
	result.commitsByUsers.forEach((user) => {
		htmlCompose += '<h2>' + user.user + '</h2>';
		htmlCompose += '<ul>';
		_.get(user, 'commits').forEach((commit) => {
			htmlCompose += '<li>' + commit.taskId + ' | ' + commit.taskTitle + '(' + commit.taskStatus + ')</li>';
		}, htmlCompose);
		htmlCompose += '</ul>';
		htmlCompose += '<ul><li>(' + user.totalTime + ' hrs)</li></ul>';
	}, this);

	var mailOptions = {
		from: data.email,
		to: data.email_to,
		subject: 'Daily Report | ' + new Date(),
		html: htmlCompose
	};

	transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			cb(null, error);
		} else {
			cb(null, info);
		}
	});
};

export default sendEmail;