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

const PORT = process.env.PORT;

// Set up middlewares
app.use(compression())  // Add compression for faster performance
app.use(cors());  // lets server get requests from localhost
app.use(express.json()) // gets the request body and converts it to json, same as body-parser
app.use(express.static('../client/dist')); // Get the static web files from the client folder
const limiter = rateLimit({ // Applies rate limit to all requests
    windowsMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per window (15 mins here)
    standardHeaders: true, // Returns rate limit info in RateLimit headers
    legacyHeaders: false, // Disable X-RateLimit headers
})
app.use(limiter)


// Set up google analytics
const serverContainerURL = process.env.SERVER_CONTAINER_URL;
const tagId = process.env.SERVER_CONTAINER_ID;

const sendEvent = async (eventName) => {
    const eventData = {
        // replace with your event parameters
        parameters: {
            name: eventName,
            client_id: 'CLIENT_ID', // replace with actual client ID
            // other event parameters...
        }
    };

    await axios.post(`${serverContainerURL}/mp2/collect`, eventData, {
        params: { tid: tagId }
    });
};

// usage
sendEvent('event_name').catch(console.error);

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