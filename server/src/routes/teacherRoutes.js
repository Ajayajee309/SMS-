const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
  .get(teacherController.getAllTeachers)
  .post(teacherController.createTeacher);

router.route('/:id')
  .get(teacherController.getTeacherById)
  .put(teacherController.updateTeacher)
  .delete(teacherController.deleteTeacher);

module.exports = router;
