// connect the server to database
require('dotenv').config()
const Pool = require("pg").Pool;

const pool = new Pool({
    user: process.env.RDS_USER,
    password: process.env.RDS_PASSWORD, 
    host: process.env.RDS_HOSTNAME,
    port: parseInt(process.env.RDS_PORT),
    database: process.env.RDS_DATABASE,
});

module.exports = pool;