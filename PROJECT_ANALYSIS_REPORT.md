# Website-Builder-Pro: Security Audit & Modernization Report

**Date**: March 19, 2026  
**Project**: AquaVera - Irrigation Water Management Platform  
**Target DB**: Supabase (PostgreSQL)  
**Stack**: TypeScript, React, Express.js, Drizzle ORM

---

## Executive Summary

This is a **monorepo-based full-stack application** with a React frontend and Express backend. The project has **critical security vulnerabilities** and architectural gaps that must be addressed before production use. Key findings:

- ✅ **Good Foundation**: Modern tech stack, TypeScript, proper monorepo setup
- ⚠️ **Critical Gaps**: No authentication, no validation, no rate limiting
- 🔴 **Production Unready**: Unsafe CORS, exposed errors, unencrypted secrets
- 📋 **Migration Path**: Clear roadmap to integrate Supabase

---

## 📊 Vulnerabilities & Issues Report

### 🔴 CRITICAL (Fix Immediately)

#### 1. **No Authentication System**
**Issue**: Login is client-side only with mock OTP  
**Evidence**: `LoginPage.jsx` validates OTP locally, no backend verification  
**Risk**: Anyone can impersonate users  
**Impact**: User data exposed, unauthorized access
```javascript
// Current (WRONG):
const handleVerify = () => {
  const code = otp.join('');
  // Local validation only - NO SERVER VERIFICATION
  if (code.length !== 4) { setOtpError(...) }
  navigate('/dashboard'); // Immediate navigation
};
```
**Fix**: Implement JWT/Session auth with Supabase Auth

---

#### 2. **No Input Validation on Backend**
**Issue**: API has no validation middleware or schema checks  
**Evidence**: `app.ts` missing validation, routes accept any data  
**Risk**: SQL injection, XSS, data corruption  
**Impact**: Database compromise, malicious data entry
```typescript
// Current (WRONG):
app.use(express.json()); // No validation limits or schemas
app.use("/api", router);
```
**Fix**: Add Zod/Joi validation middleware for all routes

---

