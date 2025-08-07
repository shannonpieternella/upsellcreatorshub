# Quick Deploy to Your Hetzner Server (116.203.217.151)

## 1. First Time Setup

Run this command to deploy to your server:

```bash
./deployment/deploy-to-existing-server.sh
```

## 2. Configure MongoDB on Server

SSH into your server and edit the .env file:

```bash
ssh root@116.203.217.151
cd /var/www/upsellcreatorshub/backend
nano .env
```

Add your MongoDB connection string:
```env
MONGODB_URI=mongodb+srv://shannonpieternella:JeMoeder2005!@socialhub.0e9lg.mongodb.net/upsellcreatorshub?retryWrites=true&w=majority&appName=socialhub
```

Then restart the app:
```bash
pm2 restart upsellcreatorshub
pm2 logs upsellcreatorshub
```

## 3. Setup DNS

Add an A record in your DNS provider:
- Name: `upsellcreatorshub`
- Type: `A`
- Value: `116.203.217.151`

## 4. Test Your App

1. **Direct IP**: http://116.203.217.151
2. **After DNS**: http://upsellcreatorshub.upsellbusinessagency.com

## 5. Setup SSL (After DNS Works)

```bash
ssh root@116.203.217.151
apt install -y certbot python3-certbot-nginx
certbot --nginx -d upsellcreatorshub.upsellbusinessagency.com
```

## 6. Update Facebook App

In Facebook Developer Dashboard, update URLs to:
- OAuth Redirect: `https://upsellcreatorshub.upsellbusinessagency.com/api/auth/facebook/callback`
- Privacy Policy: `https://upsellcreatorshub.upsellbusinessagency.com/privacy-policy.html`
- Terms: `https://upsellcreatorshub.upsellbusinessagency.com/terms-of-service.html`

## Quick Commands

Check app status:
```bash
ssh root@116.203.217.151 "pm2 status"
```

View logs:
```bash
ssh root@116.203.217.151 "pm2 logs upsellcreatorshub --lines 50"
```

Restart app:
```bash
ssh root@116.203.217.151 "pm2 restart upsellcreatorshub"
```

Update app (after git push):
```bash
./deployment/deploy-to-existing-server.sh
```