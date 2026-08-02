const express = require('express');
const router = express.Router();
const feeController = require('../controllers/feeController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
  .get(feeController.getAllFees)
  .post(feeController.createFee);

router.route('/:id')
  .put(feeController.updateFeeStatus)
  .delete(feeController.deleteFee);

module.exports = router;
