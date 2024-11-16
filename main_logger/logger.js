// logger.js
const { writeToDatabase } = require('../storage/logStorage');
const { colorize } = require('../colors/colors');

class Logger {
  constructor() {
    this.logLevels = { info: 'INFO', warn: 'WARN', error: 'ERROR', debug: 'DEBUG' };
  }

  async log(level, tag, message, meta = {}) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      tag,
      message,
      meta
    };
    
    // Write to PostgreSQL database
    await writeToDatabase(logEntry);

    // Write to console with color
    console.log(colorize(level.toLowerCase(), JSON.stringify(logEntry)));

  }

  info(tag, message, meta) {
    this.log(this.logLevels.info, tag, message, meta);
  }

  warn(tag, message, meta) {
    this.log(this.logLevels.warn, tag, message, meta);
  }

  error(tag, message, meta) {
    this.log(this.logLevels.error, tag, message, meta);
  }

  debug(tag, message, meta) {
    this.log(this.logLevels.debug, tag, message, meta);
  }
}

module.exports = Logger;
