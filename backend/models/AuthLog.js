const mongoose = require('mongoose');

const authLogSchema = new mongoose.Schema({
  voter_id: { type: String, required: true },
  action: { type: String, required: true },
  success: { type: Boolean, required: true },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AuthLog', authLogSchema);
