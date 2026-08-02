const { Mark, Student, Course } = require('../models');

exports.getAllMarks = async (req, res) => {
  try {
    const marks = await Mark.findAll({
      include: [Student, Course],
      order: [['createdAt', 'DESC']]
    });
    res.json(marks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching marks', error });
  }
};

exports.getMarksByStudent = async (req, res) => {
  try {
    const marks = await Mark.findAll({
      where: { studentId: req.params.studentId },
      include: [Course]
    });
    res.json(marks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching marks', error });
  }
};

exports.saveMark = async (req, res) => {
  try {
    const { studentId, courseId, semester, internalMarks, semesterMarks } = req.body;
    
    // Calculate total and grade
    const totalMarks = parseFloat(internalMarks || 0) + parseFloat(semesterMarks || 0);
    let grade = 'F';
    if (totalMarks >= 90) grade = 'O';
    else if (totalMarks >= 80) grade = 'A+';
    else if (totalMarks >= 70) grade = 'A';
    else if (totalMarks >= 60) grade = 'B+';
    else if (totalMarks >= 50) grade = 'B';
    
    let record = await Mark.findOne({ where: { studentId, courseId, semester } });
    
    if (record) {
      await record.update({ internalMarks, semesterMarks, totalMarks, grade });
    } else {
      record = await Mark.create({ studentId, courseId, semester, internalMarks, semesterMarks, totalMarks, grade });
    }
    
    res.json(record);
  } catch (error) {
    res.status(500).json({ message: 'Error saving mark', error });
  }
};
