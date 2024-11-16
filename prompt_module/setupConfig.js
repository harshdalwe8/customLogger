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
    },
    {
        type: 'input',
        name: 'log_port',
        message: 'Enter port available to view logs:'
      }
  ]);

  return responses;
}

// Function to load existing config if available
function loadConfig() {
  if (fs.existsSync(configPath)) {
    const existingConfig = fs.readFileSync(configPath);
    return JSON.parse(existingConfig);
  }
  return {}; // Return an empty object if the file doesn't exist
}


// Save configuration to config.json
function saveConfig(newConfig) {
  const existingConfig = loadConfig();
  
  // Merge existing config with new config
  const updatedConfig = { ...existingConfig, ...newConfig };

  // Save the merged config to config.json
  fs.writeFileSync(configPath, JSON.stringify(updatedConfig, null, 2));
  console.log(`Configuration saved to ${configPath}`);
}



module.exports = {
    gatherConfig,
    saveConfig
};
