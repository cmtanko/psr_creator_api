var _ = require('lodash');
var nodemailer = require('nodemailer');

export const sendEmail = function (data, cb) {
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
}

export default sendEmail;