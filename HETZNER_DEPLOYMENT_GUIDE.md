# Hetzner Deployment Guide for UpsellCreatorsHub

## Step 1: Create Hetzner Server

1. Login to [Hetzner Cloud Console](https://console.hetzner.cloud)
2. Create new server:
   - **Location**: Nuremberg or Helsinki (closest to you)
   - **Image**: Ubuntu 22.04
   - **Type**: CX21 (2 vCPU, 4GB RAM) - good for start
   - **SSH Key**: Add your SSH key
   - **Name**: upsellcreatorshub

## Step 2: Configure DNS

1. In your domain provider (where upsellbusinessagency.com is registered):
   - Add A record: `upsellcreatorshub.upsellbusinessagency.com` → Your Hetzner IP

## Step 3: Initial Server Setup

SSH into your server:
```bash
ssh root@YOUR_SERVER_IP
```

Run the automated setup:
```bash
# Download setup script
wget https://raw.githubusercontent.com/YOUR_USERNAME/upsellcreatorshub/main/deployment/hetzner-setup.sh
chmod +x hetzner-setup.sh
./hetzner-setup.sh
```

## Step 4: Configure Environment

Edit the environment file:
```bash
nano /var/www/upsellcreatorshub/backend/.env
```

Add your actual values:
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/upsellcreatorshub
JWT_SECRET=your-secure-jwt-secret
INSTAGRAM_CLIENT_ID=1930105284202034
INSTAGRAM_CLIENT_SECRET=your-instagram-secret
REDIRECT_URI=https://upsellcreatorshub.upsellbusinessagency.com/api/auth/facebook/callback
CLIENT_URL=https://upsellcreatorshub.upsellbusinessagency.com
```

## Step 5: Update Facebook App Settings

In Facebook Developer Dashboard:
1. Go to your app settings
2. Update OAuth Redirect URI to: `https://upsellcreatorshub.upsellbusinessagency.com/api/auth/facebook/callback`
3. Update Deauthorize Callback: `https://upsellcreatorshub.upsellbusinessagency.com/api/auth/facebook/deauthorize`
4. Update Data Deletion URL: `https://upsellcreatorshub.upsellbusinessagency.com/api/auth/facebook/data-deletion`

## Step 6: Deploy Application

```bash
cd /var/www/upsellcreatorshub/backend
pm2 restart upsellcreatorshub-backend
pm2 logs
```

## Step 7: Setup SSL Certificate

```bash
certbot --nginx -d upsellcreatorshub.upsellbusinessagency.com
```

## Manual Setup Commands (if automated script fails)

```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt install -y nodejs

# Install PM2
npm install -g pm2

# Install Nginx
apt install -y nginx

# Clone your repo
cd /var/www
git clone https://github.com/YOUR_USERNAME/upsellcreatorshub.git
cd upsellcreatorshub

# Install dependencies
cd backend
npm install
cd ../frontend
npm install
npm run build

# Start backend with PM2
cd ../backend
pm2 start server-mongo.js --name upsellcreatorshub
pm2 save
pm2 startup
```

## Nginx Configuration

Create `/etc/nginx/sites-available/upsellcreatorshub`:
```nginx
server {
    listen 80;
    server_name upsellcreatorshub.upsellbusinessagency.com;

    location / {
        root /var/www/upsellcreatorshub/frontend/build;
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site:
```bash
ln -s /etc/nginx/sites-available/upsellcreatorshub /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

## Monitoring

Check application status:
```bash
pm2 status
pm2 logs upsellcreatorshub
```

Check Nginx logs:
```bash
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

## Updating Application

For future updates, use the deploy script:
```bash
# On your local machine
cd /Users/shannonpieternella/Documents/socialhub/socialhub-app
./deployment/deploy.sh
```

Or manually on server:
```bash
cd /var/www/upsellcreatorshub
git pull
cd backend
npm install
cd ../frontend
npm install
npm run build
pm2 restart upsellcreatorshub
```

## Troubleshooting

1. **MongoDB Connection Issues**
   - Check MongoDB Atlas IP whitelist
   - Verify connection string in .env

2. **Instagram OAuth Not Working**
   - Verify redirect URI matches exactly
   - Check Instagram app is in Live mode

3. **502 Bad Gateway**
   - Check PM2: `pm2 logs`
   - Verify backend is running: `pm2 status`

4. **SSL Issues**
   - Renew certificate: `certbot renew`
   - Check Nginx config: `nginx -t`

## Security Checklist

- [ ] SSL certificate installed
- [ ] Firewall configured (ufw)
- [ ] MongoDB connection uses SSL
- [ ] Environment variables secure
- [ ] Regular security updates: `apt update && apt upgrade`

## Support

For issues, check:
- PM2 logs: `pm2 logs`
- Nginx logs: `/var/log/nginx/`
- MongoDB Atlas dashboard
- Facebook Developer Console