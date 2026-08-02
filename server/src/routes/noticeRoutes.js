const express = require('express');
const router = express.Router();
const noticeController = require('../controllers/noticeController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
  .get(noticeController.getAllNotices)
  .post(noticeController.createNotice);

router.route('/:id')
  .delete(noticeController.deleteNotice);

module.exports = router;
