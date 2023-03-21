const axios = require('axios');
const GA_MEASUREMENT_ID = process.env.GA_MEASUREMENT_ID;
const GA_API_SECRET = process.env.GA_API_SECRET;

async function sendAnalyticsEvent(event) {
    try {
        const payload = {
            app_name: 'theofficescript',
            app_version: '1.0.0',
            event_name: event,
        };
        const response = await axios.post(`https://www.google-analytics.com/mp/collect?measurement_id=${GA_MEASUREMENT_ID}&api_secret=${GA_API_SECRET}`, event);
        console.log(response.data);
    }
    catch (error) {
        console.log(`Failed to send event to Google Analytics: ${error.message}`);
    }
}

module.exports = sendAnalyticsEvent;