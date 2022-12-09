/*
This is a helper function.
It reads the complete office script and inserts each line into the database along with the speaker, season, and episode.
*/

const fs = require('fs')
const pool = require('../db');


const insertLines = async() => {
    try {
        fs.readFile('../office-script.json', 'utf-8', (err, jsonString) => {
            if (err) {
                console.log('File read failed');
                return;
            }
            try {
                const lines = JSON.parse(jsonString)
                for (var j=0; j<lines.length; j++) {
                    const line = lines[j]['line_text']
                    const speaker = lines[j]['speaker']
                    const season = lines[j]['season']
                    const episode = lines[j]['episode'];
        
                    const newLine =  pool.query("INSERT INTO lines (line, speaker, season, episode) VALUES($1, $2, $3, $4) RETURNING *",
                    [line, speaker, season, episode]);
                }
            }
            catch (err) {
                console.log("Error parsing the json string", err)
            }
        });
    }
    catch (err) {
        console.error(err);
    }
}

insertLines()

