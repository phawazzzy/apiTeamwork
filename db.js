const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DB_URL,
});

pool.on('connect', () => {
  console.log('connected to the db');
});

const createUsersTables = () => {
  const queryText = `CREATE TABLE IF NOT EXISTS
    users(
        id UUID PRIMARY KEY,
        firstName VARCHAR(128) NOT NULL,
        email VARCHAR(128) NOT NULL UNIQUE,
        password VARCHAR(128) NOT NULL,
        gender VARCHAR(128) NOT NULL,
        jobRole VARCHAR(128) NOT NULL,
        department VARCHAR(128) NOT NULL,
        address VARCHAR(128) NOT NULL,
        registeredOn TIMESTAMP DEFAULT current_timestamp)`;
  pool.query(queryText)
    .then((res) => {
      console.log(res);
      pool.end();
    }).catch((err) => {
      console.log(err);
    });
};

module.exports = { createUsersTables };

require('make-runnable');
