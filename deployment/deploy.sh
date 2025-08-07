#!/bin/bash

# Quick deployment script for updates
# Run this locally to deploy changes to your Hetzner server

SERVER_IP="YOUR_SERVER_IP"
SERVER_USER="root"

echo "🚀 Deploying UpsellCreatorsHub to Hetzner..."

# Build frontend locally
echo "📦 Building frontend..."
cd frontend
npm run build
cd ..

# Create deployment archive
echo "📦 Creating deployment package..."
tar -czf deploy.tar.gz \
  --exclude=node_modules \
  --exclude=.git \
  --exclude=.env \
  --exclude=*.log \
  backend frontend/build

# Upload to server
echo "📤 Uploading to server..."
scp deploy.tar.gz $SERVER_USER@$SERVER_IP:/tmp/

# Deploy on server
echo "🔧 Deploying on server..."
ssh $SERVER_USER@$SERVER_IP << 'EOF'
  cd /var/www/upsellcreatorshub
  tar -xzf /tmp/deploy.tar.gz
  cd backend
  npm install --production
  pm2 restart upsellcreatorshub-backend
  rm /tmp/deploy.tar.gz
  echo "✅ Deployment complete!"
EOF

# Cleanup
rm deploy.tar.gz

echo "✅ Deployment finished!"
echo "🌐 Check your app at: https://upsellcreatorshub.upsellbusinessagency.com"