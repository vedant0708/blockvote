const crypto = require('crypto');

/**
 * Generates a 6-digit OTP and its expiry (5 minutes).
 */
const generateOTP = () => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiry = new Date(Date.now() + 5 * 60 * 1000); // 5 mins
  return { otp, expiry };
};

/**
 * Simulates sending OTP via SMS/Email.
 */
const sendOTP = async (recipient, otp) => {
  // In a real scenario, this would use Firebase Auth, Twilio, or Nodemailer.
  console.log(`Sending OTP ${otp} to ${recipient}`);
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay
  return true;
};

module.exports = { generateOTP, sendOTP };
