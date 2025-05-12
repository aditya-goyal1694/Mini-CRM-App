const { DataTypes } = require('sequelize');

module.exports = (sequelize) =>
  sequelize.define(
    'CommunicationLog',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      campaign_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      customer_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      message: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      delivery_status: {
        type: DataTypes.ENUM('PENDING', 'SENT', 'FAILED'),
        defaultValue: 'PENDING',
        allowNull: false,
      },
      vendor_reference: {
        type: DataTypes.STRING,
        allowNull: true, // May be null if not delivered by a vendor
      },
    },
    {
      tableName: 'communication_log',
      timestamps: true, // Automatically adds createdAt, updatedAt fields
    }
  );