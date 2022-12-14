/*
This is a helper function.
It reads the complete office script and inserts each line into the database along with the speaker, season, and episode.
*/

const fs = require('fs')
const pool = require('../db');

const insertLines = async(name) => {
    try {
        fs.readFile('office-script.json', 'utf-8', (err, jsonString) => {
            if (err) {
                console.log('File read failed');
                return;
            }
            try {
                const lines = JSON.parse(jsonString);
                for (var j=0; j<lines.length-1; j++) {
                    const speaker = lines[j+1]['speaker'];
                    if (speaker == name) {
                        const season = lines[j]['season']
                        const episode = lines[j]['episode'];
                        const character = lines[j]['speaker'];
                        const line = lines[j]['line_text'];
                        const response = lines[j+1]['line_text'];

                        const tableName = name.charAt(0).toLowerCase() + name.slice(1) + 'Responses';
                        const query =  "INSERT INTO " +  tableName + " (season, episode, character, line, response) VALUES($1, $2, $3, $4, $5) RETURNING *"
                        const newLine =  pool.query(query, [season, episode, character, line, response]);
                    }
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
/*
DONE

insertLines('Michael');
insertLines('Dwight');
insertLines('Jim');
insertLines('Pam');
*/
insertLines('Andy');

