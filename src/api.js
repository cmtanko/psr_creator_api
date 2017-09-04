import 'babel-polyfill';
import cors from 'cors';
import path from 'path';
import routes from './routes';
import express from 'express';
import bodyParser from 'body-parser';
import cron from 'cron';
import { sendEmail } from './report/emailService';
import axios from 'axios';
import swaggerSpec from './utils/swagger';


const app = express();
var port = process.env.PORT || 3000;
app.use(cors());
app.use(bodyParser.json());
app.use('/api', routes);
app.use(express.static(path.join(__dirname, '/../public')));

// serve swagger
app.get('/swagger.json', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
});

app.get('/', function (req, res) {
    const config = {
        email: process.env.email,
        password: process.env.password,
        email_to: process.env.email_to,
        gToken: process.env.S1_SECRET,
        gUsername: process.env.git_username,
        gReponame: process.env.git_reponame,
        date: new Date()
    }
    let CronJob = cron.CronJob;
    let job = new CronJob({
        cronTime: '05 56 17 * * *', //Send Email at 5.30 every day
        onTick: function () {
            axios.post('https://psrgenerator.herokuapp.com/api/status',
                {
                    "username": this.config.gUsername,
                    "reponame": this.config.gReponame,
                    "token": this.config.gToken,
                    "date": this.config.date
                }
            ).then((data) => {
                sendEmail(this.config, data.data, (data) => { console.log("Email Sent " + data); });
            }).catch((data) => {
                sendEmail(this.config, data);
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
})

export default app;