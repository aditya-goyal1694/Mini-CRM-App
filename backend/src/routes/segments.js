const express = require('express');
const router = express.Router();
const { Customer } = require('../models');
const sequelizeRules = require('../utils/sequelizeRules');

/**
 * POST /api/segments/preview
 * Body: { rule }
 * Returns: { audience_size }
 */

router.post('/preview', async (req, res) => {
  try {
    const { rule } = req.body;
    if (!rule) {
      return res.status(400).json({ message: 'Missing rule in body.' });
    }

    // Convert rule into Sequelize where clause
    const where = sequelizeRules(rule);
    const audience_size = await Customer.count({ where });

    return res.json({ audience_size });
  } catch (err) {
    res.status(500).json({ message: 'Error evaluating rule', error: err.message });
  }
});

module.exports = router;