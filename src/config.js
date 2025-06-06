// src/config.js
const fs = require('fs');
const dotenv = require('dotenv');

if (fs.existsSync('.env')) {
  dotenv.config();
} else {
  module.exports = require('../logvista.config.json');
}

module.exports = {
  ORGANISATION_ID: process.env.ORGANISATION_ID,
  CLIENT_ID: process.env.CLIENT_ID,
  PROJECT_ID: process.env.PROJECT_ID,
  SERVER_ID: process.env.SERVER_ID,
  KEY_VALIDITY_DATE: process.env.KEY_VALIDITY_DATE,
  DB_URL: process.env.DB_URL,
  PORT: process.env.PORT || 5566,
  CENTRAL_API_BASEURL: process.env.CENTRAL_API_BASEURL
};
