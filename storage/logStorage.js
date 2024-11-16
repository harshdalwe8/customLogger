const { Pool } = require('pg');
const { gatherConfig, saveConfig } = require('../prompt_module/setupConfig');
const dbConfig = require('../config/dbConfig.json');
const fs = require('fs');
const path = require('path');

let projectConfig;
let pool;

const configPath = path.join(__dirname, '../config/config.json');

// Function to load project config from file
function loadProjectConfig() {
  if (fs.existsSync(configPath)) {
    try {
      projectConfig = require(configPath);
      //console.log('Project configuration loaded from file:', projectConfig);
    } catch (error) {
      console.error('Failed to load project config:', error);
      projectConfig = null;
    }
  } else {
    projectConfig = null;
    //console.log('Project configuration file not found.');
  }
}

// Function to initialize or create project configuration
async function initializeProjectConfig() {
  loadProjectConfig();

  // Check if any required keys are missing
  const requiredKeys = ['project_name', 'auth_key', 'project_env', 'log_port'];
  const missingKeys = requiredKeys.filter(key => !projectConfig || !projectConfig[key]);

  if (missingKeys.length > 0) {
    //console.log('Required configuration keys missing:', missingKeys);
    //console.log('Deleting existing config file and running setup again...');
    
    // Delete the old config file if any required keys are missing
    if (fs.existsSync(configPath)) {
      fs.unlinkSync(configPath);
      //console.log('Old configuration file deleted.');
    }

    // Regather configuration
    try {
      const config = await gatherConfig();
      //console.log('Gathered configuration:', config);
      saveConfig(config);
      projectConfig = config; // Update projectConfig after saving
      //console.log('Configuration saved to', configPath);
    } catch (error) {
      console.error('Error gathering config:', error);
      throw new Error('Failed to initialize project configuration');
    }
  } else {
    // console.log('Project configuration is already available');
  }
}

// Function to create a PostgreSQL pool if it doesn’t exist or isn’t connected
function createPool() {
  if (!pool || pool.ending) {  // Ensure a new pool is created if none exists or pool has ended
    pool = new Pool({
      user: dbConfig.user,
      host: dbConfig.host,
      database: dbConfig.database,
      password: dbConfig.password,
      port: dbConfig.port,
      max: dbConfig.max,
      idleTimeoutMillis: dbConfig.idleTimeoutMillis,
      connectionTimeoutMillis: dbConfig.connectionTimeoutMillis
    });
    //console.log('PostgreSQL pool created');
  }
  return pool;
}

// Function to initialize the logs table if it doesn't exist
async function initializeLogTable() {
  await initializeProjectConfig(); // Ensure project config is ready before proceeding

  if (!projectConfig || !projectConfig.project_name) {
    console.error('Project configuration is missing. Cannot initialize log table.');
    return;
  }

  // Create database pool if not already connected
  createPool();

  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS ${projectConfig.project_name} (
      id SERIAL PRIMARY KEY,
      timestamp TIMESTAMP NOT NULL,
      level VARCHAR(10) NOT NULL,
      tag TEXT NOT NULL,
      message TEXT NOT NULL,
      meta JSONB
    );
  `;
  try {
    await pool.query(createTableQuery);
    //console.log(`Table ${projectConfig.project_name} initialized.`);
  } catch (error) {
    console.error(`Failed to initialize table ${projectConfig.project_name}:`, error);
  }
}

// Function to insert a log entry into the PostgreSQL database
async function writeToDatabase(logEntry) {
  if (!projectConfig || !projectConfig.project_name) {
    console.error('Project configuration is missing. Cannot write to database.');
    return;
  }

  // Ensure pool is created and connected before attempting to write
  createPool();

  const insertQuery = `
    INSERT INTO ${projectConfig.project_name} (timestamp, level, tag, message, meta)
    VALUES ($1, $2, $3, $4, $5)
  `;
  const values = [
    logEntry.timestamp,
    logEntry.level,
    logEntry.tag,
    logEntry.message,
    logEntry.meta ? JSON.stringify(logEntry.meta) : null,
  ];

  try {
    await pool.query(insertQuery, values);
    //console.log('Log entry written to database.');
  } catch (error) {
    console.error('Failed to write log to database:', error);
  }
}

// Initialize the logs table on startup (if not done already)
initializeLogTable().catch(console.error);

module.exports = { writeToDatabase };
