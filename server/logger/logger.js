const winston = require('winston');
const buildDevLogger = require('./dev-logger');
const buildProdLogger = require('./prod-logger');

let logger = null;
if (process.env.NODE_ENV === 'development') {
    console.log('Running in dev mode');
    logger = buildDevLogger();
}
else {
    logger = buildProdLogger();
}

module.exports = logger;