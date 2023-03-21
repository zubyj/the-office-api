const express = require('express');
const router = express.Router();
const pool = require('../db');

// Get a response given user text
router.get("/ask/:question", async (req, res) => {
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
                    console.log(err);
                }
            }
            catch (err) {
                console.log(err);
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
                console.log(err);
            }
        }
    }
    catch (err) {
        console.log(err);
    }
})

module.exports = router;