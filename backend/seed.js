require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const AdminUser = require('./models/AdminUser');
const VoterRegistry = require('./models/VoterRegistry');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/voteledger');
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await AdminUser.deleteMany({});
    await VoterRegistry.deleteMany({});

    // Create Admins (Correct and Typo versions for resilience)
    const adminEmails = ['admin@voteledger.com', 'admin@votledger.com'];
    const hashedPassword = await bcrypt.hash('admin@123', 10);
    
    for (const email of adminEmails) {
      await AdminUser.create({
        full_name: 'System Admin',
        email: email,
        password_hash: hashedPassword,
        role: 'admin'
      });
    }
    console.log('Admin users created');

    // Create Sample Voters
    const voters = [
      {
        voter_id: 'ADMIN-001',
        full_name: 'System Admin',
        email: 'admin@voteledger.com',
        phone: '+15550001111',
        public_key: '0x0000000000000000000000000000000000000000',
        status: 'approved',
        biometric_hash: '8686e9275149372f8548981440798e1215f5322964894676646875797826338e'
      },
      {
        voter_id: 'ADMIN-002',
        full_name: 'System Admin (Resilience)',
        email: 'admin@votledger.com',
        phone: '+15550001111',
        public_key: '0x0000000000000000000000000000000000000001',
        status: 'approved',
        biometric_hash: 'sample_hash_resilience'
      },
      {
        voter_id: 'VOTE-11111',
        full_name: 'John Doe',
        email: 'john@example.com',
        phone: '+15550001111',
        public_key: '0x1234567890abcdef1234567890abcdef12345678',
        status: 'approved',
        biometric_hash: 'sample_hash_1'
      },
      {
        voter_id: 'VOTE-22222',
        full_name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '+15550002222',
        public_key: '0xabcdef1234567890abcdef1234567890abcdef12',
        status: 'pending'
      }
    ];

    await VoterRegistry.insertMany(voters);
    console.log('Sample voters created');

    console.log('Seeding completed successfully');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
};

seedData();
