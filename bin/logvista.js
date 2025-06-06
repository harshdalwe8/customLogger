// bin/logvista.js
// #!/usr/bin/env node
const { execSync } = require('child_process');
const [,, cmd] = process.argv;

if (cmd === 'init') {
  execSync('node ./node_modules/logvista/bin/logvista-init.js', { stdio: 'inherit' });
} else if (cmd === 'start') {
  execSync('node ./node_modules/logvista/bin/logvista-start.js', { stdio: 'inherit' });
} else {
  console.log('Usage: logvista <init|start>');
}
