const express = require('express');
const router = express.Router();
const timetableController = require('../controllers/timetableController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
  .get(timetableController.getTimetable)
  .post(timetableController.createTimetable);

router.route('/:id')
  .delete(timetableController.deleteTimetable);

module.exports = router;
