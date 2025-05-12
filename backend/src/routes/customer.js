const express = require('express');
const router = express.Router();
const { Customer } = require('../models');
const { customerSchema } = require('../validators/customer');

// Create a new customer
router.post('/', async (req, res) => {
  try {
    // Validate request body with Joi schema
    const { error, value } = customerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const newCustomer = await Customer.create(value);
    return res.status(201).json(newCustomer);
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ message: 'Customer with this email already exists.' });
    }
    return res.status(500).json({ message: 'Error creating customer', error: err.message });
  }
});

// Get all customers
router.get('/', async (req, res) => {
  const customers = await Customer.findAll();
  res.json(customers);
});

module.exports = router;