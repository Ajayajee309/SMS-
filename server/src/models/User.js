const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('Admin', 'Teacher', 'Student'),
    allowNull: false,
    defaultValue: 'Student'
  },
  referenceId: {
    // Links to Student/Teacher table ID if role is Teacher/Student
    type: DataTypes.INTEGER,
    allowNull: true
  }
});

module.exports = User;
