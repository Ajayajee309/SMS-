const express = require('express');
const router = express.Router();
const noticeController = require('../controllers/noticeController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
  .get(noticeController.getAllNotices)
  .post(authorize('Admin'), noticeController.createNotice);

router.route('/:id')
  .delete(authorize('Admin'), noticeController.deleteNotice);

module.exports = router;
