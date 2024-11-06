// fileStorage.js
const { Pool } = require('pg');
const { gatherConfig, saveConfig } = require('./setupConfig');
const config = require('./config.json');

// Configure PostgreSQL connection
// const pool = new Pool({
//   user: 'devUser',           // Your PostgreSQL username
//   host: 'localhost',         // Your database host (e.g., 'localhost' or IP address)
//   database: 'customLogger',  // Your database name
//   password: 'rootUser',       // Your password
//   port: 5432,     
//   max: 20,                     // maximum number of connections in the pool
//   idleTimeoutMillis: 30000,    // close idle clients after 30 seconds
//   connectionTimeoutMillis: 2000 // return an error after 2 seconds if connection could not be established
// });

const pool = new Pool({
  user: 'devuser',           // Your PostgreSQL username
  host: 'localhost',         // Your database host (e.g., 'localhost' or IP address)
  database: 'customLogger',  // Your database name
  password: 'rootUser',       // Your password
  port: 5432,                // Your database port (default is 5432)
});


// Function to initialize the logs table if it doesn't exist
async function initializeLogTable() {
  // Run the setup
  // await gatherConfig()
  //   .then(saveConfig)
  //   .catch(console.error);

  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS templogs (
      id SERIAL PRIMARY KEY,
      timestamp TIMESTAMP NOT NULL,
      level VARCHAR(10) NOT NULL,
      message TEXT NOT NULL,
      meta JSONB
    );
  `;
  await pool.query(createTableQuery);
}

// Function to insert a log entry into the PostgreSQL database
async function writeToDatabase(logEntry) {
  const insertQuery = `
    INSERT INTO templogs (timestamp, level, message, meta)
    VALUES ($1, $2, $3, $4)
  `;
  const values = [
    logEntry.timestamp,
    logEntry.level,
    logEntry.message,
    logEntry.meta ? JSON.stringify(logEntry.meta) : null,
  ];

  try {
    await pool.query(insertQuery, values);
  } catch (error) {
    console.error('Failed to write log to database:', error);
  }
}

// Initialize the logs table on startup
initializeLogTable().catch(console.error);

module.exports = { writeToDatabase };
