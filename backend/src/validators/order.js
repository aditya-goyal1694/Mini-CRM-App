const Joi = require('joi');

const orderSchema = Joi.object({
  customerId: Joi.number().integer().positive().required(),
  amount: Joi.number().precision(2).positive().required(),
  status: Joi.string().valid('PLACED', 'CANCELLED', 'FULFILLED').optional(), // Order status
});

module.exports = { orderSchema };