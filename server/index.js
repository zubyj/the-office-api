const express = require('express');
const app = express()
const cors = require("cors");
const PORT = 8080;
const pool = require('./db');

// Middleware (sits between the client/browser and server/api)

// letting server get requests from clients
app.use(cors());
// parses the json request body  
app.use(express.json())

app.get("/", async(req, res) => {
    try {
        res.send('Welcome to The Office API! Check out the docs to get started and make some requests.');
    }
    catch (err) {
        console.error(err);
    }
});

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

// Gets a random quote for given character
app.get("/characters/:speaker/random", async(req, res) => {
    try {
        const { speaker } = req.params;
        const character = speaker.charAt(0).toUpperCase() + speaker.slice(1);
        const quote = await pool.query(
            "SELECT season, episode, line FROM lines WHERE speaker = $1 OFFSET floor(random() * (SELECT COUNT(*) FROM lines WHERE speaker = $1))",
            [character]
        );
        res.json(quote.rows[0]);
    }
    catch (err) {
        console.error(err);
    }
})

// Gets a random quote for given season
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

// Get every line from given character
app.get("/characters/:id", async(req, res) => {
    try {
        const {id} = req.params;
        console.log(id);
        var id2 = id.charAt(0).toUpperCase() + id.slice(1);
        console.log(id);
        const quote = await pool.query("SELECT season, episode, line FROM lines WHERE speaker = $1", [id2]);
        res.json(quote.rows);
    }
    catch (err) {
        console.error(err);
    }
});

// Gets script for given season and episode
app.get("/seasons/:season/episodes/:episode", async(req, res) => {
    try {
        const { season, episode } = req.params;
        const script = await pool.query("SELECT season, episode, line FROM lines WHERE season = $1 AND episode = $2", [season, episode])
        res.json(script.rows);
    }
    catch(err) {
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