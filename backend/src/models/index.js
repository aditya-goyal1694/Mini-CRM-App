const { Sequelize } = require('sequelize');
require('dotenv').config();

// Initialize Sequelize connection with environment credentials
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    logging: false,
  }
);

// Model imports
const Customer = require('./customer')(sequelize);
const Order = require('./order')(sequelize);
const Campaign = require('./campaign')(sequelize);
const CommunicationLog = require('./communicationLog')(sequelize);

// Model associations
Customer.hasMany(Order, { foreignKey: 'customerId' });
Order.belongsTo(Customer, { foreignKey: 'customerId' });

Campaign.hasMany(CommunicationLog, { foreignKey: 'campaign_id' });
CommunicationLog.belongsTo(Campaign, { foreignKey: 'campaign_id' });

Customer.hasMany(CommunicationLog, { foreignKey: 'customer_id' });
CommunicationLog.belongsTo(Customer, { foreignKey: 'customer_id' });

module.exports = { sequelize, Customer, Order, Campaign, CommunicationLog };