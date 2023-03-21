const express = require('express');
const path = require('path');
const app = express()
const pool = require('./db');
const compression = require('compression');

// middleware 
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

// loggers
const buildDevLogger = require('./logger/dev-logger');
const buildProdLogger = require('./logger/prod-logger');

// analytics
const sendAnalyticsEvent = require('./middlewares/analytics');

const PORT = process.env.PORT;

// init logger
let logger = null;
if (process.env.NODE_ENV === 'development') {
    console.log('Running in dev mode');
    logger = buildDevLogger();
}
else {
    logger = buildProdLogger();
}

// Middleware 
app.use(compression())  // Add compression for faster performance
app.use(cors());  // lets server get requests from localhost
app.use(express.json()) // gets the request body and converts it to json, same as body-parser
// sets HTTPS headers (stops cross-site scripting attacks, ensures secure (HTTPS) connection to client)
app.use(helmet.contentSecurityPolicy({
    directives: {
        connectSrc: ["https://www.theofficescript.com"],
        scriptSrc: ["'self'", "www.googletagmanager.com", "www.google-analytics.com",],
    }
}));
app.use(express.static('../client/dist')); // Get the static web files from the client folder
// Applies rate limit to all requests
const limiter = rateLimit({
    windowsMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per window (15 mins here)
    standardHeaders: true, // Returns rate limit info in RateLimit headers
    legacyHeaders: false, // Disable X-RateLimit headers
})
app.use(limiter)

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
    sendAnalyticsEvent('open_homepage');
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

// Gets script for random episode from given season
app.get("/seasons/:season/random", async (req, res) => {
    logger.info('Get script from random season and episode');
    try {
        const { season } = req.params;
        const script = await pool.query("SELECT character, line FROM lines WHERE season = $1 OFFSET floor(random() * (SELECT COUNT(*) FROM lines WHERE season = $1))",
            [season]
        )
        res.json(script.rows)
    }
    catch (err) {
        logger.error(err);
    }
})

// Gets script from given episode
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