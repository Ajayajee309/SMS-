const express = require('express');
const router = express.Router();
const feeController = require('../controllers/feeController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
  .get(feeController.getAllFees)
  .post(authorize('Admin'), feeController.createFee);

router.route('/:id')
  .put(authorize('Admin'), feeController.updateFeeStatus)
  .delete(authorize('Admin'), feeController.deleteFee);

module.exports = router;
