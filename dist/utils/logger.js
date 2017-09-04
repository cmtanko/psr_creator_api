'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _winston = require('winston');

var _winston2 = _interopRequireDefault(_winston);

require('winston-daily-rotate-file');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var tsFormat = function tsFormat() {
	return new Date().toISOString();
};
var logDir = process.env.LOGGING_DIR || 'logs';
var logLevel = process.env.LOGGING_LEVEL || 'info';

// Create log directory if it does not exist
if (!_fs2.default.existsSync(logDir)) {
	_fs2.default.mkdirSync(logDir);
}

/**
 * Create new winston logger instance.
 */
var logger = new _winston2.default.Logger({
	transports: [new _winston2.default.transports.Console({
		timestamp: tsFormat,
		colorize: true,
		level: logLevel
	}), new _winston2.default.transports.DailyRotateFile({
		filename: logDir + '/-debug.log',
		timestamp: tsFormat,
		datePattern: 'yyyy-MM-dd',
		prepend: true,
		level: logLevel
	})]
});

exports.default = logger;
//# sourceMappingURL=logger.js.map