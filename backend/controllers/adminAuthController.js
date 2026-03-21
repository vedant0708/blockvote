const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const AdminUser = require('../models/AdminUser');
const AuthLog = require('../models/AuthLog');

// POST /api/admin/login
exports.adminLogin = async (req, res) => {
  const { email, password } = req.body;
  console.log('--- ADMIN LOGIN ATTEMPT ---');
  console.log('Email received:', `"${email}"`);
  console.log('Password received:', `"${password}"`);
  
  try {
    const admin = await AdminUser.findOne({ email: email.trim() });
    if (!admin) {
      console.log('Admin user NOT FOUND in DB for email:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log('Admin found in DB. Full Name:', admin.full_name);
    
    const isMatch = await bcrypt.compare(password, admin.password_hash);
    console.log('Password comparison result:', isMatch);

    if (!isMatch) {
      console.log('Password mismatch for:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log('Login successful for:', email);
    const token = jwt.sign(
      { id: admin._id, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      token,
      admin: {
        id: admin._id,
        full_name: admin.full_name,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error during admin login' });
  }
};
