var _ = require('lodash');
var nodemailer = require('nodemailer');

export const sendEmail = function (data, result, cb) {
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
        htmlCompose += '<ul><li>(' + user.totalTime + 'hrs)</li></ul>'
    }, this);

    var mailOptions = {
        from: data.email,
        to: data.email_to,
        subject: 'Daily Report' + new Date(),
        html: htmlCompose
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
            cb(null, error);

        } else {
            console.log('Email sent: ' + info.response);
            cb(null, info);

        }
    });
}

export default sendEmail;