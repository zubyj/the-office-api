const express = require('express');
const app = express()
const cors = require("cors");
const PORT = 8080;
const pool = require('./db');


// Middleware (sits between the client/browser and server/api)
// lets server get requests from localhost
app.use(cors());
// gets the request body and converts it to json, same as body-parser
app.use(express.json())


app.get("/", async(req, res) => {
    try {
        res.send('Welcome to The Office API! Check out the docs to get started and make some requests.');
    }
    catch (err) {
        console.error(err);
    }
});

// Gets script for given season and episode
app.get("/seasons/:season/episodes/:episode", async(req, res) => {
    try {
        const { season, episode } = req.params;
        const script = await pool.query("SELECT speaker, line FROM lines WHERE season = $1 AND episode = $2", [season, episode])
        res.json(script.rows);
    }
    catch(err) {
        console.error(err);
    }
})

// Gets script for random episode from given season
app.get("/seasons/:season/random", async (req, res) => {
    try {
        const {season} = req.params;
        const script = await pool.query("SELECT speaker, line FROM lines WHERE season = $1 OFFSET floor(random() * (SELECT COUNT(*) FROM lines WHERE season = $1))",
            [season]
        )
        res.json(script.rows)
    }
    catch (err) {
        console.error(err);
    }
}) 

// Gets a random quote from the show
app.get("/random", async(req, res) => {
    try {
        const quote = await pool.query(
            "SELECT season, episode, speaker, line FROM lines OFFSET floor(random() * (SELECT COUNT(*) FROM lines))"
            )
            res.json(quote.rows[0]);
    }
    catch (err) {
        console.error(err);
    }
})

// Gets a random quote from given season
app.get("/seasons/:season/random", async(req, res) => {
    try {
        const { season } = req.params;
        const seasonNum = parseInt(season);
        const quote = await pool.query(
            "SELECT season, episode, speaker, line FROM lines WHERE season = $1 OFFSET floor(random() * (SELECT COUNT(*) FROM lines WHERE season = $1)) ",
            [seasonNum]
        );
        res.json(quote.rows[0]);
    }
    catch (err) {
        console.error(err);
    }
})

// Gets a random quote from given season and episode
app.get("/seasons/:season/episodes/:episode/random", async(req, res) => {
    try {
        const { season, episode } = req.params;
        const seasonNum = parseInt(season);
        const episodeNum = parseInt(episode);
        const quote = await pool.query(
            "SELECT speaker, line FROM lines WHERE season = $1 AND episode = $2 OFFSET floor(random() * (SELECT COUNT(*) FROM lines WHERE season = $1 AND episode = $2)) ",
            [seasonNum, episodeNum]
        );
        res.json(quote.rows[0]);
    }
    catch (err) {
        console.error(err);
    }
})

// Gets a random quote from given character
app.get("/characters/:character/random", async(req, res) => {
    try {
        const { character } = req.params;
        const char = character.charAt(0).toUpperCase() + character.slice(1);
        const quote = await pool.query(
            "SELECT season, episode, line FROM lines WHERE speaker = $1 OFFSET floor(random() * (SELECT COUNT(*) FROM lines WHERE speaker = $1))",
            [char]
        );
        res.json(quote.rows[0]);
    }
    catch (err) {
        console.error(err);
    }
})

// Gets a random quote from given season and character
app.get("/seasons/:season/characters/:character/random", async(req, res) => {
    try {
        const { season, character } = req.params;
        const seasonNum = parseInt(season);
        const char = character.charAt(0).toUpperCase() + character.slice(1);
        const quote = await pool.query(
            "SELECT episode, line FROM lines WHERE season = $1 AND speaker = $2 OFFSET floor(random() * (SELECT COUNT(*) FROM lines WHERE season = $1 AND speaker = $2)) ",
            [seasonNum, char]
        );
        res.json(quote.rows[0]);
    }
    catch (err) {
        console.error(err);
    }
})

// Gets random quote from given season, episode, and character
app.get("/seasons/:season/episodes/:episode/characters/:character/random", async(req, res) => {
    try {
        const { season, episode, character } = req.params;
        const seasonNum = parseInt(season);
        const episodeNum = parseInt(episode);
        const char = character.charAt(0).toUpperCase() + character.slice(1);
        const quote = await pool.query(
            "SELECT line FROM lines WHERE season = $1 AND episode = $2 AND speaker = $3 OFFSET floor(random() * (SELECT COUNT(*) FROM lines WHERE season = $1 AND episode = $2 AND speaker = $3)) ",
            [seasonNum, episodeNum, char]
        );
        res.json(quote.rows[0]);
    }
    catch (err) {
        console.error(err);
    }
})



// Gets every line for given character, season, and episode
app.get("/seasons/:season/episodes/:episode/characters/:character", async(req, res) => {
    try {
        const { season, episode, character } = req.params;
        speaker = character.charAt(0).toUpperCase() + character.slice(1);
        const script = await pool.query("SELECT line FROM lines WHERE season = $1 AND episode = $2 AND speaker = $3"
        , [season, episode, speaker])
        res.json(script.rows);
    }
    catch(err) {
        console.error(err);
    }
})

app.listen(PORT, (req, res) => {
    console.log(`server is running on port ${PORT}`);
})