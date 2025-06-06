#!/usr/bin/env node
import pm2 from 'pm2';

pm2.connect(err => {
  if (err) return console.error(err);

  pm2.stop('logvista', (err) => {
    if (err) console.error('❌ Failed to stop logvista:', err);
    else console.log('🛑 logvista stopped');
    pm2.disconnect();
  });
});
