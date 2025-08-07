#!/bin/bash

# Fix MongoDB connection on server with correct URI
ssh root@116.203.217.151 << 'ENDSSH'
# Update .env with correct MongoDB URI
cat > /var/www/upsellcreatorshub/backend/.env << 'EOL'
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://tradingviewsentinel:QrkpjJvX0PBnX0j2@sentinel.6czw8.mongodb.net/upsellcreatorshub?retryWrites=true&w=majority&appName=SENTINEL
JWT_SECRET=your-very-secure-jwt-secret-key-2025
INSTAGRAM_CLIENT_ID=1930105284202034
INSTAGRAM_CLIENT_SECRET=aa969e0c088f65fff5a8b3e4b96c963a
REDIRECT_URI=https://upsellcreatorshub.upsellbusinessagency.com/api/auth/facebook/callback
CLIENT_URL=https://upsellcreatorshub.upsellbusinessagency.com
EOL

echo "✅ Updated .env with correct MongoDB URI"
echo ""

# Restart app
echo "🔄 Restarting app..."
pm2 restart upsellcreatorshub

echo "⏳ Waiting for app to connect to MongoDB..."
sleep 7

# Check status
echo ""
echo "📊 App status:"
pm2 status upsellcreatorshub

# Check logs
echo ""
echo "📝 Latest logs:"
pm2 logs upsellcreatorshub --lines 15 --nostream
ENDSSH