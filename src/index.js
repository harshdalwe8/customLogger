// src/index.js
const { pool, initializeDatabase } = require('./database');

class Logger {
  constructor() {
    initializeDatabase();
  }

  async log(level, message, metadata = {}) {
    const timestamp = new Date().toISOString();
    console.log(JSON.stringify({ level, message, metadata, timestamp }));

    // Save to database
    try {
      await pool.query(
        'INSERT INTO logs (level, message, metadata, timestamp) VALUES ($1, $2, $3, $4)',
        [level, message, JSON.stringify(metadata), timestamp]
      );
    } catch (err) {
      console.error('Failed to save log to database:', err.message);
    }
  }

  info(message, metadata) {
    this.log('info', message, metadata);
  }

  warn(message, metadata) {
    this.log('warn', message, metadata);
  }

  error(message, metadata) {
    this.log('error', message, metadata);
  }
}

module.exports = new Logger();
