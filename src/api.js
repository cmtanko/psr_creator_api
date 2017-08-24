import 'babel-polyfill';
import cors from 'cors';
import path from 'path';
import routes from './routes';
import express from 'express';
import bodyParser from 'body-parser';
import cron from 'cron';
//import config from './config';
import { sendEmail } from './report/emailService';

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
        gToken: process.env.S1_SECRET
    }
    res.send('Started...');

    let CronJob = cron.CronJob;
    let job = new CronJob({
        cronTime: '05 30 17 * * *',
        onTick: function () {
            sendEmail(config, (data) => { console.log(data); });
            /*
             * Runs every weekday (Monday through Friday)
             * at 11:30:00 AM. It does not run on Saturday
             * or Sunday.
             */
        },
        start: false,
        timeZone:'Asia/Kathmandu'
    });
    job.start();
});
app.listen(port, function () {
    console.log('app listening on', port);
})

export default app;