'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

require('babel-polyfill');

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _routes = require('./routes');

var _routes2 = _interopRequireDefault(_routes);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _cron = require('cron');

var _cron2 = _interopRequireDefault(_cron);

var _emailService = require('./report/emailService');

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _swagger = require('./utils/swagger');

var _swagger2 = _interopRequireDefault(_swagger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();
var port = process.env.PORT || 3000;
app.use((0, _cors2.default)());
app.use(_bodyParser2.default.json());
app.use('/api', _routes2.default);
app.use(_express2.default.static(_path2.default.join(__dirname, '/../public')));

// serve swagger
app.get('/swagger.json', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(_swagger2.default);
});

app.get('/', function (req, res) {
    var config = {
        email: process.env.email,
        password: process.env.password,
        email_to: process.env.email_to,
        gToken: process.env.S1_SECRET,
        gUsername: process.env.git_username,
        gReponame: process.env.git_reponame,
        date: new Date()
    };
    var CronJob = _cron2.default.CronJob;
    var job = new CronJob({
        cronTime: '05 56 17 * * *', //Send Email at 5.30 every day
        onTick: function onTick() {
            var _this = this;

            _axios2.default.post('https://psrgenerator.herokuapp.com/api/status', {
                "username": this.config.gUsername,
                "reponame": this.config.gReponame,
                "token": this.config.gToken,
                "date": this.config.date
            }).then(function (data) {
                (0, _emailService.sendEmail)(_this.config, data.data, function (data) {
                    console.log("Email Sent " + data);
                });
            }).catch(function (data) {
                (0, _emailService.sendEmail)(_this.config, data);
            });
        },
        start: false,
        timeZone: 'Asia/Kathmandu'
    });
    job.config = config;
    job.start();

    res.send('<h1>Started...</h1><br><a href="https://psrgenerator.herokuapp.com/api-docs" target="_blank"> Documentation </a>');
});
app.listen(port, function () {
    console.log('app listening on', port);
});

exports.default = app;
//# sourceMappingURL=api.js.map