const express = require('express');
const router = express.Router();
const axios = require('axios');

// Dummy Vendor API (simulates async, ~90% SENT, ~10% FAILED)
router.post('/vendor', async (req, res) => {
  const { logId, customerId, message } = req.body;
  // Simulate async delivery status
  setTimeout(async () => {
    const isSuccess = Math.random() < 0.9; // 90% chance
    const status = isSuccess ? 'SENT' : 'FAILED';

    // Call delivery receipt API in your own backend
    await axios.post('http://localhost:8000/dummy/receipt', {
      logId,
      status,
    });
  }, 500 + Math.floor(Math.random() * 1000)); // random delay 0.5s-1.5s

  res.json({ queued: true });
});

// Delivery Receipt Endpoint
router.post('/receipt', async (req, res) => {
  const { logId, status } = req.body;
  const { CommunicationLog } = require('../models');
  // Update log status
  await CommunicationLog.update(
    { delivery_status: status },
    { where: { id: logId } }
  );
  res.json({ updated: true });
});

module.exports = router;