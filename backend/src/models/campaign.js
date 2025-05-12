const { DataTypes } = require('sequelize');

module.exports = (sequelize) =>
  sequelize.define(
    'Campaign',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      rule: {
        type: DataTypes.JSON,   // Stores campaign rule logic as JSON
        allowNull: false,
      },
      audience_size: {
        type: DataTypes.INTEGER, // Audience size at creation time
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: 'campaigns',
    }
  );