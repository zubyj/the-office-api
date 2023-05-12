const { Analytics } = require('@segment/analytics-node');
const client = new Analytics({ writeKey: process.env.SEGMENT_WRITE_KEY });

module.exports = client;