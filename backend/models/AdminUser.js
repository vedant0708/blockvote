const mongoose = require('mongoose');

const adminUserSchema = new mongoose.Schema({
  full_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password_hash: { type: String, required: true },
  role: { type: String, enum: ['admin', 'superadmin'], default: 'admin' }
});

module.exports = mongoose.model('AdminUser', adminUserSchema);
