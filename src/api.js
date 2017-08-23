import 'babel-polyfill';
import cors from 'cors';
import path from 'path';
import routes from './routes';
import express from 'express';
import bodyParser from 'body-parser';
import cron from 'cron';
import config from './config';
import { sendEmail } from './report/emailService';

const app = express();
var port = process.env.PORT || 3000;
app.use(cors());
app.use(bodyParser.json());
app.use('/api', routes);
app.use(express.static(path.join(__dirname, '/../public')));
app.get('/', function (req, res) {
    res.send(config);

    let CronJob = cron.CronJob;
    let job = new CronJob({
        cronTime: '* 30 17 * * *',
        onTick: function () {
            console.log(config);
            sendEmail(config, (data) => { console.log(data); });
            /*
             * Runs every weekday (Monday through Friday)
             * at 11:30:00 AM. It does not run on Saturday
             * or Sunday.
             */
        },
        start: false,
        timeZone: 'Nepal/Kathmandu'
    });
    job.start();
});
app.listen(port, function () {
    console.log('app listening on', port);
})

export default app;