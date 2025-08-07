const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI;

async function run() {
  const client = new MongoClient(uri);
  
  try {
    console.log('Attempting to connect...');
    await client.connect();
    console.log('✅ Connected successfully!');
    
    const database = client.db('upsellcreatorshub');
    const collections = await database.listCollections().toArray();
    console.log('Database: upsellcreatorshub');
    console.log('Collections:', collections.map(c => c.name));
    
  } catch (err) {
    console.error('Connection error:', err);
    console.log('\nPossible issues:');
    console.log('1. Check if cluster is paused in Atlas');
    console.log('2. Verify username/password are correct');
    console.log('3. Ensure cluster name "sentinel" is correct');
    console.log('4. Try clicking "CONNECT" in Atlas to get fresh connection string');
  } finally {
    await client.close();
  }
}

run();