require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });

pool.connect()
    .then(() => console.log('connected to database!'))
    .catch(err => console.error('Connection error', err.stack));

module.exports = pool;