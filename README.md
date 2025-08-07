# UpsellCreatorsHub

A comprehensive social media management platform for Instagram, with TikTok and Pinterest coming soon.

## Features

- 📱 **Instagram Integration**: Connect and manage Instagram Business accounts
- 📅 **Content Scheduling**: Plan and schedule posts in advance
- 📊 **Analytics Dashboard**: Track engagement and performance metrics
- 🗓️ **Content Calendar**: Visual overview of scheduled content
- 🔐 **Secure Authentication**: JWT-based auth with MongoDB

## Tech Stack

### Frontend
- React with TypeScript
- Tailwind CSS for styling
- Framer Motion for animations
- React Router for navigation

### Backend
- Node.js with Express
- MongoDB with Mongoose
- Instagram Basic Display API
- JWT authentication

## Installation

### Prerequisites
- Node.js 16+
- MongoDB Atlas account
- Facebook Developer account with Instagram Basic Display API access

### Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/upsellcreatorshub.git
cd upsellcreatorshub
```

2. Install dependencies:
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

3. Configure environment variables:
```bash
# Backend (.env)
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
INSTAGRAM_CLIENT_ID=your_instagram_client_id
INSTAGRAM_CLIENT_SECRET=your_instagram_client_secret
REDIRECT_URI=https://upsellcreatorshub.upsellbusinessagency.com/api/auth/facebook/callback
```

4. Start development servers:
```bash
# Backend
cd backend
npm start

# Frontend (new terminal)
cd frontend
npm start
```

## Deployment

### Hetzner Cloud Server

1. SSH into your server
2. Install Node.js and MongoDB
3. Clone the repository
4. Set up PM2 for process management
5. Configure Nginx as reverse proxy
6. Set up SSL with Let's Encrypt

See `deployment/hetzner-setup.sh` for automated setup.

## API Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/facebook/callback` - Instagram OAuth callback
- `GET /api/instagram/posts` - Fetch Instagram posts
- `POST /api/posts` - Create/schedule posts
- `GET /api/posts` - Get all posts
- `GET /api/analytics/instagram` - Get Instagram analytics

## License

MIT

## Support

For support, email support@upsellbusinessagency.com