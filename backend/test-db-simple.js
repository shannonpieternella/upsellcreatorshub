const mongoose = require('mongoose');
require('dotenv').config();

const uri = process.env.MONGODB_URI;

console.log('Testing connection to MongoDB Atlas...');
console.log('URI:', uri?.substring(0, 30) + '...');

mongoose.connect(uri, {
  serverSelectionTimeoutMS: 5000
})
.then(() => {
  console.log('✅ Connected successfully to MongoDB Atlas!');
  console.log('Database:', mongoose.connection.name);
  process.exit(0);
})
.catch((err) => {
  console.error('❌ Connection failed:', err.message);
  if (err.message.includes('ENOTFOUND')) {
    console.log('-> DNS resolution failed. Check your internet connection.');
  } else if (err.message.includes('authentication')) {
    console.log('-> Authentication failed. Check username/password.');
  } else if (err.message.includes('whitelist')) {
    console.log('-> IP whitelist issue. But 0.0.0.0/0 is already set.');
  }
  process.exit(1);
});