import { type Response, type NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { type AuthRequest, type User } from '../types';
import { db } from '@workspace/db';
import { users } from '@workspace/db/schema';
import { eq } from 'drizzle-orm';

export async function verifyToken(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret) as any;
    
    // Check if user exists in our local users table
    const [user] = await db.select().from(users).where(eq(users.id, decoded.sub));
    
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = user as User;
    req.token = token;
    next();
  } catch (err) {
    console.error('JWT Verification Error:', err);
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
}

// Middleware to check if profile is set up
export async function requireProfile(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  // You might want to check for profile existence here or in specific routes
  next();
}
