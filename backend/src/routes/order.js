const express = require('express');
const router = express.Router();
const { Order, Customer } = require('../models');
const { orderSchema } = require('../validators/order');

// POST /api/orders — Create a new order for a customer
router.post('/', async (req, res) => {
  try {
    // Validate input
    const { error, value } = orderSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    // Check if customer exists
    const customer = await Customer.findByPk(value.customerId);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found.' });
    }
    // Create Order; order_date auto-set
    const order = await Order.create(value);
    return res.status(201).json(order);
  } catch (err) {
    return res.status(500).json({ message: 'Error creating order', error: err.message });
  }
});

// GET /api/orders — List all orders including related customer
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

// GET /api/orders/customer/:customerId — List orders for one customer
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