// connect the server to database

require('dotenv').config()
const Pool = require("pg").Pool;

const pool = new Pool({
    user: process.env.USERNAME,
    password: process.env.PASSWORD, 
    host: process.env.HOST,
    port: parseInt(process.env.PORT),
    database: process.env.DATABASE,
});

module.exports = pool;