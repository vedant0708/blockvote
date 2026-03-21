const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
  voter_id: { type: String, required: true },
  election_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Election', required: true },
  candidate: { type: String, required: true },
  vote_hash: { type: String, required: true },
  transaction_id: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

// Compound index to ensure one vote per voter per election
voteSchema.index({ voter_id: 1, election_id: 1 }, { unique: true });

module.exports = mongoose.model('Vote', voteSchema);
