// const winston = require('winston');
const { format, createLogger, transports } = require('winston');
const { timestamp, combine, printf } = format

function buildDevLogger() {
    // Create my own custom log format
    const logFormat = printf(({ level, message, timestamp, stack }) => {
        return `${timestamp} ${level}: ${stack || message}`;
    })

    return createLogger({
        format: combine(
            format.colorize(),
            timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            format.errors({stack: true}),
            logFormat,
        ),
        transports: [new transports.Console()],
    });

}
module.exports = buildDevLogger