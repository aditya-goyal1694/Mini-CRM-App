const express = require('express');
const router = express.Router();
const { Order, Customer } = require('../models');
const { orderSchema } = require('../validators/order');
const redis = require('../utils/redis');

// Create a new order for a customer
router.post('/', async (req, res) => {
  const { error, value } = orderSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    await redis.xAdd('orders_stream', '*', {
      data: JSON.stringify(value)
    });
    return res.status(202).json({ accepted: true });
  } catch (err) {
    return res.status(500).json({ message: 'Error queuing order', error: err.message });
  }
});

// List all orders with related customer info
router.get('/', async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [{ model: Customer, attributes: ['id', 'name', 'email'] }]
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching orders', error: err.message });
  }
});

// List all orders for a specific customer
router.get('/customer/:customerId', async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { customerId: req.params.customerId }
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching customer orders', error: err.message });
  }
});

module.exports = router;