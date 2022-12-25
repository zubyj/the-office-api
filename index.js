const express = require('express');
const path = require('path');
const app = express()
const pool = require('./db');
const compression = require('compression');

// middleware imports
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

// logger
const buildDevLogger = require('./logger/dev-logger');
const buildProdLogger = require('./logger/prod-logger');

require('dotenv').config()
const PORT = process.env.PORT;

// Initialize logger
let logger = null;
if (process.env.NODE_ENV === 'development') {
    console.log('Running in dev mode');
    logger = buildDevLogger();
}
else {
    logger = buildProdLogger();
}

// Middleware 
// Add compression for faster performance
app.use(compression())
// lets server get requests from localhost
app.use(cors());
// gets the request body and converts it to json, same as body-parser
app.use(express.json())
// sets HTTPS headers (stops cross-site scripting attacks, ensures secure (HTTPS) connection to client)
app.use(helmet.contentSecurityPolicy({
    directives: {
        scriptSrc: ["'self'", "googletagmanager.com"],
    }
}));
// Serves static assets from given folder
app.use(express.static('docs-website/dist'));
// Applies rate limit to all requests
const limiter = rateLimit({
    windowsMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per window (15 mins here)
    standardHeaders: true, // Returns rate limit info in RateLimit headers
    legacyHeaders: false, // Disable X-RateLimit headers
})
app.use(limiter)

/*
Avoids using default sesson cookie name
Sets cookie security options
https://expressjs.com/en/advanced/best-practice-security.html#use-helmet
Under set cookie security options, set httponly to true, and domain
*/
const session = require('cookie-session');
app.set('trust proxy', 1);
app.use(session({
    secret: process.env.COOKIE_SECRET,
    name: 'sessionId'
}))

// Gets the api documentation webpage
app.get('/', function(req, res) {
    logger.info('Open homepage');
    res.sendFile(path.join(__dirname, 'docs-website/dist/index.html'));
  });

// Gets a random line
app.get("/random", async(req, res) => {
    logger.info('Get a random line');
    try {
        const quote = await pool.query(
            "SELECT season, episode, character, line FROM lines OFFSET floor(random() * (SELECT COUNT(*) FROM lines))"
        )
        res.json(quote.rows[0]);
    }
    catch (err) {
        logger.error(err);
    }
})

// Get a response given user text
app.get("/ask/:question", async (req, res) => {
    logger.info('Ask question to script');
    const { question } = req.params;
    var q = question.replaceAll("-", " & ");
    q = q.replace("'", "").toLowerCase();

    // Try full text search
    try {
        const line = await pool.query(
             "SELECT line_id, line FROM lines WHERE ts_lines @@ to_tsquery('simple', $1) ORDER BY ts_rank(ts_lines, to_tsquery('simple', $1)) DESC LIMIT 10", [q]
            )
        if (line.rows.length == 0) {
            logger.warn("Full text search didnt work. Trying trigrams..")
            // Try trigrams if full-text search fails
            try {
                const line = await pool.query(
                // "SELECT line FROM lines WHERE levenshtein(line, $1) <= 1", [txt]
                      "SELECT line_id, line FROM lines ORDER BY SIMILARITY(line, $1) DESC LIMIT 5", [q]
                )
                const lineID = line.rows[0]['line_id'] + 1;
                try {
                    const response = await pool.query(
                        "SELECT season, episode, character, line from LINES WHERE line_id = $1", [lineID]
                    )
                    res.json(response.rows[0]);
                } 
                catch (err) {
                    logger.error(err);
                }
            } 
            catch (err) {
                logger.error(err);
            }           
        }
        else {
            res_id = line.rows[0]['line_id'] + 1
        
            try {
                const line2 = await pool.query(
                    "SELECT season, episode, character, line FROM lines WHERE line_id = $1", [res_id]
                )    
                res.json(line2.rows[0]);
                return;
            } 
            catch (err) {
                logger.error(err);
            }
        }
    } 
    catch (err) {
        logger.error(err);
    }
})

// Gets a line from character given user text
app.get("/characters/:character/ask/:question", async (req, res) => {
    logger.info('Ask question to character');
    const { character, question } = req.params;
    var q = question.replaceAll("-", " & ");
    q.replace("'", "").toLowerCase();
    var characterName = character.charAt(0).toUpperCase() + character.slice(1).toLowerCase();
    const tableName = characterName.charAt(0).toLowerCase() + characterName.slice(1) + 'responses';
    try {
        var query = "SELECT season, episode, response FROM " + tableName + " WHERE ts_lines @@ to_tsquery('simple', $1) ORDER BY ts_rank(ts_lines, to_tsquery('simple', $1)) DESC LIMIT 100";
        const response = await pool.query(query, [q]);

        if (response.rows.length == 0) {
            // Try trigrams if full-text search fails
            logger.warn('Full text search doesnt work. Trying trigrams');
            try {
                var query = "SELECT season, episode, response FROM " +  tableName + " ORDER BY SIMILARITY(line, $1) DESC LIMIT 5"
                const line = await pool.query(query, [q]);
                res.json(line.rows[0]);
            }
            catch (err) {
                logger.error(err);
            }
        } 
        else {
            res.json(response.rows[0]);
        }
    }
    catch (err) {
        logger.error(err);
    }
});

