# Phase 1 Implementation Guide: Foundation & Setup

**Objective**: Prepare infrastructure for secure development  
**Duration**: 2-3 days  
**Deliverable**: Production-ready boilerplate

---

## Step 1: Create `.env.local` Template

Create `artifacts/api-server/.env.local` and `.env.local.example`:

**`.env.local.example`** (commit this - no secrets):
```bash
# Server Configuration
PORT=3000
NODE_ENV=development

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/aquavera_dev
SUPABASE_DB_URL=postgresql://postgres.xxxxx:password@aws-0-eu-central-1.neon.tech/neondb

# Supabase (from project settings)
VITE_SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# JWT Secrets
JWT_SECRET=your-super-secret-key-min-32-chars-long!!!
JWT_EXPIRY=7d

# CORS
CORS_ORIGIN=http://localhost:5173,https://aquavera.example.com

# Email/SMS (optional for OTP)
TWILIO_ACCOUNT_SID=xxx
TWILIO_AUTH_TOKEN=xxx
TWILIO_PHONE_NUMBER=+1xxx

# Logging
LOG_LEVEL=debug
```

**`.env.local`** (DO NOT COMMIT - gitignore this):
```bash
# Same as above but with real values
DATABASE_URL=postgresql://user:your_real_password@localhost:5432/aquavera_dev
# ... etc
```

---

## Step 2: Update `.gitignore`

Add to root `.gitignore`:
```bash
# Environment variables
.env
.env.local
.env.*.local
.env.production.local
.env.development.local

# Secrets
*.key
*.pem
secrets/

# Build outputs
dist/
build/
*.tsbuildinfo

# Dependencies
node_modules/

# IDE
.vscode/settings.json
.idea/
*.swp

# OS
.DS_Store
Thumbs.db
```

---

## Step 3: Install Security Dependencies

Run in `artifacts/api-server/`:

```bash
pnpm add helmet express-rate-limit jsonwebtoken dotenv-safe cors-preflight
pnpm add -D @types/jsonwebtoken
```

Update `package.json` scripts:
```json
{
  "scripts": {
    "dev": "NODE_ENV=development tsx ./src/index.ts",
    "build": "tsx ./build.ts",
    "typecheck": "tsc -p tsconfig.json --noEmit",
    "start": "node ./dist/index.js"
  }
}
```

---

## Step 4: Setup Supabase Project

### 4A: Create Free Account
1. Go to https://supabase.com
2. Click "Start your project"
3. Sign up with email or GitHub
4. Create new project (choose region closest to you)
5. Wait for provisioning (30 seconds)

### 4B: Get Credentials
1. Project Settings → API
2. Copy `Project URL` → `VITE_SUPABASE_URL`
3. Copy `anon public` → `SUPABASE_ANON_KEY`
4. Copy `service_role` → `SUPABASE_SERVICE_ROLE_KEY`

### 4C: Setup Database Connection
1. Projects → [Your Project] → Database
2. Under "Connection Pooler", copy connection string
3. Paste as `DATABASE_URL` in `.env.local`

### 4D: Generate Strong JWT Secret
```bash
# On macOS/Linux
openssl rand -base64 32

# On Windows PowerShell
[Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
```
Copy output as `JWT_SECRET`

---

## Step 5: Update TypeScript Config

Ensure `tsconfig.json` has strict mode:
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

---

## Step 6: Create Base Security Middleware

Create `artifacts/api-server/src/middlewares/security.ts`:

```typescript
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { type Express } from 'express';

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
    
    if (corsWhitelist.includes(origin || '')) {
      res.header('Access-Control-Allow-Origin', origin);
      res.header('Access-Control-Allow-Credentials', 'true');
    }
    
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
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
```

---

## Step 7: Update App Configuration

Update `artifacts/api-server/src/app.ts`:

```typescript
import express, { type Express } from "express";
import { applySecurity } from "./middlewares/security";
import router from "./routes";

const app: Express = express();

// Apply security first
applySecurity(app);

// Routes
app.use("/api", router);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

// Error handler (must be last)
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Error:", err);
  
  const status = err.status || err.statusCode || 500;
  const message = process.env.NODE_ENV === 'production' 
    ? 'Internal server error' 
    : err.message;
  
  res.status(status).json({
    error: message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
});

export default app;
```

---

## Step 8: Create Environment Validation

Create `artifacts/api-server/src/config.ts`:

