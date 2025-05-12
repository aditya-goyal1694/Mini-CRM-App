const express = require('express');
const router = express.Router();
const axios = require('axios');

const BASE_URL = process.env.BACKEND_BASE_URL || 'http://localhost:8000';

// Simulate vendor message delivery (async, ~90% success)
router.post('/vendor', async (req, res) => {
  const { logId, customerId, message } = req.body;

  setTimeout(async () => {
    const isSuccess = Math.random() < 0.9; // 90% chance sent
    const status = isSuccess ? 'SENT' : 'FAILED';

    // Notify receipt endpoint
    await axios.post(`${BASE_URL}/dummy/receipt`, {
      logId,
      status,
    });
  }, 500 + Math.floor(Math.random() * 1000)); // random 0.5–1.5s delay

  res.json({ queued: true });
});

// Update delivery status for communication log
router.post('/receipt', async (req, res) => {
  const { logId, status } = req.body;
  const { CommunicationLog } = require('../models');

  await CommunicationLog.update(
    { delivery_status: status },
    { where: { id: logId } }
  );

  res.json({ updated: true });
});

module.exports = router;