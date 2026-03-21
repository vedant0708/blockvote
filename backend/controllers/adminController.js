const VoterRegistry = require('../models/VoterRegistry');
const BiometricEnrollment = require('../models/BiometricEnrollment');
const AuthLog = require('../models/AuthLog');
const Election = require('../models/Election');
const { hashBiometric } = require('../utils/biometric');

// POST /api/admin/create-voter
exports.createVoter = async (req, res) => {
  const { voter_id, full_name, email, phone, public_key } = req.body;
  console.log('--- CREATE VOTER ATTEMPT ---');
  console.log('Data:', req.body);
  try {
    const existingVoter = await VoterRegistry.findOne({ $or: [{ voter_id }, { email }, { phone }] });
    if (existingVoter) {
      console.log('Conflict: Voter already exists');
      return res.status(400).json({ message: 'Voter with this ID, email, or phone already exists' });
    }

    const voter = await VoterRegistry.create({ 
      voter_id, 
      full_name, 
      email, 
      phone, 
      public_key, 
      eligibility_flag: true, 
      status: 'pending' 
    });
    console.log('Voter created successfully:', voter.voter_id);
    res.status(201).json({ message: 'Voter created successfully', voter });
  } catch (err) {
    console.error('Error creating voter:', err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation Error: ' + Object.values(err.errors).map(e => e.message).join(', ') });
    }
    res.status(500).json({ message: 'Server error while creating voter: ' + err.message });
  }
};

// --- ELECTION MANAGEMENT ---

// POST /api/admin/elections
exports.createElection = async (req, res) => {
  try {
    console.log('--- CREATE ELECTION ATTEMPT ---');
    console.log('Data:', req.body);
    const election = await Election.create(req.body);
    console.log('Election created:', election.title);
    res.status(201).json(election);
  } catch (err) {
    console.error('Error creating election:', err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation Error: ' + Object.values(err.errors).map(e => e.message).join(', ') });
    }
    res.status(500).json({ message: 'Error creating election: ' + err.message });
  }
};

// GET /api/admin/elections
exports.getElections = async (req, res) => {
  try {
    const { status } = req.query;
    const query = status ? { status } : {};
    const elections = await Election.find(query).sort({ created_at: -1 });
    res.json(elections);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching elections' });
  }
};

// PATCH /api/admin/elections/:id
exports.updateElectionStatus = async (req, res) => {
  const { status } = req.body;
  try {
    const election = await Election.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json(election);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating election' });
  }
};

// GET /api/admin/voters
exports.getVoters = async (req, res) => {
  try {
    const voters = await VoterRegistry.find({});
    res.json(voters);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while fetching voters' });
  }
};

// POST /api/admin/enroll-biometric
exports.enrollBiometric = async (req, res) => {
  const { voter_id, biometric_data } = req.body;
  try {
    const voter = await VoterRegistry.findOne({ voter_id });
    if (!voter) return res.status(404).json({ message: 'Voter not found' });

    // Store raw normalized template instead of hash for similarity matching
    await BiometricEnrollment.findOneAndUpdate(
      { voter_id },
      { biometric_hash: biometric_data, modality: 'face' },
      { upsert: true, new: true }
    );

    voter.status = 'approved';
    voter.biometric_hash = 'TEMPLATE_STORED'; // Flag for registry
    await voter.save();

    res.json({ message: 'Biometric template enrolled successfully', voter });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error during biometric enrollment' });
  }
};

// GET /api/admin/logs
exports.getLogs = async (req, res) => {
  try {
    const logs = await AuthLog.find({}).sort({ timestamp: -1 });
    res.json(logs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while fetching logs' });
  }
};
