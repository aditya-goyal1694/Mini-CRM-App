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
        // Name of campaign/segment
        type: DataTypes.STRING,
        allowNull: false,
      },
      rule: {
        // Stores the JSON logic (as stringified JSON)
        type: DataTypes.JSON,
        allowNull: false,
      },
      audience_size: {
        // Snapshot of audience size at creation
        type: DataTypes.INTEGER,
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