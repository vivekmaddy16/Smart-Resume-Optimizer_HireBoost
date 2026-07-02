const express = require('express');
const router = express.Router();
const controller = require('../controllers/authController');
const auth = require('../middleware/auth');

// Auth endpoints
router.post('/signup', controller.signup);
router.post('/login', controller.login);
router.post('/forgot-password', controller.forgotPassword);
router.post('/verify-otp', controller.verifyOtp);
router.post('/reset-password', controller.resetPassword);

// Protected endpoints
router.post('/update-profile', auth, controller.updateProfile);

module.exports = router;
