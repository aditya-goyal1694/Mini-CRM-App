const { DataTypes } = require('sequelize');

module.exports = (sequelize) =>
  sequelize.define(
    'Customer',
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: DataTypes.STRING, allowNull: false },
      email: { type: DataTypes.STRING, allowNull: false, unique: true },
      phone: { type: DataTypes.STRING },
      last_purchase_date: { type: DataTypes.DATE },
      total_spend: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
      visits: { type: DataTypes.INTEGER, defaultValue: 0 },
    },
    {
      timestamps: true, // adds createdAt/updatedAt
      tableName: 'customers',
    }
  );