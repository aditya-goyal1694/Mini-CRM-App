const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false,
  }
);

// Import models
const Customer = require('./customer')(sequelize);
const Order = require('./order')(sequelize);

// Associations
Customer.hasMany(Order, { foreignKey: 'customerId' });
Order.belongsTo(Customer, { foreignKey: 'customerId' });

// Export everything
module.exports = { sequelize, Customer, Order };