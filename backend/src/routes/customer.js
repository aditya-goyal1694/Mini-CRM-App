const express = require('express');
const router = express.Router();
const { Customer } = require('../models');
const { customerSchema } = require('../validators/customer');
const redis = require('../utils/redis');

// Create a new customer
router.post('/', async (req, res) => {
  // Validate request body
  const { error, value } = customerSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  // Instead of direct DB insert, push to Redis stream for async persistence
  try {
    await redis.xAdd('customers_stream', '*', {
      data: JSON.stringify(value)
    });
    
    // Return acceptance response
    return res.status(202).json({ accepted: true });
  } catch (err) {
    return res.status(500).json({ message: 'Error queuing customer', error: err.message });
  }
});

// Get all customers
router.get('/', async (req, res) => {
  const customers = await Customer.findAll();
  res.json(customers);
});

module.exports = router;