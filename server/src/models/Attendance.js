const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Student = require('./Student');

const Attendance = sequelize.define('Attendance', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('Present', 'Absent', 'Leave'),
    allowNull: false,
    defaultValue: 'Present'
  }
});

module.exports = Attendance;
