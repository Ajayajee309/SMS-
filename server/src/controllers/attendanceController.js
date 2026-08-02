const { Attendance, Student } = require('../models');

exports.markAttendance = async (req, res) => {
  try {
    const { studentId, date, status } = req.body;
    
    let record = await Attendance.findOne({ where: { studentId, date } });
    
    if (record) {
      record.status = status;
      await record.save();
    } else {
      record = await Attendance.create({ studentId, date, status });
    }
    
    res.json(record);
  } catch (error) {
    res.status(500).json({ message: 'Error marking attendance', error });
  }
};

exports.getAttendanceByDate = async (req, res) => {
  try {
    const records = await Attendance.findAll({
      where: { date: req.params.date },
      include: [Student]
    });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching attendance', error });
  }
};
