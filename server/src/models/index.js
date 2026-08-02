const sequelize = require('../config/db');
const User = require('./User');
const Student = require('./Student');
const Attendance = require('./Attendance');

const Course = require('./Course');
const Notice = require('./Notice');
const Teacher = require('./Teacher');
const Fee = require('./Fee');
const Mark = require('./Mark');
const Timetable = require('./Timetable');

// Define Relationships
Student.hasMany(Attendance, { foreignKey: 'studentId', onDelete: 'CASCADE' });
Attendance.belongsTo(Student, { foreignKey: 'studentId' });

Student.hasMany(Fee, { foreignKey: 'studentId', onDelete: 'CASCADE' });
Fee.belongsTo(Student, { foreignKey: 'studentId' });

Teacher.hasMany(Course, { foreignKey: 'facultyId' });
Course.belongsTo(Teacher, { foreignKey: 'facultyId' });

Student.hasMany(Mark, { foreignKey: 'studentId', onDelete: 'CASCADE' });
Mark.belongsTo(Student, { foreignKey: 'studentId' });

Course.hasMany(Mark, { foreignKey: 'courseId', onDelete: 'CASCADE' });
Mark.belongsTo(Course, { foreignKey: 'courseId' });

Course.hasMany(Timetable, { foreignKey: 'courseId', onDelete: 'CASCADE' });
Timetable.belongsTo(Course, { foreignKey: 'courseId' });

Teacher.hasMany(Timetable, { foreignKey: 'teacherId', onDelete: 'CASCADE' });
Timetable.belongsTo(Teacher, { foreignKey: 'teacherId' });

module.exports = {
  sequelize,
  User,
  Student,
  Attendance,
  Course,
  Notice,
  Fee,
  Teacher,
  Mark,
  Timetable
};
