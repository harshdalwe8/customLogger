// logger.js
const { writeToDatabase } = require('./logStorage');
const { colorize } = require('./colors');

class Logger {
  constructor() {
    this.logLevels = { info: 'INFO', warn: 'WARN', error: 'ERROR', debug: 'DEBUG' };
  }

  async log(level, message, meta = {}) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      meta
    };

    // Write to console with color
    console.log(colorize(level.toLowerCase(), JSON.stringify(logEntry)));

    // Write to PostgreSQL database
    await writeToDatabase(logEntry);
  }

  info(message, meta) {
    this.log(this.logLevels.info, message, meta);
  }

  warn(message, meta) {
    this.log(this.logLevels.warn, message, meta);
  }

  error(message, meta) {
    this.log(this.logLevels.error, message, meta);
  }

  debug(message, meta) {
    this.log(this.logLevels.debug, message, meta);
  }
}

module.exports = Logger;
