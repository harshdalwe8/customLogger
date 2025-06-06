// test/init.test.js
const fs = require('fs');
test('creates .env after init', () => {
  expect(fs.existsSync('.env')).toBe(true);
});
