require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const voteRoutes = require('./routes/voteRoutes');
const Vote = require('./models/Vote');
const VoterRegistry = require('./models/VoterRegistry');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/vote', voteRoutes);

// Catch-all for undefined routes
app.use((req, res) => {
  console.log(`404 - Not Found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ 
    message: `Route not found: ${req.method} ${req.originalUrl}`,
    available_paths: ['/api/auth', '/api/admin', '/api/vote']
  });
});

// Database connection
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI, {
  serverApi: {
    version: '1',
    strict: true,
    deprecationErrors: true,
  }
})
  .then(() => {
    console.log('Connected to MongoDB Atlas');
    console.log('JWT_SECRET Status:', process.env.JWT_SECRET ? 'Defined' : 'UNDEFINED');
    Promise.allSettled([Vote.syncIndexes(), VoterRegistry.syncIndexes()])
      .then((results) => {
        const failed = results.filter(r => r.status === 'rejected');
        if (failed.length > 0) {
          console.error('Index sync errors:', failed.map(f => f.reason?.message || String(f.reason)));
        } else {
          console.log('MongoDB indexes synced');
        }
      })
      .catch((err) => {
        console.error('Index sync failure:', err);
      });
    const PORT = 5001;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });
