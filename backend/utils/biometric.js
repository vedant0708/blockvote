const crypto = require('crypto');

/**
 * Hashes biometric data (face capture) using SHA-256.
 * In a real scenario, this would use more complex biometric processing libraries.
 */
const hashBiometric = (biometricData) => {
  // biometricData should be a base64 string or image buffer
  return crypto.createHash('sha256').update(biometricData).digest('hex');
};

module.exports = { hashBiometric };
