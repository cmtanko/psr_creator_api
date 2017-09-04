import 'babel-polyfill';

import cors from 'cors';
import cron from 'cron';
import path from 'path';
import axios from 'axios';
import helmet from 'helmet';
import morgan from 'morgan';
import routes from './routes';
import express from 'express';
import logger from './utils/logger';
import bodyParser from 'body-parser';
import swaggerSpec from './utils/swagger';
import { sendEmail } from './report/emailService';

const app = express();
const APP_PORT = process.env.PORT || 3000;
const APP_HOST = process.env.APP_HOST || 'localhost';

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/../public')));
app.use('/api', routes);

// serve swagger
app.get('/swagger.json', (req, res) => {
	res.setHeader('Content-Type', 'application/json');
	res.send(swaggerSpec);
});

app.get('/', (req, res) => {
	const config = {
		email: process.env.email,
		password: process.env.password,
		email_to: process.env.email_to,
		gToken: process.env.S1_SECRET,
		gUsername: process.env.git_username,
		gReponame: process.env.git_reponame,
		date: new Date()
	};
	let CronJob = cron.CronJob;
	let job = new CronJob({
		cronTime: '05 56 17 * * *', //Send Email at 5.30 every day
		onTick: () => {
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

app.listen(APP_PORT, () => {
	logger.log(
		'info',
		'Server started at ' + APP_HOST + ':' + APP_PORT
	);
});

export default app;