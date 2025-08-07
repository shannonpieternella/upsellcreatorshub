require('dotenv').config();

// Use the exact connection string
const uri = 'mongodb+srv://tradingviewsentinel:QrkpjJvX0PBnX0j2@sentinel.6czw8.mongodb.net/socialhub?retryWrites=true&w=majority&appName=SENTINEL';

console.log('Testing with exact URI...');

const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ Connected to MongoDB successfully!');
  console.log('Database:', mongoose.connection.name);
  mongoose.connection.close();
})
.catch(err => {
  console.error('❌ Error:', err.message);
  
  // Try with MongoClient as well
  const { MongoClient } = require('mongodb');
  console.log('\nTrying with MongoClient...');
  
  const client = new MongoClient(uri);
  client.connect()
    .then(() => {
      console.log('✅ MongoClient connected!');
      client.close();
    })
    .catch(err2 => {
      console.error('❌ MongoClient also failed:', err2.message);
      console.log('\nThis might be a network/firewall issue on your machine.');
      console.log('Try: 1) Restart your computer');
      console.log('     2) Check if VPN is blocking');
      console.log('     3) Try a different network');
    });
});