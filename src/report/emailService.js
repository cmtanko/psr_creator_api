var _ = require('lodash');
var nodemailer = require('nodemailer');

var emailService = function (querystring) {
    var sendEmail = function (data, cb) {
        var result = [];
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'psrgeneratorinfo@gmail.com',
                pass: 'psrgeneratorinfo123'
            }
        });

        var mailOptions = {
            from: 'psrgeneratorinfo@gmail.com',
            to: 'suchanbadyakar@lftechnology.com',
            subject: 'PSR Report',
            html: data
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

    return {
        sendEmail: sendEmail
    };
};

module.exports = emailService;