const express = require('express');
const router = express.Router();
const pool = require('../db');
const logger = require('../logger/logger.js');

// Get a response given user text
// Gets every line for given character, season, and episode
router.get("/seasons/:season/episodes/:episode/characters/:character", async (req, res) => {
    logger.info('Get every line from given character, season, and episode');
    try {
        const { season, episode, character } = req.params;
        const characterName = character.charAt(0).toUpperCase() + character.slice(1);
        const script = await pool.query("SELECT line FROM lines WHERE season = $1 AND episode = $2 AND character = $3"
            , [season, episode, characterName])
        res.json(script.rows);
    }
    catch (err) {
        logger.error(err);
    }
})

module.exports = router;