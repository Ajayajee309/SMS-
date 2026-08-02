const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
  .get(teacherController.getAllTeachers)
  .post(authorize('Admin'), teacherController.createTeacher);

router.route('/:id')
  .get(teacherController.getTeacherById)
  .put(authorize('Admin'), teacherController.updateTeacher)
  .delete(authorize('Admin'), teacherController.deleteTeacher);

module.exports = router;
