// test/logs.test.js
const request = require('supertest');
const app = require('../src/server');

test('GET /logs unauthorized', async () => {
  const res = await request(app).get('/logs?projectId=wrong&clientId=wrong');
  expect(res.statusCode).toBe(401);
});