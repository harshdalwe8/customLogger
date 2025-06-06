#!/usr/bin/env node
import pm2 from 'pm2';

pm2.connect(err => {
  if (err) return console.error(err);

  pm2.describe('logvista', (err, desc) => {
    if (err) console.error('❌ PM2 status fetch error:', err);
    else console.log('📊 logvista status:', JSON.stringify(desc, null, 2));
    pm2.disconnect();
  });
});
