#!/bin/bash

# Hetzner Cloud Server Setup Script for UpsellCreatorsHub
# Run this on a fresh Ubuntu 22.04 server

set -e

echo "🚀 Setting up UpsellCreatorsHub on Hetzner..."

# Update system
apt update && apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt install -y nodejs

# Install PM2
npm install -g pm2

# Install Nginx
apt install -y nginx

# Install Certbot for SSL
apt install -y certbot python3-certbot-nginx

# Install Git
apt install -y git

# Create app directory
mkdir -p /var/www/upsellcreatorshub
cd /var/www/upsellcreatorshub

# Clone repository
echo "📦 Enter your GitHub repository URL:"
read REPO_URL
git clone $REPO_URL .

# Install dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install

echo "📦 Installing frontend dependencies..."
cd ../frontend
npm install
npm run build

# Setup environment variables
echo "🔐 Setting up environment variables..."
cd ../backend
cat > .env << EOF
NODE_ENV=production
PORT=5000
MONGODB_URI=YOUR_MONGODB_URI
JWT_SECRET=$(openssl rand -base64 32)
INSTAGRAM_CLIENT_ID=YOUR_INSTAGRAM_CLIENT_ID
INSTAGRAM_CLIENT_SECRET=YOUR_INSTAGRAM_CLIENT_SECRET
REDIRECT_URI=https://upsellcreatorshub.upsellbusinessagency.com/api/auth/facebook/callback
CLIENT_URL=https://upsellcreatorshub.upsellbusinessagency.com
EOF

echo "⚠️  Please edit /var/www/upsellcreatorshub/backend/.env with your actual values"

# Create PM2 ecosystem file
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'upsellcreatorshub-backend',
    script: './server-mongo.js',
    cwd: '/var/www/upsellcreatorshub/backend',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    error_file: '/var/log/pm2/upsellcreatorshub-error.log',
    out_file: '/var/log/pm2/upsellcreatorshub-out.log',
    log_file: '/var/log/pm2/upsellcreatorshub-combined.log',
    time: true
  }]
};
EOF

# Setup Nginx
cat > /etc/nginx/sites-available/upsellcreatorshub << 'EOF'
server {
    listen 80;
    server_name upsellcreatorshub.upsellbusinessagency.com;

    # Frontend
    location / {
        root /var/www/upsellcreatorshub/frontend/build;
        try_files $uri $uri/ /index.html;
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
    }
}
EOF

# Enable site
ln -s /etc/nginx/sites-available/upsellcreatorshub /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx

# Setup SSL
echo "🔒 Setting up SSL certificate..."
echo "Make sure your domain points to this server's IP address first!"
echo "Press Enter when ready..."
read
certbot --nginx -d upsellcreatorshub.upsellbusinessagency.com

# Start application with PM2
cd /var/www/upsellcreatorshub/backend
pm2 start ecosystem.config.js
pm2 save
pm2 startup

# Setup firewall
ufw allow 22
ufw allow 80
ufw allow 443
ufw --force enable

echo "✅ Setup complete!"
echo ""
echo "📝 Next steps:"
echo "1. Edit /var/www/upsellcreatorshub/backend/.env with your MongoDB and Instagram credentials"
echo "2. Restart the app: pm2 restart upsellcreatorshub-backend"
echo "3. Check logs: pm2 logs upsellcreatorshub-backend"
echo ""
echo "🌐 Your app will be available at: https://upsellcreatorshub.upsellbusinessagency.com"