# Project Review: Errors and Incomplete Areas

Date: 2026-03-19
Scope: Whole workspace static review + environment/tooling checks

## Executive Summary

- IDE diagnostics currently show **no active Problems**.
- However, there are **critical runtime and workflow issues** that will block execution.
- The app is also **partially integrated**: frontend and backend are mostly disconnected.

## Confirmed Errors (High Priority)

1. Missing import causing runtime crash in frontend app shell
- File: frontend/src/App.tsx:25
- Evidence: `const { loading } = useApp() || {};`
- Issue: `useApp` is used but not imported from `./context/AppContext`.
- Impact: App can fail at runtime with `ReferenceError: useApp is not defined`.

2. Root dev scripts are machine-specific and likely broken on other systems
- File: package.json:6
- Evidence: `"dev:frontend": "F:\\node.je\\corepack.cmd pnpm --filter frontend run dev"`
- File: package.json:7
- Evidence: `"dev:backend": "F:\\node.je\\corepack.cmd pnpm --filter backend run dev"`
- Issue: Hardcoded absolute path to `corepack.cmd`.
- Impact: `npm run dev` cannot be used reliably across environments.

3. Project tooling unavailable in current environment
- Terminal check: `pnpm` command is not recognized.
- Terminal check: `npm run dev` fails due PowerShell execution policy (`npm.ps1` blocked).
- Impact: Cannot run full build/typecheck pipeline in current shell configuration.

## Incomplete or Partially Implemented Areas

1. Frontend and backend are not integrated for business flows
- Evidence A: Frontend has no `fetch(`/api`)`/API-client usage in app pages.
- Evidence B: Backend exposes `/api/profile`, `/api/requests`, `/api/billing`.
- Files:
  - frontend/src/pages/LoginPage.jsx:29,48 (Supabase auth only)
  - frontend/src/context/AppContext.jsx:35-40 (local in-memory state updates)
  - backend/src/routes/index.ts:17-19 (backend domain routes exist)
- Impact: Profile/request/billing data in UI is local/transient and not persisted via backend APIs.

2. Auth boundary mismatch between frontend and backend
- Backend expects JWT validated by custom secret:
  - backend/src/middlewares/auth.ts:18 (`jwt.verify(token, config.jwtSecret)`)
- Frontend only performs Supabase OTP auth and does not attach backend Bearer tokens to API calls.
- Impact: Even after UI login, backend protected routes are not usable by current frontend flow.

3. Profile setup and requests are local-only state, not persisted
- File: frontend/src/context/AppContext.jsx:35-40
- Evidence:
  - `setProfileState({ ...data, isSetup: true })`
  - `setRequests(prev => [req, ...prev])`
- Impact: Data resets on refresh/session reset; production persistence path is incomplete.

4. Health endpoint implementation is duplicated/inconsistent
- Active route in router index:
  - backend/src/routes/index.ts:8 (`/health`)
- Separate route file defines `/healthz` but is not mounted:
  - backend/src/routes/health.ts:6
- Impact: Dead code and inconsistent API surface.

5. Frontend 404 page exists but is not wired into router
- File present: frontend/src/pages/not-found.tsx:4
- Routes currently defined without fallback:
  - frontend/src/App.tsx:14-19
- Impact: Unknown routes do not render the custom NotFound page.

6. Environment configuration appears strict in code but soft in validation behavior
- config requires critical vars (`JWT_SECRET`, `SUPABASE_SERVICE_ROLE_KEY`, etc.)
  - backend/src/config.ts:22,25,36-41
- Missing values only warn in non-test mode:
  - backend/src/config.ts:48
- DB layer throws hard if `DATABASE_URL` missing:
  - lib/db/src/index.ts:7-8
- Impact: Startup/runtime behavior can be inconsistent depending on which codepath is hit first.

## Notes on Current Error Visibility

- `get_errors` reported no editor diagnostics at scan time.
- This does not guarantee runtime correctness; several issues above are integration/runtime concerns.

## Recommended Fix Order

1. Fix frontend runtime import issue in `App.tsx`.
2. Replace hardcoded root script paths in `package.json` with portable commands.
3. Normalize local environment/tooling setup (`pnpm`, PowerShell execution policy strategy).
4. Decide auth model (Supabase JWT verification in backend vs custom JWT issuance) and align both sides.
5. Connect frontend flows to backend endpoints (profile, requests, billing).
6. Remove dead `health.ts` route or mount it intentionally; standardize `/health` vs `/healthz`.
7. Add router fallback to use `not-found.tsx`.

## Validation Limitations

- Could not execute `pnpm` scripts because `pnpm` is not installed/available in PATH in this shell.
- Could not run `npm run dev` due PowerShell execution policy blocking `npm.ps1`.
- Findings are based on source review plus available terminal checks.
