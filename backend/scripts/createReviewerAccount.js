const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// User model
const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true },
  password: String,
  plan: { type: String, default: 'free' },
  isReviewer: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

async function createReviewerAccount() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if reviewer account already exists
    const existingReviewer = await User.findOne({ email: 'reviewer@test.com' });
    if (existingReviewer) {
      console.log('Reviewer account already exists');
      return;
    }

    // Create reviewer account
    const hashedPassword = await bcrypt.hash('TestReview2025!', 10);
    const reviewer = new User({
      firstName: 'Test',
      lastName: 'Reviewer',
      email: 'reviewer@test.com',
      password: hashedPassword,
      plan: 'professional', // Give them professional plan for testing
      isReviewer: true
    });

    await reviewer.save();
    console.log('✅ Reviewer account created successfully!');
    console.log('Email: reviewer@test.com');
    console.log('Password: TestReview2025!');
    console.log('Plan: Professional (for testing all features)');
    
  } catch (error) {
    console.error('Error creating reviewer account:', error);
  } finally {
    await mongoose.disconnect();
  }
}

createReviewerAccount();