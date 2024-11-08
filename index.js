// index.js
const Logger = require('./main_logger/logger');
const httpLogger = require('./http_module/httpLogger');

module.exports = {
  logger: new Logger(),
  httpLogger
};
