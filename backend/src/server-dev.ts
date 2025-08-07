import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));

app.use(compression());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(morgan('combined'));

const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  message: 'Too many requests from this IP, please try again later.',
});

app.use('/api/', limiter);

// Mock endpoints for testing without database
app.post('/api/auth/register', (req, res) => {
  const { email, firstName, lastName } = req.body;
  res.json({
    success: true,
    message: 'Registration successful (mock mode)',
    data: {
      user: {
        id: '123456',
        email,
        firstName,
        lastName,
        plan: 'free',
      },
      token: 'mock-jwt-token',
      refreshToken: 'mock-refresh-token',
    },
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email } = req.body;
  res.json({
    success: true,
    data: {
      user: {
        id: '123456',
        email,
        firstName: 'Test',
        lastName: 'User',
        plan: 'free',
        isEmailVerified: true,
      },
      token: 'mock-jwt-token',
      refreshToken: 'mock-refresh-token',
    },
  });
});

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'healthy',
    mode: 'development-no-db',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Start server without MongoDB
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} (Development Mode - No DB)`);
  console.log(`📍 API available at http://localhost:${PORT}/api`);
  console.log(`⚠️  MongoDB connection skipped - using mock data`);
  console.log(`\n💡 To fix MongoDB connection:`);
  console.log(`   1. Check if you're on a VPN (disconnect if yes)`);
  console.log(`   2. Try a different WiFi network`);
  console.log(`   3. Check firewall settings`);
  console.log(`   4. Verify the cluster is active in MongoDB Atlas`);
});

export default app;