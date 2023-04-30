const winston = require('winston');
const buildDevLogger = require('./logger/dev-logger');
const buildProdLogger = require('./logger/prod-logger');

let logger = null;
if (process.env.NODE_ENV === 'development') {
    console.log('Running in dev mode');
    logger = buildDevLogger();
}
else {
    logger = buildProdLogger();
}

module.exports = logger;