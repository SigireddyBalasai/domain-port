# TOTP Auth for Keystatic CMS — Design Spec

## Overview

Add TOTP-based authentication to protect the Keystatic CMS admin UI (`/keystatic`) and its API routes (`/api/keystatic`). Uses Better Auth with a shared TOTP secret stored in `.env`. Single admin user, JWT session cookie, no database required.

## Architecture

```
/keystatic/login          → Login page (email + TOTP code input)
/keystatic                → Protected CMS page, redirects to /login if unauthenticated
/api/keystatic/*          → Protected API routes, validated by middleware
/api/auth/[...all]        → Better Auth route handler
middleware.ts             → Protects /keystatic and /api/keystatic paths
```

## Components

### 1. `lib/auth.ts` — Better Auth Server Instance

- Configures Better Auth with email provider (no password, TOTP-only)
- Session stored in HTTP-only cookie (JWT mode, no database adapter)
- Single admin email configured via `ADMIN_EMAIL` env var
- TOTP verification is custom (not via Better Auth TOTP plugin) since we use a shared secret without a database

### 2. `app/api/auth/[...all]/route.ts` — Auth API Handler

- Catches all `/api/auth/*` requests
- Delegates to Better Auth instance from `lib/auth.ts`

### 3. `app/api/auth/totp-verify/route.ts` — Custom TOTP Verification

- POST endpoint accepting `{ email, code }`
- Validates email matches `ADMIN_EMAIL`
- Verifies TOTP code against `TOTP_SECRET` using `otpauth` library
- On success: calls Better Auth `createSession()` to issue JWT cookie
- On failure: returns 401

### 3. `middleware.ts` — Route Protection

- Runs on `/keystatic` and `/api/keystatic/*`
- Checks for valid Better Auth session cookie
- Unauthenticated requests to `/keystatic` → redirect to `/keystatic/login`
- Unauthenticated requests to `/api/keystatic/*` → return 401

### 4. `app/keystatic/login/page.tsx` — Login UI

- Client component with email input and 6-digit TOTP code input
- On submit: POST to `/api/auth/totp-verify` (custom endpoint)
- On success: redirect to `/keystatic`
- On failure: show error message
- Optionally displays QR code for first-time setup (generated from `TOTP_SECRET`)

### 5. `.env` — Environment Variables

```
BETTER_AUTH_SECRET=<random string for JWT signing>
TOTP_SECRET=<base32 shared secret for TOTP>
ADMIN_EMAIL=<admin email address>
```

## Flow

1. User visits `/keystatic`
2. Middleware checks session cookie → no session found
3. Redirect to `/keystatic/login`
4. User enters `ADMIN_EMAIL` + 6-digit TOTP code from authenticator app
5. Client POSTs to `/api/auth/totp-verify` with email + code
6. Server verifies email matches `ADMIN_EMAIL` and TOTP code against `TOTP_SECRET` using `otpauth`
7. If valid: Better Auth issues JWT session cookie, returns success
8. Client redirects to `/keystatic` — CMS loads, API calls include session cookie
9. Middleware validates cookie on subsequent requests

## Data Model

- **SQLite database** (`data/auth.db`) — Better Auth SQLite adapter, read-only on server after initial seed
- **Single admin user** seeded with email and TOTP secret
- TOTP secret stored in the `user` table (not `.env`)
- Session stored in SQLite `session` table + HTTP-only JWT cookie
- Database is pre-seeded; no runtime writes needed after setup

### Seed Process

- A one-time script (`scripts/seed-auth.ts`) creates the SQLite DB with the admin user
- Admin email and TOTP secret generated on first run
- QR code displayed for scanning into authenticator app
- After seeding, the DB is read-only during normal operation

## Error Handling

- Invalid TOTP code → 401 with error message on login page
- Missing session on protected route → redirect (UI) or 401 (API)
- Missing env vars → throw on server startup with clear message

## Dependencies

- `better-auth` — core auth framework for session/JWT management
- `otpauth` — lightweight TOTP generation and verification (no database needed)

## Files to Create/Modify

| File | Action | Purpose |
|------|--------|---------|
| `lib/auth.ts` | Create | Better Auth server instance |
| `app/api/auth/[...all]/route.ts` | Create | Auth API handler |
| `app/api/auth/totp-verify/route.ts` | Create | Custom TOTP verification endpoint |
| `middleware.ts` | Create | Route protection |
| `app/keystatic/login/page.tsx` | Create | Login UI |
| `app/api/keystatic/[...params]/route.ts` | Modify | Session validation via middleware |
| `.env` | Modify | Add `BETTER_AUTH_SECRET`, `TOTP_SECRET`, `ADMIN_EMAIL` |
| `package.json` | Modify | Add `better-auth`, `otpauth` |
