const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
  .get(courseController.getAllCourses)
  .post(courseController.createCourse);

router.route('/:id')
  .get(courseController.getCourseById)
  .put(courseController.updateCourse)
  .delete(courseController.deleteCourse);

module.exports = router;
