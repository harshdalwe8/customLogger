// setupConfig.js
const fs = require('fs');
const path = require('path');
const { prompt } = require('enquirer');

// File path for config.json
const configPath = path.join(__dirname, 'config.json');

// Function to gather inputs
async function gatherConfig() {
  const responses = await prompt([
    {
      type: 'input',
      name: 'project_name',
      message: 'Enter project name:'
    },
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
    }
  ]);

  return responses;
}

// Save configuration to config.json
function saveConfig(config) {
  fs.appendFileSync(configPath, JSON.stringify(config, null, 2));
  console.log(`Configuration saved to ${configPath}`);
}

module.exports = {
    gatherConfig,
    saveConfig
};
