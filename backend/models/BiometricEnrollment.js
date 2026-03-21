const mongoose = require('mongoose');

const biometricEnrollmentSchema = new mongoose.Schema({
  voter_id: { type: String, required: true, unique: true },
  biometric_hash: { type: String, required: true },
  modality: { type: String, default: 'face' },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('BiometricEnrollment', biometricEnrollmentSchema);
