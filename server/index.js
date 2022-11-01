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

// Gets a random line
app.get("/random", async(req, res) => {
    try {
        const quote = await pool.query(
            "SELECT season, episode, character, line FROM lines OFFSET floor(random() * (SELECT COUNT(*) FROM lines))"
            )
            res.json(quote.rows[0]);
    }
    catch (err) {
        console.error(err);
    }
})

// Get a response to user text.
app.get("/ask/:question", async (req, res) => {
    const { question } = req.params;
    var q = question.replaceAll("-", " & ");
    q = q.replace("'", "").toLowerCase();
    console.log(q);
    // Try full text search
    try {
        const line = await pool.query(
             "SELECT line_id, line FROM lines WHERE ts_lines @@ to_tsquery('simple', $1) ORDER BY ts_rank(ts_lines, to_tsquery('simple', $1)) DESC LIMIT 10", [q]
            )
        if (line.rows.length == 0) {
            console.log("full text search didnt work");
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
                    console.error(err);
                }
            } 
            catch (err) {
                console.error(err);
            }           
        }
        else {
            res_id = line.rows[0]['line_id'] + 1
        
            try {
                const line2 = await pool.query(
                    "SELECT season, episode, character, line FROM lines WHERE line_id = $1", [res_id]
                )    
                console.log('match : ' + line.rows[0]['line'] + ', res : ' + line2.rows[0]['line'])
                res.json(line2.rows[0]);
                return;
            } 
            catch (err) {
                console.error(err);
            }
        }
    } 
    catch (err) {
        console.error(err);
    }
})

// Ask a character 
app.get("/characters/:character/ask/:question", async (req, res) => {
    const { character, question } = req.params;
    var q = question.replaceAll("-", " & ");
    q.replace("'", "").toLowerCase();
    var characterName = character.charAt(0).toUpperCase() + character.slice(1).toLowerCase();
    try {
        const response = await pool.query(
            "SELECT season, episode, character, response FROM michaelresponses WHERE ts_lines @@ to_tsquery('simple', $1) ORDER BY ts_rank(ts_lines, to_tsquery('simple', $1)) DESC LIMIT 100", [q]
        )

        if (response.rows.length == 0) {
            // Try trigrams if full-text search fails
            try {
                const line = await pool.query(
                    "SELECT season, episode, character, response FROM michaelresponses ORDER BY SIMILARITY(line, $1) DESC LIMIT 5", [q]
                )
                res.json(line.rows[0]);
            }
            catch (err) {
                console.error(err);
            }
        } 
        else {
            res.json(response.rows[0]);
        }
    }
    catch (err) {
        console.error(err);
    }
});

// Gets script for random episode from given season
app.get("/seasons/:season/random", async (req, res) => {
    try {
        const {season} = req.params;
        const script = await pool.query("SELECT character, line FROM lines WHERE season = $1 OFFSET floor(random() * (SELECT COUNT(*) FROM lines WHERE season = $1))",
            [season]
        )
        res.json(script.rows)
    }
    catch (err) {
        console.error(err);
    }
}) 

// Gets script from given season and episode
app.get("/seasons/:season/episodes/:episode", async(req, res) => {
    try {
        const { season, episode } = req.params;
        const script = await pool.query("SELECT character, line FROM lines WHERE season = $1 AND episode = $2", [season, episode])
        res.json(script.rows);
    }
    catch(err) {
        console.error(err);
    }
})

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
        console.error(err);
    }
})

// Gets a random quote from a random character given season and episode
app.get("/seasons/:season/episodes/:episode/random", async(req, res) => {
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
        console.error(err);
    }
})

// Gets a random quote from given character
app.get("/characters/:character/random", async(req, res) => {
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
        console.error(err);
    }
})

// Gets a random quote from given season and character
app.get("/seasons/:season/characters/:character/random", async(req, res) => {
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
        console.error(err);
    }
})

// Gets random quote from given season, episode, and character
app.get("/seasons/:season/episodes/:episode/characters/:character/random", async(req, res) => {
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
        console.error(err);
    }
})

// Gets every line for given character, season, and episode
app.get("/seasons/:season/episodes/:episode/characters/:character", async(req, res) => {
    try {
        const { season, episode, character } = req.params;
        const characterName = character.charAt(0).toUpperCase() + character.slice(1);
        const script = await pool.query("SELECT line FROM lines WHERE season = $1 AND episode = $2 AND character = $3"
        , [season, episode, characterName])
        res.json(script.rows);
    }
    catch(err) {
        console.error(err);
    }
})

app.listen(PORT, (req, res) => {
    console.log(`server is running on port ${PORT}`);
})