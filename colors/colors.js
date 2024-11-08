// colors.js

const colors = {
    reset: "\x1b[0m",
    info: "\x1b[32m",    // Green
    warn: "\x1b[33m",    // Yellow
    error: "\x1b[31m",   // Red
    debug: "\x1b[34m",   // Blue
  };
  
  function colorize(level, message) {
    return `${colors[level] || colors.reset}${message}${colors.reset}`;
  }
  
  module.exports = { colorize };
  