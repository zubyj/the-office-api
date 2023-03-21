const express = require('express');
const router = express.Router();
const pool = require('../db');

// Gets a random line from the database
router.get('/random', async (req, res) => {
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
});

module.exports = router;