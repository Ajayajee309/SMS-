const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
  .get(studentController.getAllStudents)
  .post(authorize('Admin'), studentController.createStudent);

router.route('/:id')
  .get(studentController.getStudentById)
  .put(authorize('Admin'), studentController.updateStudent)
  .delete(authorize('Admin'), studentController.deleteStudent);

module.exports = router;
