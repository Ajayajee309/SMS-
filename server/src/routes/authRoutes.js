const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/login', authController.login);
router.post('/google-login', authController.googleLogin);
router.post('/register', authController.register); // Typically you'd secure this route
router.post('/reset-password', authController.resetPassword);

module.exports = router;
