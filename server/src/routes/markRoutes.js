const express = require('express');
const router = express.Router();
const markController = require('../controllers/markController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
  .get(markController.getAllMarks)
  .post(authorize('Admin'), markController.saveMark);

router.route('/student/:studentId')
  .get(markController.getMarksByStudent);

module.exports = router;
