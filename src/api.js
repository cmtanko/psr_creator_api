import 'babel-polyfill';
import cors from 'cors';
import path from 'path';
import routes from './routes';
import express from 'express';
import bodyParser from 'body-parser';
import cron from 'cron';
//import config from './config';
import { sendEmail } from './report/emailService';
import axios from 'axios';

const app = express();
var port = process.env.PORT || 3000;
app.use(cors());
app.use(bodyParser.json());
app.use('/api', routes);
app.use(express.static(path.join(__dirname, '/../public')));
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
        cronTime: '05 * * * * *',
        onTick: function () {
            axios.post('https://psrgenerator.herokuapp.com/api/status',
                {
                    "username": this.config.gUsername,
                    "reponame": this.config.gReponame,
                    "token": this.config.gToken,
                    "date": this.config.date
                }
            ).then((data) => {
                console.log('Response=' + JSON.stringify(data.data));
                sendEmail(config,JSON.stringify(data.data),  (data) => { console.log(data); });
            }).catch((data) => {
                console.log('Error' + data);
            });
        },
        start: false,
        timeZone: 'Asia/Kathmandu'
    });
    job.config = config;
    job.start();

    res.send('Started...321');

});
app.listen(port, function () {
    console.log('app listening on', port);
})

export default app;