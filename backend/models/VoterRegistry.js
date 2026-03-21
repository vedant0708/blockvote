const mongoose = require('mongoose');

const voterRegistrySchema = new mongoose.Schema({
  voter_id: { type: String, required: true, unique: true },
  full_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  biometric_hash: { type: String },
  public_key: { type: String },
  eligibility_flag: { type: Boolean, default: true },
  has_voted: { type: Boolean, default: false },
  status: { type: String, enum: ['pending', 'approved'], default: 'pending' },
  otp: { type: String },
  otpExpiry: { type: Date },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('VoterRegistry', voterRegistrySchema);
