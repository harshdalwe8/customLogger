// src/cli.js
const fs = require('fs');
const path = require('path');
const prompt = require('prompt-sync')({ sigint: true });
const axios = require('axios');

const CONFIG_PATH = path.join(__dirname, '..', 'config.json');

function initializeConfig() {
  console.log("Welcome to CustomLogger initialization!");

  const host = prompt("Database Host (default-host-value): ", 'default-host-value');
  const user = prompt("Database User (default-user-value): ", 'default-user-value');
  const password = prompt("Database Password (default-password-value): ", 'default-password-value');
  const projectName = prompt("Project Name: ");
  const port = prompt("Database Port (5432): ", '5432');
  const licenseKey = prompt("Enter your LICENSE_KEY: ");

  // Validate LICENSE_KEY (example endpoint, replace with real)
  axios.post('https://license-server.com/validate', { licenseKey })
    .then(response => {
      if (response.data.valid) {
        console.log('License validated successfully.');
        const config = {
          host,
          user,
          password,
          database: projectName,
          port,
          licenseKey
        };
        fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
        console.log('Configuration saved successfully.');
      } else {
        console.error('Invalid LICENSE_KEY. Initialization aborted.');
        process.exit(1);
      }
    })
    .catch(err => {
      console.error('Error validating LICENSE_KEY:', err.message);
      process.exit(1);
    });
}

if (require.main === module) {
  initializeConfig();
}

module.exports = initializeConfig;
