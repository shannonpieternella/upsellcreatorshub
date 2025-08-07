const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.WEBHOOK_PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`, req.query);
  next();
});

// Instagram OAuth Callback Handler
app.get('/api/auth/facebook/callback', (req, res) => {
  console.log('Instagram OAuth callback received:', req.query);
  
  const code = req.query.code;
  const error = req.query.error;
  
  if (error) {
    console.log('❌ Instagram OAuth error:', error);
    return res.redirect('http://localhost:3000/dashboard?error=instagram_oauth_failed');
  }
  
  if (code) {
    console.log('✅ Instagram authorization code received:', code);
    
    // Here you would normally:
    // 1. Exchange the code for an access token
    // 2. Get user's Instagram Business account info
    // 3. Save the connection to your database
    
    // For now, just redirect back to dashboard with success
    return res.redirect('http://localhost:3000/dashboard?instagram_connected=true');
  }
  
  // Handle webhook verification for Meta
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];
  
  if (mode && token) {
    if (mode === 'subscribe' && token === 'socialhub_verify_2024') {
      console.log('✅ Webhook verified successfully!');
      return res.status(200).send(challenge);
    } else {
      console.log('❌ Verification token mismatch');
      return res.sendStatus(403);
    }
  }
  
  console.log('❌ Missing required parameters');
  res.sendStatus(400);
});

// Handle webhook events (POST)
app.post('/api/auth/facebook/callback', (req, res) => {
  console.log('Webhook event received:', req.body);
  
  // Facebook requires a 200 response
  res.sendStatus(200);
  
  // Process the webhook data here
  if (req.body.object === 'instagram') {
    console.log('Instagram webhook event:', req.body);
  }
});

// Instagram Business Login - Deauthorize endpoint
app.post('/api/auth/deauthorize', (req, res) => {
  console.log('Instagram deauthorize request:', req.body);
  
  // Handle user deauthorization here
  // Remove user's Instagram access tokens from database
  
  res.json({ success: true });
});

// Instagram Business Login - Data Deletion endpoint  
app.post('/api/auth/data-deletion', (req, res) => {
  console.log('Instagram data deletion request:', req.body);
  
  // Handle data deletion request here
  // Delete user's data from database
  
  res.json({ 
    url: `https://c27061647981.ngrok-free.app/data-deletion-status/${req.body.user_id}`,
    confirmation_code: Date.now().toString()
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', webhook: 'ready' });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'UpsellCreatorsHub Webhook Server',
    endpoints: {
      webhook: '/api/auth/facebook/callback',
      health: '/api/health'
    }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Webhook server running on port ${PORT}`);
  console.log(`📍 Webhook endpoint: http://localhost:${PORT}/api/auth/facebook/callback`);
  console.log(`🔑 Verify token: socialhub_verify_2024`);
  console.log(`\n✅ Ready to receive Meta/Instagram webhooks!`);
});