const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Test endpoints
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    
    // For now, just return mock data
    res.json({
      success: true,
      message: 'Registration successful',
      data: {
        user: {
          id: '123',
          email,
          firstName,
          lastName,
          plan: 'free',
        },
        token: 'mock-jwt-token',
        refreshToken: 'mock-refresh-token',
      },
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email } = req.body;
    
    res.json({
      success: true,
      data: {
        user: {
          id: '123',
          email,
          firstName: 'Test',
          lastName: 'User',
          plan: 'free',
          isEmailVerified: true,
        },
        token: 'mock-jwt-token',
        refreshToken: 'mock-refresh-token',
      },
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    console.log('📍 Database: upsellcreatorshub');
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📱 API available at http://localhost:${PORT}/api`);
      console.log(`✨ MongoDB connected successfully`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    
    // Start server anyway with mock data
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT} (without MongoDB)`);
      console.log(`📱 API available at http://localhost:${PORT}/api`);
      console.log(`⚠️  Using mock data - MongoDB not connected`);
    });
  });