import 'babel-polyfill';
import cors from 'cors';
import path from 'path';
import routes from './routes';
import express from 'express';
import bodyParser from 'body-parser';
import cron from 'cron';

const app = express();
var port = process.env.PORT || 3000;
app.use(cors());
app.use(bodyParser.json());
app.use('/api', routes);
app.use(express.static(path.join(__dirname, '/../public')));
app.get('/', function (req, res) {
    res.send(process.env);

    let CronJob = cron.CronJob;
    let job = new CronJob({
        cronTime: '10 * * * * *',
        onTick: function () {
            console.log(process.env.email_to);
            /*
             * Runs every weekday (Monday through Friday)
             * at 11:30:00 AM. It does not run on Saturday
             * or Sunday.
             */
        },
        start: false,
        timeZone: 'America/Los_Angeles'
    });
    job.start();
});
app.listen(port, function () {
    console.log('app listening on', port);
})

export default app;