// Gets script for random episode from given season
app.get("/seasons/:season/random", async (req, res) => {
    logger.info('Get script from random season and episode');
    try {
        const {season} = req.params;
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

// Gets a random quote from given season
app.get("/seasons/:season/random", async(req, res) => {
    try {
        const { season } = req.params;
        const seasonNum = parseInt(season);
        const quote = await pool.query(
            "SELECT season, episode, character, line FROM lines WHERE season = $1 OFFSET floor(random() * (SELECT COUNT(*) FROM lines WHERE season = $1)) ",
            [seasonNum]
        );
        res.json(quote.rows[0]);
    }
    catch (err) {
        logger.error(err);
    }
})

// Gets a random quote from a random character given season and episode
app.get("/seasons/:season/episodes/:episode/random", async(req, res) => {
    logger.info('Get random quote from random character given season and episode');
    try {
        const { season, episode } = req.params;
        const seasonNum = parseInt(season);
        const episodeNum = parseInt(episode);
        const quote = await pool.query(
            "SELECT character, line FROM lines WHERE season = $1 AND episode = $2 OFFSET floor(random() * (SELECT COUNT(*) FROM lines WHERE season = $1 AND episode = $2)) ",
            [seasonNum, episodeNum]
        );
        res.json(quote.rows[0]);
    }
    catch (err) {
        logger.error(err);
    }
})

// Gets a random quote from given character
app.get("/characters/:character/random", async(req, res) => {
    logger.info('Get random quote from given character');
    try {
        const { character } = req.params;
        const characterName = character.charAt(0).toUpperCase() + character.slice(1);
        const quote = await pool.query(
            "SELECT season, episode, line FROM lines WHERE character = $1 OFFSET floor(random() * (SELECT COUNT(*) FROM lines WHERE character = $1))",
            [characterName]
        );
        res.json(quote.rows[0]);
    }
    catch (err) {
        logger.error(err);
    }
})

// Gets a random quote from given season and character
app.get("/seasons/:season/characters/:character/random", async(req, res) => {
    logger.info('Get random quote from given season and character');
    try {
        const { season, character } = req.params;
        const seasonNum = parseInt(season);
        const characterName = character.charAt(0).toUpperCase() + character.slice(1);
        const quote = await pool.query(
            "SELECT episode, line FROM lines WHERE season = $1 AND character = $2 OFFSET floor(random() * (SELECT COUNT(*) FROM lines WHERE season = $1 AND character = $2)) ",
            [seasonNum, characterName]
        );
        res.json(quote.rows[0]);
    }
    catch (err) {
        logger.error(err);
    }
})

// Gets random quote from given season, episode, and character
app.get("/seasons/:season/episodes/:episode/characters/:character/random", async(req, res) => {
    logger.info('Get random quote from given season, episode, and character');
    try {
        const { season, episode, character } = req.params;
        const seasonNum = parseInt(season);
        const episodeNum = parseInt(episode);
        const characterName = character.charAt(0).toUpperCase() + character.slice(1);
        const quote = await pool.query(
            "SELECT line FROM lines WHERE season = $1 AND episode = $2 AND character = $3 OFFSET floor(random() * (SELECT COUNT(*) FROM lines WHERE season = $1 AND episode = $2 AND character = $3)) ",
            [seasonNum, episodeNum, characterName]
        );
        res.json(quote.rows[0]);
    }
    catch (err) {
        logger.error(err);
    }
})

// Gets every line for given character, season, and episode
app.get("/seasons/:season/episodes/:episode/characters/:character", async(req, res) => {
    logger.info('Get every line from given character, season, and episode');
    try {
        const { season, episode, character } = req.params;
        const characterName = character.charAt(0).toUpperCase() + character.slice(1);
        const script = await pool.query("SELECT line FROM lines WHERE season = $1 AND episode = $2 AND character = $3"
        , [season, episode, characterName])
        res.json(script.rows);
    }
    catch(err) {
        logger.error(err);
    }
})

app.listen(PORT || 5001, (req, res) => {
    console.log(`server is running on port ${PORT}`);
})