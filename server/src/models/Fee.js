const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Student = require('./Student');

const Fee = sequelize.define('Fee', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('Paid', 'Pending', 'Overdue'),
    defaultValue: 'Pending'
  },
  dueDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  feeType: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'Tuition'
  },
  paymentDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  }
});

module.exports = Fee;
