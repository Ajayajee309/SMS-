const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/', attendanceController.markAttendance);
router.get('/:date', attendanceController.getAttendanceByDate);

module.exports = router;
