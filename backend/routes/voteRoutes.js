const express = require('express');
const router = express.Router();
const voteController = require('../controllers/voteController');
const { authMiddleware } = require('../middleware/auth');

router.get('/elections', voteController.getElections);
router.post('/', authMiddleware, voteController.castVote);
router.get('/results/:election_id', voteController.getResults);
router.get('/verify/:transaction_id', voteController.verifyReceipt);

module.exports = router;
