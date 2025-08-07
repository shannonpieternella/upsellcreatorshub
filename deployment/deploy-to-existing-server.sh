#!/bin/bash

# Deploy to existing Hetzner server
SERVER_IP="116.203.217.151"
SERVER_USER="root"
APP_NAME="upsellcreatorshub"

echo "🚀 Deploying UpsellCreatorsHub to your Hetzner server..."

# First, let's prepare the deployment package locally
echo "📦 Building frontend..."
cd frontend
npm run build
cd ..

# Create deployment archive without node_modules
echo "📦 Creating deployment package..."
tar -czf deploy.tar.gz \
  --exclude=node_modules \
  --exclude=.git \
  --exclude=.env \
  --exclude=.env.local \
  --exclude=.env.development \
  --exclude=.env.production \
  --exclude=*.log \
  --exclude=.DS_Store \
  .

echo "📤 Uploading to server ${SERVER_IP}..."
scp deploy.tar.gz ${SERVER_USER}@${SERVER_IP}:/tmp/

echo "🔧 Setting up on server..."
ssh ${SERVER_USER}@${SERVER_IP} << 'ENDSSH'
set -e

echo "📦 Installing dependencies if needed..."
# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    apt install -y nodejs
fi

# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    echo "Installing PM2..."
    npm install -g pm2
fi

# Check if Nginx is installed
if ! command -v nginx &> /dev/null; then
    echo "Installing Nginx..."
    apt install -y nginx
fi

# Create app directory
echo "📁 Creating app directory..."
mkdir -p /var/www/upsellcreatorshub
cd /var/www/upsellcreatorshub

# Extract files
echo "📦 Extracting files..."
tar -xzf /tmp/deploy.tar.gz
rm /tmp/deploy.tar.gz

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install --production

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "⚠️  Creating .env file - PLEASE EDIT WITH YOUR VALUES!"
    cat > .env << 'EOF'
NODE_ENV=production
PORT=5000
MONGODB_URI=YOUR_MONGODB_URI_HERE
JWT_SECRET=your-secret-jwt-key-here
INSTAGRAM_CLIENT_ID=1930105284202034
INSTAGRAM_CLIENT_SECRET=YOUR_INSTAGRAM_SECRET
REDIRECT_URI=https://upsellcreatorshub.upsellbusinessagency.com/api/auth/facebook/callback
CLIENT_URL=https://upsellcreatorshub.upsellbusinessagency.com
EOF
fi

# Setup PM2
echo "🔧 Setting up PM2..."
pm2 delete upsellcreatorshub 2>/dev/null || true
pm2 start server-mongo.js --name upsellcreatorshub
pm2 save
pm2 startup systemd -u root --hp /root || true

# Setup Nginx
echo "🔧 Configuring Nginx..."
cat > /etc/nginx/sites-available/upsellcreatorshub << 'EOF'
server {
    listen 80;
    server_name upsellcreatorshub.upsellbusinessagency.com 116.203.217.151;

    # Frontend
    location / {
        root /var/www/upsellcreatorshub/frontend/build;
        try_files $uri $uri/ /index.html;
        
        # Security headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Increase timeout for long operations
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
EOF

# Enable site
ln -sf /etc/nginx/sites-available/upsellcreatorshub /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx

echo "✅ Deployment complete!"
echo ""
echo "📝 IMPORTANT NEXT STEPS:"
echo "1. Edit /var/www/upsellcreatorshub/backend/.env with your MongoDB credentials"
echo "2. Restart the app: pm2 restart upsellcreatorshub"
echo "3. Check logs: pm2 logs upsellcreatorshub"
echo "4. Your app is available at: http://116.203.217.151"
echo "5. After DNS setup: https://upsellcreatorshub.upsellbusinessagency.com"
ENDSSH

# Clean up local file
rm deploy.tar.gz

echo "✅ Deployment script finished!"
echo "🌐 Your app should be available at: http://116.203.217.151"
echo ""
echo "⚠️  Don't forget to:"
echo "1. Set up DNS A record: upsellcreatorshub.upsellbusinessagency.com → 116.203.217.151"
echo "2. Edit MongoDB credentials on the server"
echo "3. Set up SSL with: certbot --nginx -d upsellcreatorshub.upsellbusinessagency.com"