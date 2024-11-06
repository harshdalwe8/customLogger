// index.js
const Logger = require('./logger');
const httpLogger = require('./httpLogger');

module.exports = {
  logger: new Logger(),
  httpLogger
};
