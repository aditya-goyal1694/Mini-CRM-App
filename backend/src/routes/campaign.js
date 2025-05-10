const express = require('express');
const router = express.Router();
const { Campaign, Customer } = require('../models');
const sequelizeRules = require('../utils/sequelizeRules');

/**
 * POST /api/campaigns
 * Body: { name: string, rule: JSON }
 * Returns: created campaign with audience_size
 */
router.post('/', async (req, res) => {
  try {
    const { name, rule } = req.body;
    if (!name || !rule) {
      return res.status(400).json({ message: 'Both name and rule are required.' });
    }
    // Evaluate audience size for rule
    const where = sequelizeRules(rule);
    const audience_size = await Customer.count({ where });

    // Save campaign with rule and audience size
    const newCampaign = await Campaign.create({
      name,
      rule,
      audience_size
    });
    res.status(201).json(newCampaign);
  } catch (err) {
    res.status(500).json({ message: 'Error creating campaign', error: err.message });
  }
});

/**
 * GET /api/campaigns
 * Returns: List of campaigns, most recent first
 */
router.get('/', async (req, res) => {
  try {
    const campaigns = await Campaign.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.json(campaigns);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching campaigns', error: err.message });
  }
});

module.exports = router;