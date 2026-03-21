const mongoose = require('mongoose');

const electionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  candidates: [{
    name: { type: String, required: true },
    party: { type: String },
    image: { type: String }
  }],
  status: { type: String, enum: ['upcoming', 'active', 'completed'], default: 'upcoming' },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Election', electionSchema);
