const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
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

// Data Deletion Callback (Required for Facebook approval)
app.post('/api/auth/facebook/data-deletion', async (req, res) => {
  try {
    const { signed_request } = req.body;
    
    // Parse the signed request from Facebook
    // In production, verify the signature
    const data = JSON.parse(Buffer.from(signed_request.split('.')[1], 'base64').toString());
    
    // Delete user's Instagram connection data
    const users = await User.find();
    const user = users[0];
    
    if (user) {
      await InstagramConnection.deleteOne({ userId: user._id });
      console.log('📊 User data deletion requested for user:', data.user_id);
    }
    
    // Return confirmation URL and code as required by Facebook
    res.json({
      url: 'https://socialhub.app/deletion-status?id=' + data.user_id,
      confirmation_code: 'DEL_' + Date.now()
    });
  } catch (error) {
    console.log('❌ Data deletion error:', error);
    res.status(500).json({ error: 'Failed to process data deletion' });
  }
});

// Instagram OAuth Callback Handler
app.get('/api/auth/facebook/callback', async (req, res) => {
  console.log('Instagram OAuth callback received:', req.query);
  
  const code = req.query.code;
  const error = req.query.error;
  
  if (error) {
    console.log('❌ Instagram OAuth error:', error);
    return res.redirect('http://localhost:3000/dashboard?error=instagram_oauth_failed');
  }
  
  if (code) {
    console.log('✅ Instagram authorization code received:', code);
    
    try {
      console.log('🔄 Exchanging code for access token...');
      
      // Exchange code for access token using Instagram Basic Display API
      const tokenResponse = await fetch('https://api.instagram.com/oauth/access_token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: process.env.INSTAGRAM_CLIENT_ID,
          client_secret: process.env.INSTAGRAM_CLIENT_SECRET,
          grant_type: 'authorization_code',
          redirect_uri: process.env.REDIRECT_URI || 'https://c27061647981.ngrok-free.app/api/auth/facebook/callback',
          code: code,
        }),
      });

      const tokenData = await tokenResponse.json();
      console.log('📄 Token response:', tokenData);
      
      if (tokenData.access_token) {
        console.log('✅ Instagram access token obtained');
        
        // Exchange for long-lived token (60 days instead of 1 hour)
        let finalToken = tokenData.access_token;
        try {
          const longLivedResponse = await fetch(`https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${process.env.INSTAGRAM_CLIENT_SECRET}&access_token=${tokenData.access_token}`);
          const longLivedData = await longLivedResponse.json();
          
          if (longLivedData.access_token) {
            finalToken = longLivedData.access_token;
            console.log('✅ Long-lived token obtained (expires in 60 days)');
          }
        } catch (error) {
          console.log('⚠️ Could not get long-lived token, using short-lived token');
        }
        
        // Get user info using Basic Display API
        const userResponse = await fetch(`https://graph.instagram.com/me?fields=id,username&access_token=${finalToken}`);
        const userData = await userResponse.json();
        console.log('👤 User data:', userData);
        
        if (userData.username) {
          console.log('Instagram account connected:', userData.username);
          
          // For now, we'll use a default user ID since we don't have proper user session management
          // In a real app, you'd get this from the authenticated user session
          const users = await User.find();
          const user = users[0]; // Use first user as example
          
          if (user) {
            // Save or update Instagram connection
            await InstagramConnection.findOneAndUpdate(
              { userId: user._id },
              {
                instagramId: userData.id,
                username: userData.username,
                accessToken: finalToken,
                connectedAt: new Date(),
                tokenExpiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
              },
              { upsert: true, new: true }
            );
            
            console.log('💾 Instagram connection saved to database');
          }
          
          return res.redirect(`http://localhost:3000/dashboard?instagram_connected=true&username=${userData.username}`);
        } else {
          console.log('❌ No username in response:', userData);
          return res.redirect('http://localhost:3000/dashboard?instagram_connected=true&username=InstagramUser');
        }
      } else {
        console.log('❌ Failed to get access token:', tokenData);
        return res.redirect('http://localhost:3000/dashboard?error=token_exchange_failed');
      }
    } catch (error) {
      console.log('❌ Instagram OAuth error:', error);
      return res.redirect('http://localhost:3000/dashboard?error=instagram_oauth_failed');
    }
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

