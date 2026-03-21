const VoterRegistry = require('../models/VoterRegistry');
const Vote = require('../models/Vote');
const Election = require('../models/Election');
const { simulateBlockchainVote } = require('../utils/blockchain');
const mongoose = require('mongoose');

// GET /api/vote/elections
exports.getElections = async (req, res) => {
  try {
    const { status } = req.query;
    const query = status ? { status } : {};
    const elections = await Election.find(query).sort({ created_at: -1 });
    res.json(elections);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching elections' });
  }
};

// POST /api/vote
exports.castVote = async (req, res) => {
  const { voter_id, candidate, election_id } = req.body;
  try {
    const voter = await VoterRegistry.findOne({ voter_id });
    if (!voter) return res.status(404).json({ message: 'Voter not found' });
    
    // Check if already voted in THIS specific election
    const existingVote = await Vote.findOne({ voter_id, election_id });
    if (existingVote) return res.status(403).json({ message: 'Voter has already cast their vote in this election' });
    
    if (!voter.eligibility_flag) return res.status(403).json({ message: 'Voter is not eligible to vote' });

    // Simulate blockchain transaction
    const { transactionId, voteHash } = await simulateBlockchainVote(voter_id, candidate);

    // Save vote to local DB
    const vote = await Vote.create({
      voter_id,
      election_id,
      candidate,
      vote_hash: voteHash,
      transaction_id: transactionId,
      timestamp: new Date()
    });

    // Mark voter as having voted (globally or per election - here we use global flag for simplicity or can be removed)
    voter.has_voted = true;
    await voter.save();

    res.status(201).json({ 
      message: 'Vote cast successfully', 
      transaction_id: transactionId,
      vote_hash: voteHash 
    });
  } catch (err) {
    console.error(err);
    if (err?.code === 11000) {
      return res.status(409).json({ message: 'Duplicate vote detected for this voter/election' });
    }
    res.status(500).json({ message: 'Server error during voting process: ' + err.message });
  }
};

// GET /api/vote/results/:election_id
exports.getResults = async (req, res) => {
  try {
    const { election_id } = req.params;
    const results = await Vote.aggregate([
      { $match: { election_id: new mongoose.Types.ObjectId(election_id) } },
      { $group: { _id: '$candidate', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while fetching results' });
  }
};

// GET /api/vote/verify/:transaction_id
exports.verifyReceipt = async (req, res) => {
  try {
    const { transaction_id } = req.params;
    const vote = await Vote.findOne({ transaction_id }).select('transaction_id vote_hash election_id timestamp');
    if (!vote) {
      return res.status(404).json({ verified: false, message: 'Receipt not found' });
    }
    res.json({
      verified: true,
      receipt: {
        transaction_id: vote.transaction_id,
        vote_hash: vote.vote_hash,
        election_id: vote.election_id,
        timestamp: vote.timestamp,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while verifying receipt' });
  }
};
