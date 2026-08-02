const { Timetable, Course, Teacher } = require('../models');

exports.getTimetable = async (req, res) => {
  try {
    const timetable = await Timetable.findAll({
      include: [Course, Teacher],
      order: [['dayOfWeek', 'ASC'], ['startTime', 'ASC']]
    });
    res.json(timetable);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching timetable', error });
  }
};

exports.createTimetable = async (req, res) => {
  try {
    const timetable = await Timetable.create(req.body);
    res.status(201).json(timetable);
  } catch (error) {
    res.status(400).json({ message: 'Error creating timetable', error });
  }
};

exports.deleteTimetable = async (req, res) => {
  try {
    const timetable = await Timetable.findByPk(req.params.id);
    if (!timetable) return res.status(404).json({ message: 'Timetable not found' });
    await timetable.destroy();
    res.json({ message: 'Timetable deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting timetable', error });
  }
};
