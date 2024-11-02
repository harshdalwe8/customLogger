// src/server.js
const express = require('express');
const { pool } = require('./database');

const app = express();
const PORT = 4567;

app.get('/logs', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const query = `
    SELECT level, message, metadata, timestamp FROM logs ORDER BY timestamp DESC LIMIT 10
  `;

  pool.query(query)
    .then(result => {
      res.write(`data: ${JSON.stringify(result.rows)}\n\n`);
    })
    .catch(err => {
      res.write(`data: {"error": "${err.message}"}\n\n`);
    });

  setInterval(() => {
    pool.query(query)
      .then(result => {
        res.write(`data: ${JSON.stringify(result.rows)}\n\n`);
      })
      .catch(err => {
        res.write(`data: {"error": "${err.message}"}\n\n`);
      });
  }, 5000);
});

app.listen(PORT, () => {
  console.log(`Real-time log server running at http://localhost:${PORT}`);
});
