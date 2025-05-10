const express = require('express');
const router = express.Router();
const { Campaign, Customer, CommunicationLog } = require('../models');
const sequelizeRules = require('../utils/sequelizeRules');
const axios = require('axios'); // We'll use axios for internal HTTP calls

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
      axios.post('http://localhost:8000/dummy/vendor', {
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