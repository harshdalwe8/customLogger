// fileStorage.js
const { Pool } = require('pg');
const { gatherConfig, saveConfig } = require('../prompt_module/setupConfig');
const dbConfig = require('../config/dbConfig.json');


const pool = new Pool({
  user: dbConfig.user,                                           // Your PostgreSQL username
  host: dbConfig.host,                                           // Your database host (e.g., 'localhost' or IP address)
  database: dbConfig.database,                                   // Your database name
  password: dbConfig.password,                                   // Your password
  port: dbConfig.port,                                           // Your database port (default is 5432)
  max: dbConfig.max,                                             // maximum number of connections in the pool
  idleTimeoutMillis: dbConfig.idleTimeoutMillis,                 // close idle clients after 30 seconds
  connectionTimeoutMillis: dbConfig.connectionTimeoutMillis      // return an error after 5 seconds if connection could not be established
});


// Function to initialize the logs table if it doesn't exist
async function initializeLogTable() {
  // Run the setup
  await gatherConfig()
    .then(saveConfig)
    .catch(console.error);

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