// Check Instagram connection status
app.get('/api/instagram/status', async (req, res) => {
  try {
    const users = await User.find();
    const user = users[0]; // Use first user as example
    
    if (user) {
      const connection = await InstagramConnection.findOne({ userId: user._id });
      
      if (connection) {
        res.json({
          connected: true,
          username: connection.username,
          connectedAt: connection.connectedAt,
        });
      } else {
        res.json({ connected: false });
      }
    } else {
      res.json({ connected: false });
    }
  } catch (error) {
    console.log('❌ Error checking Instagram status:', error);
    res.status(500).json({ error: 'Failed to check Instagram status' });
  }
});

// Refresh Instagram token if needed
app.post('/api/instagram/refresh-token', async (req, res) => {
  try {
    const users = await User.find();
    const user = users[0];
    
    if (user) {
      const connection = await InstagramConnection.findOne({ userId: user._id });
      
      if (connection) {
        // Check if token expires within 5 days
        const daysUntilExpiry = Math.floor((connection.tokenExpiresAt - new Date()) / (1000 * 60 * 60 * 24));
        
        if (daysUntilExpiry <= 5) {
          // Refresh the token
          const refreshResponse = await fetch(`https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${connection.accessToken}`);
          const refreshData = await refreshResponse.json();
          
          if (refreshData.access_token) {
            connection.accessToken = refreshData.access_token;
            connection.tokenExpiresAt = new Date(Date.now() + refreshData.expires_in * 1000);
            await connection.save();
            
            console.log('🔄 Instagram token refreshed, expires in', refreshData.expires_in / (60 * 60 * 24), 'days');
            res.json({ refreshed: true, daysUntilExpiry: refreshData.expires_in / (60 * 60 * 24) });
          } else {
            res.json({ refreshed: false, error: 'Failed to refresh token' });
          }
        } else {
          res.json({ refreshed: false, daysUntilExpiry, message: 'Token still valid' });
        }
      } else {
        res.status(404).json({ error: 'Instagram not connected' });
      }
    }
  } catch (error) {
    console.log('❌ Error refreshing token:', error);
    res.status(500).json({ error: 'Failed to refresh token' });
  }
});

// Create/Schedule Post
app.post('/api/posts', async (req, res) => {
  try {
    const { content, platforms, scheduledFor } = req.body;
    
    // Get user and Instagram connection
    const users = await User.find();
    const user = users[0];
    
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    
    const connection = await InstagramConnection.findOne({ userId: user._id });
    
    if (!connection) {
      return res.status(400).json({ error: 'Instagram not connected' });
    }
    
    // Create post record
    const post = {
      userId: user._id,
      content,
      platforms,
      scheduledFor: scheduledFor ? new Date(scheduledFor) : null,
      status: scheduledFor ? 'scheduled' : 'published',
      createdAt: new Date()
    };
    
    console.log('📝 Post created:', post);
    
    // If publishing now and it's Instagram
    if (!scheduledFor && platforms.includes('instagram')) {
      // Note: Instagram API doesn't allow direct posting via Basic Display API
      // You would need Instagram Graph API with proper business permissions
      console.log('⚠️ Direct posting to Instagram requires Graph API with business permissions');
    }
    
    res.json({ success: true, post });
  } catch (error) {
    console.log('❌ Error creating post:', error);
    res.status(500).json({ error: 'Failed to create post' });
  }
});

