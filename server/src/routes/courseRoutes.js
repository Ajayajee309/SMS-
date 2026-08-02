const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
  .get(courseController.getAllCourses)
  .post(authorize('Admin'), courseController.createCourse);

router.route('/:id')
  .get(courseController.getCourseById)
  .put(authorize('Admin'), courseController.updateCourse)
  .delete(authorize('Admin'), courseController.deleteCourse);

module.exports = router;
