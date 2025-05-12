const { DataTypes } = require('sequelize');

module.exports = (sequelize) =>
  sequelize.define(
    'Order',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      order_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      status: {
        type: DataTypes.ENUM('PLACED', 'CANCELLED', 'FULFILLED'),
        defaultValue: 'PLACED',
      },
      customerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'customers', key: 'id' }, // Foreign key to Customer
      },
    },
    {
      timestamps: true, // Adds createdAt and updatedAt
      tableName: 'orders',
    }
  );