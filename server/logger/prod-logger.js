const winston = require('winston');
const { format, createLogger, transports, exitOnError } = require('winston');
const { timestamp, combine, errors, json } = format

function buildProdLogger() {
    // Create my own custom log format
    return createLogger({
        format: combine(
            timestamp(),
            errors({ stack: true }),
            json(),
        ),
        defaultMeta: { service: 'user-service' },
        exitOnError: false,
        transports: [
            fileTransport
        ]
    });
}

const fileTransport = new winston.transports.File({
    filename: path.join(__dirname, 'logs.txt'),
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message, ...rest }) => {
            const formattedMessage = `${timestamp} ${level}: ${message}`;
            return Object.keys(rest).length
                ? `${formattedMessage} ${JSON.stringify(rest)}`
                : formattedMessage;
        })
    ),
});

module.exports = buildProdLogger