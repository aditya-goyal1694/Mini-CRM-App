const Joi = require('joi');

const customerSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().pattern(/^\d{10}$/).optional(), // exactly 10 digit number, optional
});

module.exports = { customerSchema };