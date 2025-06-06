// src/server.js
const express = require('express');
const portfinder = require('portfinder');
const bodyParser = require('body-parser');
const config = require('./config');
const prisma = require('./db');

(async () => {
  const app = express();
  app.use(bodyParser.json());

  app.post('/logs', async (req, res) => {
    const log = req.body;
    if (log.projectId !== config.PROJECT_ID || log.clientId !== config.CLIENT_ID) {
      return res.status(401).json({ error: 'Invalid project/client ID' });
    }

    try {
      await prisma.log.create({ data: log });
      res.status(201).json({ success: true });
    } catch (err) {
      console.error('DB Error:', err);
      res.status(400).json({ error: 'Invalid log format' });
    }
  });

  app.get('/logs', async (req, res) => {
    const { projectId, clientId, page = 1, limit = 100 } = req.query;
    if (projectId !== config.PROJECT_ID || clientId !== config.CLIENT_ID) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const logs = await prisma.log.findMany({
      skip: (page - 1) * limit,
      take: parseInt(limit),
      where: { projectId, clientId },
      orderBy: { timestamp: 'desc' }
    });
    res.json(logs);
  });

  portfinder.basePort = parseInt(config.PORT);
  const port = await portfinder.getPortPromise();
  app.listen(port, () => console.log(`🚀 Logvista running on http://localhost:${port}`));
})();