```typescript
import dotenv from 'dotenv-safe';
import path from 'path';

// Load environment variables
dotenv.config({
  path: path.join(process.cwd(), '.env.local'),
  example: path.join(process.cwd(), '.env.local.example'),
});

export const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Database
  databaseUrl: process.env.DATABASE_URL!,
  
  // Supabase
  supabaseUrl: process.env.VITE_SUPABASE_URL!,
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY!,
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  
  // JWT
  jwtSecret: process.env.JWT_SECRET!,
  jwtExpiry: process.env.JWT_EXPIRY || '7d',
  
  // CORS
  corsOrigin: process.env.CORS_ORIGIN?.split(',') || [],
  
  // Logging
  logLevel: process.env.LOG_LEVEL || 'info',
};

// Validate required env vars
const required = [
  'DATABASE_URL',
  'VITE_SUPABASE_URL',
  'JWT_SECRET',
];

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}
```

---

## Step 9: Add Type Definitions

Create `artifacts/api-server/src/types/index.ts`:

```typescript
export interface User {
  id: string;
  email?: string;
  phone: string;
  verified: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Profile {
  user_id: string;
  name: string;
  aadhaar_last4?: string;
  land_id?: string;
  land_area?: number;
  beneficiary_type: 'individual' | 'wua';
  water_source?: string;
}

export interface WaterRequest {
  id: string;
  user_id: string;
  crop: string;
  season: string;
  duration_days: number;
  land_area: number;
  geo_location?: { lat: number; lng: number };
  photo_url?: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  bill_amount: number;
  created_at: Date;
  updated_at: Date;
}

export interface Billing {
  id: string;
  user_id: string;
  request_id: string;
  amount: number;
  paid: boolean;
  paid_at?: Date;
  created_at: Date;
}

export interface AuthRequest extends Express.Request {
  user?: User;
  token?: string;
}
```

---

## Step 10: Create Database Backup

In `lib/db/src/migrations/001_initial_schema.sql`:

```sql
-- Users table (managed by Supabase Auth)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE,
  phone TEXT UNIQUE NOT NULL,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  user_id UUID PRIMARY KEY NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  aadhaar_last4 TEXT,
  land_id TEXT,
  land_area DECIMAL(10, 2),
  beneficiary_type TEXT CHECK (beneficiary_type IN ('individual', 'wua')),
  water_source TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Water requests table
CREATE TABLE IF NOT EXISTS public.water_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  crop TEXT NOT NULL,
  season TEXT NOT NULL CHECK (season IN ('kharif', 'rabi', 'hotWeather')),
  duration_days INTEGER NOT NULL,
  land_area DECIMAL(10, 2) NOT NULL,
  geo_location JSONB,
  photo_url TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'completed')),
  bill_amount DECIMAL(10, 2),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Billing table
CREATE TABLE IF NOT EXISTS public.billing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  request_id UUID REFERENCES public.water_requests(id) ON DELETE SET NULL,
  amount DECIMAL(10, 2) NOT NULL,
  paid BOOLEAN DEFAULT FALSE,
  paid_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX idx_water_requests_user_id ON public.water_requests(user_id);
CREATE INDEX idx_water_requests_status ON public.water_requests(status);
CREATE INDEX idx_billing_user_id ON public.billing(user_id);
CREATE INDEX idx_billing_paid ON public.billing(paid);

-- Enable RLS (Row Level Security)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.water_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.billing ENABLE ROW LEVEL SECURITY;
```

---

## Step 11: Test Setup

Run in `artifacts/api-server/`:

```bash
# Check TypeScript
pnpm run typecheck

# Test server starts
pnpm run dev

# Should output: Server listening on port 3000
```

If you see errors:
1. Double-check `.env.local` values
2. Ensure Supabase project is initialized
3. Check DATABASE_URL format

---

## 📋 Phase 1 Checklist

- [ ] `.env.local` created with all values
- [ ] `.env.local.example` committed to git
- [ ] `.gitignore` updated
- [ ] Dependencies installed: helmet, express-rate-limit, jsonwebtoken
- [ ] Supabase project created and configured
- [ ] `.env.local` secrets generated (JWT_SECRET)
- [ ] Security middleware created and applied
- [ ] Config validation in place
- [ ] Type definitions created
- [ ] Database schema SQL file created
- [ ] Server runs without errors: `pnpm run dev`
- [ ] Environment variables documented

---

## 🚀 Next Phase

Once Phase 1 is complete:
1. Create authentication system
2. Define database schema in Supabase
3. Implement API routes with validation
4. Update frontend to use real API

---

**Status**: Ready to Implement  
**Estimated Time**: 2-3 hours  
**Difficulty**: Easy  
