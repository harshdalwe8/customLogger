import pm2 from 'pm2';
import { resolve } from 'path';

const script = resolve(__dirname, '../src/server.js');

pm2.connect(err => {
  if (err) {
    console.error('❌ PM2 connection error:', err);
    process.exit(2);
  }

  pm2.start({
    script,
    name: 'logvista',
    watch: false
  }, (err) => {
    if (err) {
      console.error('❌ Failed to start logvista with PM2:', err);
    } else {
      console.log('🚀 logvista server started with PM2');
    }
    pm2.disconnect();
  });
});
