const axios = require('axios');
const GA_MEASUREMENT_ID = process.env.GA_MEASUREMENT_ID;
const GA_API_SECRET = process.env.GA_API_SECRET;
const FIREBASE_APP_ID = process.env.FIREBASE_APP_ID; // Replace with your Firebase App ID
const APP_INSTANCE_ID = process.env.APP_INSTANCE_ID

async function sendAnalyticsEvent(event) {
    try {
        const payload = {
            app_instance_id: APP_INSTANCE_ID, // Replace with actual app instance ID (e.g., from Firebase SDK)
            events: [
                {
                    name: event,
                    params: {},
                },
            ],
        };
        const response = await axios.post(
            `https://www.google-analytics.com/mp/collect?firebase_app_id=${FIREBASE_APP_ID}&api_secret=${GA_API_SECRET}`,
            payload,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
        console.log(response.data);
    } catch (error) {
        console.log(`Failed to send event to Google Analytics: ${error.message}`);
    }
}

module.exports = sendAnalyticsEvent;
