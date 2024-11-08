// setupConfig.js
const fs = require('fs');
const path = require('path');
const { prompt } = require('enquirer');

// File path for config.json
const configPath = path.join(__dirname, '../config/config.json');

// Function to gather inputs
async function gatherConfig() {
  const responses = await prompt([
    {
      type: 'input',
      name: 'auth_key',
      message: 'Enter auth key:'
    },
    {
      type: 'select',
      name: 'project_env',
      message: 'Select project environment',
      choices: ['development', 'staging', 'production'],
      initial: 'development'
    },
    {
        type: 'input',
        name: 'log_port',
        message: 'Enter port available to view logs:'
      }
  ]);

  return responses;
}

// Save configuration to config.json
function saveConfig(config) {
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  console.log(`Configuration saved to ${configPath}`);
}

module.exports = {
    gatherConfig,
    saveConfig
};
