const express = require('express');
const router = express.Router();
const timetableController = require('../controllers/timetableController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
  .get(timetableController.getTimetable)
  .post(authorize('Admin'), timetableController.createTimetable);

router.route('/:id')
  .delete(authorize('Admin'), timetableController.deleteTimetable);

module.exports = router;
