const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.post(authorize('Admin'), '/', attendanceController.markAttendance);
router.get('/:date', attendanceController.getAttendanceByDate);

module.exports = router;
