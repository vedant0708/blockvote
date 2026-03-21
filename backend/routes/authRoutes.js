const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authMiddleware } = require('../middleware/auth');

router.post('/send-otp', authController.sendOtp);
router.post('/verify-otp', authController.verifyOtp);
router.post('/biometric-login', authController.biometricLogin);
router.get('/me', authMiddleware, authController.getMe);

module.exports = router;
