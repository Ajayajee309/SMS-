const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Mark = sequelize.define('Mark', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  studentId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  courseId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  semester: {
    type: DataTypes.STRING,
    allowNull: false
  },
  internalMarks: {
    type: DataTypes.FLOAT,
    allowNull: true,
    defaultValue: 0
  },
  semesterMarks: {
    type: DataTypes.FLOAT,
    allowNull: true,
    defaultValue: 0
  },
  totalMarks: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  grade: {
    type: DataTypes.STRING,
    allowNull: true
  }
});

module.exports = Mark;
