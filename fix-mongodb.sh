#!/bin/bash

ssh root@116.203.217.151 << 'EOF'
cd /var/www/upsellcreatorshub/backend

# Create proper .env file
cat > .env << 'EOL'
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://shannonpieternella:JeMoeder2005!@socialhub.0e9lg.mongodb.net/upsellcreatorshub?retryWrites=true&w=majority&appName=socialhub
JWT_SECRET=your-very-secure-jwt-secret-key-2025
INSTAGRAM_CLIENT_ID=1930105284202034
INSTAGRAM_CLIENT_SECRET=aa969e0c088f65fff5a8b3e4b96c963a
REDIRECT_URI=https://upsellcreatorshub.upsellbusinessagency.com/api/auth/facebook/callback
CLIENT_URL=https://upsellcreatorshub.upsellbusinessagency.com
EOL

echo "✅ .env file created"
echo "📋 Content of .env:"
cat .env | grep MONGODB_URI

echo "🔄 Restarting app..."
pm2 restart upsellcreatorshub
sleep 3

echo "📊 Checking status..."
pm2 status upsellcreatorshub

echo "📝 Latest logs:"
pm2 logs upsellcreatorshub --lines 5 --nostream
EOF