#### 3. **CORS Too Permissive**
**Issue**: `app.use(cors())` allows all origins  
**Evidence**: [api-server/app.ts](artifacts/api-server/src/app.ts#L5)  
**Risk**: CSRF attacks, unauthorized cross-site requests  
**Impact**: Attackers can weaponize your API
```typescript
// Current (WRONG):
app.use(cors()); // Allows ANY origin
```
**Fix**: Whitelist specific domains
```typescript
app.use(cors({
  origin: ['https://aquavera.example.com'],
  credentials: true
}));
```

---

#### 4. **No Rate Limiting**
**Issue**: API endpoints unprotected from brute force/DDoS  
**Evidence**: No middleware in `routes/index.ts`  
**Risk**: Service disruption, brute force attacks  
**Impact**: API abuse, billing issues
**Fix**: Add `express-rate-limit` middleware

---

#### 5. **HTTP-Only Server, No HTTPS**
**Issue**: All traffic unencrypted, passwords/tokens exposed in transit  
**Evidence**: `app.listen()` no TLS configuration  
**Risk**: Man-in-the-middle attacks  
**Impact**: Credential theft, session hijacking
**Fix**: Enable HTTPS in production, use Supabase API (HTTPS by default)

---

#### 6. **Sensitive Data in Client State**
**Issue**: User profiles, requests stored in React context (localStorage accessible)  
**Evidence**: `AppContext.jsx` stores `aadhaar`, `landId` without encryption  
**Risk**: Local XSS can steal sensitive data  
**Impact**: PII exposure
```javascript
// Current (UNSAFE):
const [profile, setProfileState] = useState({
  name: '',
  aadhaar: '', // Unencrypted in localStorage
  landId: '',
});
```
**Fix**: Store only session token, fetch profile server-side

---

### 🟠 HIGH (Fix Before Launch)

#### 7. **No API Authentication Middleware**
**Issue**: All routes publicly accessible  
**Evidence**: `routes/health.ts` only endpoint, no auth checks  
**Risk**: Unauthorized data access  
**Impact**: Database accessible without credentials
**Fix**: Add JWT validation middleware

---

#### 8. **Empty Database Schema**
**Issue**: Database schema is commented out  
**Evidence**: [db/schema/index.ts](lib/db/src/schema/index.ts#L1) exports empty object  
**Risk**: No real data storage, app non-functional  
**Impact**: Can't save any data
```typescript
// Current (WRONG):
export {} // Schema is empty!
```
**Fix**: Define all tables for supabase (users, profiles, requests, billing)

---

#### 9. **No Error Handling or Logging**
**Issue**: Express app has no error middleware  
**Evidence**: No `try-catch` blocks, raw errors exposed  
**Risk**: Stack traces leak implementation details  
**Impact**: Information disclosure vulnerability
**Fix**: Add error middleware, structured logging

---

#### 10. **Secrets in Environment Variables (Unencrypted)**
**Issue**: DATABASE_URL in plain text in `.env`  
**Evidence**: [drizzle.config.ts](lib/db/drizzle.config.ts#L4)  
**Risk**: If `.env` committed to git, secrets exposed  
**Impact**: Database compromise
**Fix**: Use `.env.local` (gitignored), Supabase environment variables

---

### 🟡 MEDIUM (Before Production)

#### 11. **No Input Size Limits**
**Issue**: No limits on request body/file uploads  
**Risk**: Memory exhaustion, disk space abuse  
**Fix**: Add `express.json({ limit: '10mb' })`

---

#### 12. **CORS Missing Security Headers**
**Issue**: No HSTS, X-Frame-Options, CSP headers  
**Risk**: Clickjacking, SSL stripping  
**Fix**: Add `helmet` middleware

---

#### 13. **No Logging or Audit Trail**
**Issue**: No way to track user actions or security events  
**Risk**: Can't investigate breaches or forensics  
**Fix**: Add request logging, audit logs for sensitive operations

---

#### 14. **Frontend XSS Protection Missing**
**Issue**: No Content Security Policy  
**Risk**: Inline script injection possible  
**Fix**: Add CSP headers, sanitize user input

---

#### 15. **No Password/2FA Support**
**Issue**: Only OTP auth, no password complexity, no 2FA  
**Risk**: Weak authentication  
**Fix**: Use Supabase Auth (supports multiple MFA methods)

---

### 🔵 LOW (Nice to Have)

- API rate limiting per user (not just global)
- API key rotation mechanism
- Deprecation policy for API versions
- Request signing/verification
- Encryption at rest for sensitive fields

---

## 📋 Work Breakdown Structure (4 Phases)

### Phase 1: Foundation & Setup (Week 1)
**Goal**: Secure infrastructure, prepare for Supabase migration

- [ ] Set up `.env.local` (gitignore)
- [ ] Install security packages:
  - `helmet` - Security headers
  - `express-rate-limit` - Rate limiting
  - `jsonwebtoken` - JWT auth
  - `@supabase/supabase-js` - Supabase client
- [ ] Create GitHub repo with `.env.local` in `.gitignore`
- [ ] Set up Supabase project (free tier available)
- [ ] Document env variables needed

**Deliverables**:
- [ ] `.env.local.example` file
- [ ] Supabase project created and configured
- [ ] Dependencies installed and updated

---

### Phase 2: Database & Authentication (Week 2)
**Goal**: Implement proper auth and database schema

#### 2A: Database Schema
- [ ] Define `users` table (id, email, phone, created_at)
- [ ] Define `profiles` table (user_id, name, aadhaar_last4, land_id, land_area)
- [ ] Define `requests` table (user_id, crop, season, duration, status, bill_amount)
- [ ] Define `billing` table (user_id, request_id, amount, paid_at)
- [ ] Apply migrations to Supabase

#### 2B: Authentication Layer
- [ ] Migrate to Supabase Auth (phone + OTP)
- [ ] Create JWT session management
- [ ] Add auth middleware to all API routes
- [ ] Implement password reset flow (if needed)
- [ ] Add MFA support (optional)

**Deliverables**:
- [ ] SQL schema files
- [ ] Supabase Auth integrated
- [ ] Auth middleware working on all routes

---

### Phase 3: API Security & Validation (Week 3)
**Goal**: Harden API endpoints and add security

#### 3A: Validation & Error Handling
- [ ] Add Zod/Joi schemas for all endpoints
- [ ] Create validation middleware
- [ ] Add input size limits (100KB for requests)
- [ ] Create centralized error handler
- [ ] Add request logging middleware

#### 3B: API Rate Limiting & Headers
- [ ] Add global rate limit (100 req/min)
- [ ] Add per-user rate limit (10 req/min for auth endpoints)
- [ ] Add `helmet` for security headers
- [ ] Lock down CORS to specific domains
- [ ] Add request ID tracking (X-Request-ID)

#### 3C: Implement All Routes
- [ ] `POST /auth/login` - Phone + OTP
- [ ] `POST /auth/verify-otp` - Verify and create session
- [ ] `POST /auth/logout` - Destroy session
- [ ] `GET /profile` - Get user profile
- [ ] `POST /profile` - Update profile
- [ ] `POST /request` - Create water request
- [ ] `GET /request` - List user requests
- [ ] `GET /billing` - Get billing summary

**Deliverables**:
- [ ] Validation schemas for all endpoints
- [ ] Error handling middleware
- [ ] Rate limiting configured
- [ ] All CRUD endpoints working

---

### Phase 4: Frontend Integration & Security (Week 4)
**Goal**: Update frontend to use secure backend, add security features

#### 4A: Auth Integration
- [ ] Remove mock auth from LoginPage
- [ ] Integrate with Supabase Auth
- [ ] Implement session/token management
- [ ] Add logout functionality
- [ ] Add auto-logout on token expiry

#### 4B: API Integration
- [ ] Update API client to use JWT tokens
- [ ] Implement token refresh logic
- [ ] Add error boundary for 401/403
- [ ] Remove hardcoded test data
- [ ] Fetch real data from backend

#### 4C: Security Hardening
- [ ] Remove sensitive data from client state (only keep session token)
- [ ] Implement CSRF protection
- [ ] Add Content Security Policy headers
- [ ] Implement XSS protection
- [ ] Add input sanitization

#### 4D: Testing & Deployment
- [ ] Integration tests for auth flow
- [ ] API endpoint tests
- [ ] Security checklist validation
- [ ] Production build & deployment
- [ ] Monitoring setup

**Deliverables**:
- [ ] Functional login flow with real backend
- [ ] All pages working with API data
- [ ] Security headers configured
- [ ] Deployed to production

---

## 🗂️ Tech Stack for Fixes

| Layer | Current | Recommended | Why |
|-------|---------|-------------|-----|
| **Auth** | None | Supabase Auth | Built-in, secure, free |
| **Database** | PostgreSQL (raw) | Supabase | Managed, HTTPS, built-in auth |
| **Validation** | None | Zod (already used) | Type-safe, in-app validation |
| **Security Headers** | None | Helmet | Industry standard |
| **Rate Limiting** | None | express-rate-limit | Simple, effective |
| **Logging** | console.log | Pino or Winston | Structured logs |
| **JWT** | None | jsonwebtoken | Standard, widely used |
| **Secrets** | .env | Supabase env vars | Protected by Supabase |

---

## 🚀 Supabase Integration Plan

### What Supabase Provides:
- ✅ PostgreSQL database (managed)
- ✅ Authentication (phone, email, OAuth, 2FA)
- ✅ Row-level security (RLS)
- ✅ Real-time subscriptions
- ✅ Automatic HTTPS
- ✅ Backups and disaster recovery
- ✅ Vector embeddings (for AI verification)

### Setup Steps:
1. Create Supabase project at https://supabase.com
2. Get API URL and API key from settings
3. Add to `.env.local`:
   ```
   VITE_SUPABASE_URL=https://xxx.supabase.co
   VITE_SUPABASE_KEY=eyJxxx...
   SUPABASE_DB_URL=postgresql://...
   ```
4. Create tables in SQL editor
5. Enable RLS policies
6. Set up Auth redirects

---

## 🔒 Security Checklist

### Before Moving to Production:
- [ ] All routes require authentication
- [ ] CORS limited to known domains
- [ ] Rate limiting enabled globally
- [ ] Input validation on all endpoints
- [ ] Error messages don't leak stack traces
- [ ] HTTPS everywhere (no HTTP)
- [ ] Security headers added (helmet)
- [ ] Sensitive data encrypted (Supabase encryption)
- [ ] Audit logging enabled
- [ ] Database backups configured (Supabase handles)
- [ ] Secrets not in git (use .env.local)
- [ ] Frontend CSRF token implemented
- [ ] CSP header configured
- [ ] XSS protections in place
- [ ] OWASP Top 10 mitigated

---

## 📈 Success Metrics

After implementation:
- ✅ 95%+ security score (OWASP)
- ✅ Zero unauthenticated endpoints
- ✅ < 500ms API response time
- ✅ < 1% error rate
- ✅ Audit logs for all user actions
- ✅ 99.9% uptime (Supabase SLA)

---

## 🎯 Priority Order

1. **Immediate** (Do First):
   - Add authentication
   - Lock down CORS
   - Add rate limiting
   - Create database schema

2. **High Priority** (Do Second):
   - Input validation on all endpoints
   - Error handling middleware
   - Security headers
   - Migrate to Supabase

3. **Medium Priority** (Do Third):
   - Logging and monitoring
   - Frontend security
   - Integration tests

4. **Nice to Have** (Do Last):
   - Analytics
   - Performance monitoring
   - Advanced RLS policies

---

## 💰 Supabase Cost Estimate

| Tier | Price | Includes | Use Case |
|------|-------|----------|----------|
| **Free** | $0 | 500MB DB, 1GB bandwidth | Development |
| **Pro** | $25/mo | 8GB DB, 100GB bandwidth | Small production |
| **Business** | $599/mo | 200GB DB, 2TB bandwidth | Enterprise |

Your app will likely fit **Free tier** for MVP, **Pro tier** for production.

---

## 📚 Resources & Documentation

- [Supabase Docs](https://supabase.com/docs)
- [Express.js Security](https://expressjs.com/en/advanced/best-practice-security.html)
- [OWASP Top 10 2023](https://owasp.org/www-project-top-ten/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [Helmet.js](https://helmetjs.github.io/)

---

## 📞 Questions & Next Steps

**Next Steps**:
1. Review this report
2. Create Supabase account (free tier)
3. Start Phase 1 setup
4. Implement in order (don't skip phases)

**Questions to Address**:
- Will you need payment processing integration?
- Do you need real-time notifications?
- What's your expected user scale?
- Do you need image processing (AI verification)?

---

**Generated**: March 19, 2026  
**Status**: Ready for Implementation  
**Estimated Timeline**: 4 weeks  
**Complexity**: Medium
