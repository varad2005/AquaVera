import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import express, { type Express } from 'express';

export function applySecurity(app: Express): void {
  // Security headers
  app.use(helmet());

  // Global rate limiting
  const globalLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 100, // 100 requests per minute
    message: 'Too many requests, please try again later.',
    standardHeaders: true, // Return rate limit in `RateLimit-*` headers
    legacyHeaders: false, // Disable `X-RateLimit-*` headers
  });

  app.use(globalLimiter);

  // CORS configuration
  const corsWhitelist = process.env.CORS_ORIGIN?.split(',') || [];
  
  app.use((req, res, next) => {
    const origin = req.headers.origin;
    
    if (origin && corsWhitelist.includes(origin)) {
      res.header('Access-Control-Allow-Origin', origin);
      res.header('Access-Control-Allow-Credentials', 'true');
    }
    
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    
    if (req.method === 'OPTIONS') {
      res.sendStatus(200);
      return;
    }
    
    next();
  });

  // Body size limits
  app.use(express.json({ limit: '10kb' }));
  app.use(express.urlencoded({ limit: '10kb', extended: true }));
}

// Auth rate limiter (stricter for login attempts)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per 15 min
  skipSuccessfulRequests: true,
  message: 'Too many login attempts, please try again later.',
});

export const emailLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 emails per hour
  skipSuccessfulRequests: true,
});
