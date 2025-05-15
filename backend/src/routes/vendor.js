const express = require('express');
const router = express.Router();
const axios = require('axios');
const redis = require('../utils/redis');

const BASE_URL = 'https://crm-backend-ycfo.onrender.com';

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
  // Enqueue for async update, don't update DB directly
  await redis.xAdd('receipts_stream', '*', {
    logId: String(logId),
    status: status
  });
  res.json({ updated: true, enqueued: true });
});


module.exports = router;