'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var _ = require('lodash');
var nodemailer = require('nodemailer');

var sendEmail = exports.sendEmail = function sendEmail(data, cb) {
    var result = [];
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: data.email,
            pass: data.password
        }
    });

    var mailOptions = {
        from: data.email,
        to: data.email_to,
        subject: 'PSR Report',
        html: 'data'
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
};

exports.default = sendEmail;
//# sourceMappingURL=emailService.js.map