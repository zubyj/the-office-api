const express = require('express');
const path = require('path');
const app = express()
const pool = require('./db');
const compression = require('compression');

// middlewares
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const logger = require('./logger/logger.js');
const axios = require('axios');

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyD3_MQ5gFasoAZGM3fRsRjvOC--xmZ4f2E",
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: "the-office-script-api.firebaseapp.com",
    projectId: "the-office-script-api",
    storageBucket: "the-office-script-api.appspot.com",
    messagingSenderId: "173776058994",
    appId: process.env.FIREBASE_APP_ID,
    appId: "1:173776058994:web:bc1fa5f2e8a4b00975e0eb",
    measurementId: "G-20BJSRT974"
};

// Initialize Firebase
const firebase_app = initializeApp(firebaseConfig);
const analytics = getAnalytics(firebase_app);

const PORT = process.env.PORT;

// Set up middlewares
app.use(compression())
app.use(cors());
app.use(express.json())
app.use(express.static('../client/dist'));
const limiter = rateLimit({
    windowsMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per window (15 mins here)
    standardHeaders: true, // Returns rate limit info in RateLimit headers
    legacyHeaders: false, // Disable X-RateLimit headers
})
app.use(limiter)

// Set up google analytics
const GA_TRACKING_ID = process.env.GA_TRACKING_ID;

const sendEvent = async (eventName, appInstanceId, clientId) => {
    const eventData = {
        client_id: clientId,
        events: [
            {
                name: eventName,
                params: {
                    engagement_time_msec: '100', // Replace with actual engagement time
                    session_id: '123', // Replace with actual session ID
                },
            },
        ],
    };

    const queryParams = {
        api_secret: process.env.API_SECRET, // Your API SECRET
        firebase_app_id: process.env.FIREBASE_APP_ID, // Your Firebase App ID
    };

    try {
        await axios.post('https://www.google-analytics.com/mp/collect', eventData, {
            params: queryParams,
        });
        console.log('Event sent to Google Analytics');
    } catch (error) {
        console.error('Error sending event to Google Analytics:', error);
    }
};

/*
Set up cookie session
Avoids using default sesson cookie name
Under set cookie security options, set httponly to true, and domain
*/
const session = require('cookie-session');
app.set('trust proxy', 1);
app.use(session({
    secret: process.env.COOKIE_SECRET,
    name: 'sessionId'
}))

// Gets the website with API documentation
app.get('/', function (req, res) {
    logger.info('Open homepage');
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));

    // Send event to google analytics
    sendEvent('open_homepage');
});

// Gets a random line
const randomRoutes = require('./routes/random');
app.use(randomRoutes)

// Gets a line from character given user text
const askRoutes = require('./routes/ask');
app.use(askRoutes);

// Gets every line from character in given episode
const characterRoutes = require('./routes/character');
app.use(characterRoutes);

// Gets script from given episode
// might not add because its too much data
// app.get("/seasons/:season/episodes/:episode", async(req, res) => {
//     try {
//         const { season, episode } = req.params;
//         const script = await pool.query("SELECT character, line FROM lines WHERE season = $1 AND episode = $2", [season, episode])
//         res.json(script.rows);
//     }
//     catch(err) {
//         console.error(err);
//     }
// })

app.listen(PORT || 5001, (req, res) => {
    console.log(`server is running on port ${PORT}`);
})