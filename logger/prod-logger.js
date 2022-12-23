// const winston = require('winston');
const { format, createLogger, transports, exitOnError } = require('winston');
const { timestamp, combine, errors, json } = format

function buildProdLogger() {
    // Create my own custom log format
    return createLogger({
        format: combine(
            timestamp(),
            errors({stack: true}),
            json(),
        ),
        defaultMeta: { service: 'user-service' },
        exitOnError: false,
        transports: [new transports.Console()],
    });
}
module.exports = buildProdLogger