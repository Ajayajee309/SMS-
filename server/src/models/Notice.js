const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Notice = sequelize.define('Notice', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  targetAudience: {
    type: DataTypes.ENUM('All', 'Students', 'Teachers'),
    defaultValue: 'All'
  }
});

module.exports = Notice;