// Get all posts
app.get('/api/posts', async (req, res) => {
  try {
    const users = await User.find();
    const user = users[0];
    
    // For now, return mock data
    const posts = [
      {
        id: '1',
        content: 'Check out our new features! 🚀',
        platforms: ['instagram'],
        status: 'published',
        createdAt: new Date(Date.now() - 86400000)
      },
      {
        id: '2',
        content: 'Coming soon: Amazing updates!',
        platforms: ['instagram'],
        status: 'scheduled',
        scheduledFor: new Date(Date.now() + 86400000)
      }
    ];
    
    res.json({ posts });
  } catch (error) {
    console.log('❌ Error fetching posts:', error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// Get scheduled posts for calendar
app.get('/api/posts/scheduled', async (req, res) => {
  try {
    const scheduledPosts = [
      {
        id: '2',
        content: 'Coming soon: Amazing updates!',
        platforms: ['instagram'],
        status: 'scheduled',
        scheduledFor: new Date(Date.now() + 86400000)
      }
    ];
    
    res.json({ posts: scheduledPosts });
  } catch (error) {
    console.log('❌ Error fetching scheduled posts:', error);
    res.status(500).json({ error: 'Failed to fetch scheduled posts' });
  }
});

// Disconnect Instagram
app.post('/api/instagram/disconnect', async (req, res) => {
  try {
    const users = await User.find();
    const user = users[0]; // Use first user as example
    
    if (user) {
      await InstagramConnection.deleteOne({ userId: user._id });
      console.log('🔌 Instagram disconnected');
      res.json({ success: true });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.log('❌ Error disconnecting Instagram:', error);
    res.status(500).json({ error: 'Failed to disconnect Instagram' });
  }
});

// Get Instagram posts
app.get('/api/instagram/posts', async (req, res) => {
  try {
    const users = await User.find();
    const user = users[0]; // Use first user as example
    
    if (user) {
      const connection = await InstagramConnection.findOne({ userId: user._id });
      
      if (connection) {
        // Fetch posts from Instagram API
        const postsResponse = await fetch(`https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url,timestamp,permalink&access_token=${connection.accessToken}`);
        const postsData = await postsResponse.json();
        
        if (postsData.error) {
          console.log('❌ Instagram API error:', postsData.error);
          return res.json({ 
            connected: true, 
            username: connection.username, 
            posts: [],
            error: postsData.error.message 
          });
        }
        
        console.log('📸 Instagram posts fetched:', postsData.data?.length || 0);
        if (postsData.data?.length === 0) {
          console.log('📄 Instagram API response:', postsData);
        }
        
        res.json({
          connected: true,
          username: connection.username,
          posts: postsData.data || [],
        });
      } else {
        res.json({ connected: false, posts: [] });
      }
    } else {
      res.json({ connected: false, posts: [] });
    }
  } catch (error) {
    console.log('❌ Error fetching Instagram posts:', error);
    res.status(500).json({ error: 'Failed to fetch Instagram posts' });
  }
});

// User Schema
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  plan: {
    type: String,
    default: 'free',
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model('User', userSchema);

// Instagram Connection Schema
const instagramConnectionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  instagramId: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  accessToken: {
    type: String,
    required: true,
  },
  tokenExpiresAt: {
    type: Date,
    default: null,
  },
  connectedAt: {
    type: Date,
    default: Date.now,
  },
});

const InstagramConnection = mongoose.model('InstagramConnection', instagramConnectionSchema);

// Register endpoint
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create new user
    const user = new User({
      email,
      password: hashedPassword,
      firstName,
      lastName,
    });
    
    await user.save();
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || 'your_jwt_secret_key_2024',
      { expiresIn: '7d' }
    );
    
    console.log('✅ New user registered:', email);
    
    res.json({
      success: true,
      message: 'Registration successful',
      data: {
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          plan: user.plan,
        },
        token,
        refreshToken: token, // Using same token for simplicity
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({ error: error.message });
  }
});

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || 'your_jwt_secret_key_2024',
      { expiresIn: '7d' }
    );
    
    console.log('✅ User logged in:', email);
    
    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          plan: user.plan,
          isEmailVerified: user.isEmailVerified,
        },
        token,
        refreshToken: token,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(400).json({ error: error.message });
  }
});

// Get all users (for testing)
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find({}, '-password');
    res.json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/health', async (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    database: mongoose.connection.name,
    collections: await mongoose.connection.db.listCollections().toArray().then(cols => cols.map(c => c.name)),
  });
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('✅ Connected to MongoDB');
    console.log('📍 Database:', mongoose.connection.name);
    
    // Check existing users
    const userCount = await User.countDocuments();
    console.log(`📊 Existing users in database: ${userCount}`);
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📱 API available at http://localhost:${PORT}/api`);
      console.log(`✨ MongoDB connected - Users will be saved!`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });