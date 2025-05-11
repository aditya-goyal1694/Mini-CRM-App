const express = require('express');
const router = express.Router();
const { Campaign, Customer, CommunicationLog } = require('../models');
const sequelizeRules = require('../utils/sequelizeRules');
const axios = require('axios');
const { Op, fn, col, literal } = require("sequelize"); // <-- Added for aggregation

const BASE_URL = process.env.BACKEND_BASE_URL || 'http://localhost:8000';

const personalizeMessage = (customer, campaign) =>
  `Hi ${customer.name}, here’s 10% off on your next order! (Campaign: ${campaign.name})`;

router.post('/', async (req, res) => {
  try {
    const { name, rule } = req.body;
    if (!name || !rule) {
      return res.status(400).json({ message: 'Both name and rule are required.' });
    }

    const where = sequelizeRules(rule);
    const audience = await Customer.findAll({ where });
    const audience_size = audience.length;

    // Save campaign with rule and audience size
    const newCampaign = await Campaign.create({
      name,
      rule,
      audience_size
    });

    // For each recipient, create log and initiate delivery (do NOT await all axios)
    for (const customer of audience) {
      const message = personalizeMessage(customer, newCampaign);
      const log = await CommunicationLog.create({
        campaign_id: newCampaign.id,
        customer_id: customer.id,
        message,
        delivery_status: 'PENDING'
      });
      // Call dummy vendor (simulate delivery)
      axios.post(`${BASE_URL}/dummy/vendor`, {
        logId: log.id,
        customerId: customer.id,
        message,
      });
    }

    res.status(201).json(newCampaign);
  } catch (err) {
    res.status(500).json({ message: 'Error creating campaign', error: err.message });
  }
});

// UPDATED GET /
// This will include sent_count and failed_count with each campaign
router.get('/', async (req, res) => {
  try {
    // Get all campaigns
    const campaigns = await Campaign.findAll({
      order: [['createdAt', 'DESC']],
      raw: true
    });

    if (campaigns.length === 0) {
      // No campaigns to report
      return res.json([]);
    }

    const campaignIds = campaigns.map(c => c.id);

    // Get per-campaign sent/failed counts in bulk
    const logs = await CommunicationLog.findAll({
      attributes: [
        'campaign_id',
        [fn('sum', literal("CASE WHEN delivery_status='SENT' THEN 1 ELSE 0 END")), 'sent_count'],
        [fn('sum', literal("CASE WHEN delivery_status='FAILED' THEN 1 ELSE 0 END")), 'failed_count'],
      ],
      where: {
        campaign_id: { [Op.in]: campaignIds }
      },
      group: ['campaign_id'],
      raw: true
    });

    // Map stats by campaign_id for faster lookup
    const statsById = {};
    for (const row of logs) {
      statsById[row.campaign_id] = {
        sent_count: Number(row.sent_count),
        failed_count: Number(row.failed_count),
      };
    }

    const campaignsWithStats = campaigns.map(c => ({
      ...c,
      sent_count: statsById[c.id]?.sent_count ?? 0,
      failed_count: statsById[c.id]?.failed_count ?? 0,
    }));

    res.json(campaignsWithStats);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching campaigns', error: err.message });
  }
});

module.exports = router;