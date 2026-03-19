import dotenv from 'dotenv-safe';
import path from 'path';

// Load environment variables
// Note: In development, we use .env.local
dotenv.config({
  path: path.join(process.cwd(), '.env.local'),
  example: path.join(process.cwd(), '.env.local.example'),
  allowEmptyValues: true,
});

export const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Database
  databaseUrl: process.env.DATABASE_URL!,
  supabaseDbUrl: process.env.SUPABASE_DB_URL,
  
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
  'SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'JWT_SECRET',
];

for (const key of required) {
  if (!process.env[key]) {
    // Only throw in non-test environments or if specifically required
    if (config.nodeEnv !== 'test') {
      console.warn(`Warning: Missing environment variable: ${key}`);
    }
  }
}
