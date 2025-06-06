// bin/logvista-start.js
const { exec } = require('child_process');
exec('pm2 start ./node_modules/logvista/src/server.js --name logvista', (err, stdout, stderr) => {
  if (err) console.error('PM2 Start Error:', err);
  else console.log(stdout);
});
