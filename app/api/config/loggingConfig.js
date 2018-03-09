const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const tsFormat = () => (new Date()).toLocaleDateString();

var transport = new (DailyRotateFile) ({
    filename: './biz.log',
    datePattern: 'yyyy-MM-dd-',
    prepend: true,
    level: process.env.ENV === 'development' ? 'debug' : 'info'
});

const logger = new (winston.Logger) ({
    transports: [
        transport
    ]
});

module.exports = logger;