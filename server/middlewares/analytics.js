const axios = require("axios");
const uuid = require('uuid');

const MEASUREMENT_ID = process.env.MEASUREMENT_ID_GA; // Replace with your Measurement ID
const API_KEY_GA = process.env.API_KEY_GA; // Replace with your API key

async function sendAnalyticsEvent(event) {
    const url = `https://www.google-analytics.com/mp/collect?measurement_id=${MEASUREMENT_ID}&api_secret=${API_KEY_GA}`;

    try {
        const response = await axios.post(url, event);
        console.log("GA4 event sent:", response.status);
    } catch (error) {
        console.error("Error sending GA4 event:", error);
    }
}

// Example of sending a page_view event
const event = {
    client_id: uuid.v4(), // Replace with a unique client identifier
    events: [
        {
            name: "page_view",
            params: {
                page_location: "https://example.com/your-page",
                page_title: "Your Page Title",
            },
        },
    ],
};

module.exports = sendAnalyticsEvent;