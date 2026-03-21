const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const adminAuthController = require('../controllers/adminAuthController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// Admin Auth
router.post('/login', adminAuthController.adminLogin);

// Protected Admin Routes
router.post('/create-voter', authMiddleware, adminMiddleware, adminController.createVoter);
router.get('/voters', authMiddleware, adminMiddleware, adminController.getVoters);
router.post('/enroll-biometric', authMiddleware, adminMiddleware, adminController.enrollBiometric);
router.get('/logs', authMiddleware, adminMiddleware, adminController.getLogs);

// Election Routes
router.post('/elections', authMiddleware, adminMiddleware, adminController.createElection);
router.get('/elections', authMiddleware, adminMiddleware, adminController.getElections);
router.patch('/elections/:id', authMiddleware, adminMiddleware, adminController.updateElectionStatus);

module.exports = router;
