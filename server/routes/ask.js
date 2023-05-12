const express = require('express');
const router = express.Router();
const pool = require('../db');
const analytics = require('../analytics.js');

// Get a response given user text
router.get("/ask/:question", async (req, res) => {
    analytics.track({
        event: 'Ask the script',
        userId: 'anonymous',
    });
    const { question } = req.params;
    var q = question.replaceAll("-", " & ");
    q = q.replace("'", "").toLowerCase();

    // Try full text search
    try {
        const line = await pool.query(
            "SELECT line_id, line FROM lines WHERE ts_lines @@ to_tsquery('simple', $1) ORDER BY ts_rank(ts_lines, to_tsquery('simple', $1)) DESC LIMIT 10", [q]
        )
        if (line.rows.length == 0) {
            console.log("Full text search didnt work. Trying trigrams..");
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

// Gets a line from character given user text
router.get("/characters/:character/ask/:question", async (req, res) => {
    analytics.track({
        event: 'Ask a character',
        userId: 'anonymous',
    });
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
            console.log('Full text search doesnt work. Trying trigrams');
            try {
                var query = "SELECT season, episode, response FROM " + tableName + " ORDER BY SIMILARITY(line, $1) DESC LIMIT 5"
                const line = await pool.query(query, [q]);
                res.json(line.rows[0]);
            }
            catch (err) {
                consle.error(err);
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


module.exports = router;