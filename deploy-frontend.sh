#!/bin/bash

# Deploy frontend to existing Hetzner server
SERVER_IP="116.203.217.151"
SERVER_USER="root"
APP_NAME="upsellcreatorshub"

echo "🚀 Deploying frontend build to server..."

# Check if build directory exists
if [ ! -d "frontend/build" ]; then
    echo "❌ Build directory not found. Please run 'npm run build' in frontend directory first."
    exit 1
fi

echo "📤 Uploading build files to server ${SERVER_IP}..."
# Upload the build directory to the server
ssh ${SERVER_USER}@${SERVER_IP} "mkdir -p /var/www/${APP_NAME}/frontend"
rsync -avz --delete frontend/build/ ${SERVER_USER}@${SERVER_IP}:/var/www/${APP_NAME}/frontend/build/

echo "✅ Frontend deployed successfully!"
echo "🌐 Visit https://upsellcreatorshub.upsellbusinessagency.com to see your app"