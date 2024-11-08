// httpLogger.js
const Logger = require('../main_logger/logger');
const logger = new Logger();

function httpLogger(req, res, next) {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const logEntry = {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      responseTime: `${duration}ms`
    };

    // Log HTTP request details as an info-level log
    logger.info('HTTP Request', logEntry);
  });

  next();
}

module.exports = httpLogger;
