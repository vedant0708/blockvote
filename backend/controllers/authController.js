const jwt = require('jsonwebtoken');
const VoterRegistry = require('../models/VoterRegistry');
const BiometricEnrollment = require('../models/BiometricEnrollment');
const AuthLog = require('../models/AuthLog');
const { hashBiometric } = require('../utils/biometric');
const { generateOTP, sendOTP } = require('../utils/otp');

// POST /api/auth/send-otp
exports.sendOtp = async (req, res) => {
  const { voter_id, email, phone } = req.body;
  try {
    const voter = await VoterRegistry.findOne({ $or: [{ voter_id }, { email }, { phone }] });
    if (!voter) return res.status(404).json({ message: 'Voter not found' });

    const { otp, expiry } = generateOTP();
    voter.otp = otp;
    voter.otpExpiry = expiry;
    await voter.save();

    // Send the OTP to both phone and email if they exist
    await sendOTP(voter.phone, otp);
    if (voter.email) await sendOTP(voter.email, otp);

    res.json({ 
      message: 'OTP sent successfully to registered email and phone.', 
      phone: voter.phone,
      email: voter.email,
      // For development only: return the OTP so the user can see it without checking terminal
      otp: process.env.NODE_ENV === 'development' ? otp : undefined
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error during OTP request' });
  }
};

// POST /api/auth/verify-otp
exports.verifyOtp = async (req, res) => {
  const { voter_id, otp } = req.body;
  try {
    const voter = await VoterRegistry.findOne({ voter_id });
    if (!voter) return res.status(404).json({ message: 'Voter not found' });

    // In a development/simulated flow, we'll log it for easy testing
    console.log(`Verifying OTP for ${voter_id}. Expected: ${voter.otp}, Received: ${otp}`);

    if (!voter.otp || voter.otp !== otp || new Date() > voter.otpExpiry) {
      await AuthLog.create({ voter_id: voter.voter_id, action: 'otp-verify', success: false });
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Clear OTP after successful verification
    voter.otp = undefined;
    voter.otpExpiry = undefined;
    await voter.save();

    await AuthLog.create({ voter_id: voter.voter_id, action: 'otp-verify', success: true });
    res.json({ message: 'OTP verified successfully', voter_id: voter.voter_id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error during OTP verification' });
  }
};

// GET /api/auth/me
exports.getMe = async (req, res) => {
  try {
    const voterId = req.user?.voter_id;
    if (!voterId) return res.status(400).json({ message: 'Invalid token payload' });

    const voter = await VoterRegistry.findOne({ voter_id: voterId }).select('-otp -otpExpiry');
    if (!voter) return res.status(404).json({ message: 'Voter not found' });

    res.json({
      voter_id: voter.voter_id,
      full_name: voter.full_name,
      email: voter.email,
      phone: voter.phone,
      public_key: voter.public_key,
      status: voter.status,
      has_voted: voter.has_voted,
      created_at: voter.created_at,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while fetching profile' });
  }
};

// POST /api/auth/biometric-login
exports.biometricLogin = async (req, res) => {
  const { voter_id, biometric_data } = req.body;
  try {
    const enrollment = await BiometricEnrollment.findOne({ voter_id });
    if (!enrollment) return res.status(404).json({ message: 'Biometric enrollment not found' });

    // 1. Parse templates
    const storedPixels = JSON.parse(enrollment.biometric_hash);
    const loginPixels = JSON.parse(biometric_data);

    if (storedPixels.length !== loginPixels.length) {
      return res.status(400).json({ message: 'Invalid biometric data format' });
    }

    // 2. Calculate Similarity (Normalized Cross-Correlation or simple difference)
    let totalDifference = 0;
    for (let i = 0; i < storedPixels.length; i++) {
      totalDifference += Math.abs(storedPixels[i] - loginPixels[i]);
    }

    const averageDifference = totalDifference / storedPixels.length;
    const similarity = 100 - (averageDifference / 255) * 100;

    console.log(`--- Biometric Match Attempt ---`);
    console.log(`Voter: ${voter_id}`);
    console.log(`Similarity Score: ${similarity.toFixed(2)}%`);

    // 3. Set threshold (85% is high for facial structure)
    const THRESHOLD = 85; 

    if (similarity < THRESHOLD) {
      await AuthLog.create({ voter_id, action: 'biometric-login', success: false });
      return res.status(401).json({ message: `Biometric verification failed (Match: ${similarity.toFixed(1)}%)` });
    }

    const voter = await VoterRegistry.findOne({ voter_id });
    if (!voter) return res.status(404).json({ message: 'Voter not found' });

    const token = jwt.sign(
      { voter_id: voter.voter_id, role: voter.voter_id.includes('ADMIN') ? 'admin' : 'voter' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    await AuthLog.create({ voter_id, action: 'biometric-login', success: true });
    res.json({ 
      token, 
      voter: { 
        voter_id: voter.voter_id, 
        full_name: voter.full_name,
        has_voted: voter.has_voted 
      } 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error during biometric login' });
  }
};
