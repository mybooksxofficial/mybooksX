# MyBooksX — Cloudflare Workers & D1 Deployment Guide

This guide details how to configure, provision, and deploy the MyBooksX Quiz, Authentication, Leaderboard & Rewards platform to **Cloudflare Workers** and **Cloudflare D1**.

---

## 1. Prerequisites

- A Cloudflare account with Workers and D1 enabled.
- Cloudflare Wrangler CLI (installed globally or run via `npx wrangler`).

---

## 2. Provisioning the Cloudflare D1 Database

### Step 1: Create the D1 Database
In your terminal, run:
```bash
npx wrangler d1 create mybooksx_prod_db
```
Wrangler will output configuration information similar to:
```toml
[[d1_databases]]
binding = "DB"
database_name = "mybooksx_prod_db"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

### Step 2: Update `wrangler.jsonc`
Replace the placeholder `database_id` in [wrangler.jsonc](file:///c:/Users/jaina/mybooksx/mybooksx-website/wrangler.jsonc) with your real `database_id` from Step 1:
```jsonc
"d1_databases": [
  {
    "binding": "DB",
    "database_name": "mybooksx_prod_db",
    "database_id": "YOUR_ACTUAL_D1_DATABASE_ID_HERE"
  }
]
```

### Step 3: Apply Database Migrations & Seeds
Run the following commands to create all tables, indexes, and populate initial rewards catalog and question bank:
```bash
# 1. Apply Schema Migrations
npx wrangler d1 execute mybooksx_prod_db --remote --file=src/server/db/schema.sql

# 2. Populate Seed Catalog & Question Bank
npx wrangler d1 execute mybooksx_prod_db --remote --file=src/server/db/seed.sql
```

---

## 3. Required Environment Secrets & Variables

Store sensitive credentials in Cloudflare encrypted secrets rather than plain text. Secrets are never exposed to frontend code or client bundles.

### Set Production Secrets via Wrangler
```bash
# Google Cloud OAuth 2.0 Client ID & Client Secret
npx wrangler secret put GOOGLE_CLIENT_ID
npx wrangler secret put GOOGLE_CLIENT_SECRET

# Administrative authorization key for Owner Panel approval actions
npx wrangler secret put ADMIN_KEY

# 256-bit cryptographically secure session signing key
npx wrangler secret put SESSION_SECRET
```

### Production Variables Defined in `wrangler.jsonc`
```jsonc
"vars": {
  "APP_URL": "https://mybooksx.com",
  "GOOGLE_REDIRECT_URI": "https://mybooksx.com/api/auth/google/callback",
  "ADMIN_EMAIL": "mybooksxofficial@gmail.com"
}
```

---

## 4. Google Cloud Console Configuration (OAuth 2.0 & OpenID Connect)

Follow these exact steps in Google Cloud Console to enable genuine Google authentication:

### Step 1: Configure OAuth Consent Screen
1. Open the [Google Cloud Console](https://console.cloud.google.com/apis/credentials).
2. Create or select your project (e.g., **MyBooksX**).
3. Navigate to **APIs & Services** > **OAuth consent screen**.
4. Select User Type: **External** and click **Create**.
5. Fill in App Information:
   - **App name**: `MyBooksX`
   - **User support email**: your administrative email (e.g. `mybooksxofficial@gmail.com`)
   - **Developer contact email**: your email
6. In **Scopes for Google APIs**, add:
   - `.../auth/userinfo.email`
   - `.../auth/userinfo.profile`
   - `openid`
7. Save and continue. If the app is in "Testing" mode, add your test Google accounts to the test users list. When ready for production, click **Publish App** to make it available to all Google users.

### Step 2: Create OAuth 2.0 Client ID Credentials
1. Navigate to **APIs & Services** > **Credentials**.
2. Click **Create Credentials** > **OAuth client ID**.
3. Select **Application type**: **Web application**.
4. Set **Name**: `MyBooksX Production & Local Web Client`.
5. Under **Authorized JavaScript origins**, add:
   - `http://localhost:5173` (for local development)
   - `https://mybooksx.com` (for production)
6. Under **Authorized redirect URIs**, add:
   - `http://localhost:5173/api/auth/google/callback` (for local development)
   - `https://mybooksx.com/api/auth/google/callback` (for production)
7. Click **Create**.
8. A modal will display your **Client ID** and **Client Secret**.

### Step 3: Configure Environment Variables
- **For Local Development (`.env`)**:
  ```env
  GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
  GOOGLE_CLIENT_SECRET=GOCSPX-your-google-client-secret
  GOOGLE_REDIRECT_URI=http://localhost:5173/api/auth/google/callback
  APP_URL=http://localhost:5173
  ```
- **For Production Cloudflare Workers**:
  ```bash
  npx wrangler secret put GOOGLE_CLIENT_ID
  # Paste your Google Client ID when prompted

  npx wrangler secret put GOOGLE_CLIENT_SECRET
  # Paste your Google Client Secret when prompted
  ```

### Step 4: Verification of Security Architecture
- **RFC 7636 PKCE**: Code verifiers and SHA-256 code challenges prevent authorization code interception attacks.
- **State & Nonce**: High-entropy cryptographic state and nonce tokens stored in D1 database `oauth_states` table prevent CSRF and replay attacks.
- **Token Verification**: ID token signature and claims (`iss`, `aud`, `exp`, `email_verified`, `nonce`) are strictly verified server-side.
- **Unverified Emails**: Unverified Google emails are blocked automatically.
- **Account Linking**: Existing email/password accounts sharing the verified Google email address are securely linked without creating duplicate accounts.
- **Cookies**: Authenticated sessions are issued as HTTP-only, SameSite=Lax, 30-day persistent cookies (`mbx_session`).
- **No Developer UI in Production**: Public registration and login cards present a clean Google button with no client ID configuration inputs.

---

## 4. Local Development vs Production

The MyBooksX architecture is built on a **Universal D1 Adapter**:
- **In Local Development (`npm run dev`)**: The Vite plugin (`src/server/viteApiPlugin.ts`) automatically uses Node 24's built-in `node:sqlite` persisting to `.d1/local.sqlite`. Migrations and seed data are applied automatically on startup. No Cloudflare login or internet connection is required.
- **In Production (Cloudflare Workers)**: The Worker entrypoint (`src/server/worker.ts`) binds directly to the high-performance Cloudflare distributed D1 database (`env.DB`) across hundreds of edge locations.

---

## 5. Deployment Commands

When ready to deploy:
```bash
# 1. Build frontend bundle & type-check
npm run build

# 2. Deploy to Cloudflare Workers with Static Assets
npx wrangler deploy
```

---

## 6. Architecture & Scalability Highlights

- **Edge Concurrency**: Designed to effortlessly handle 100–1,000 concurrent visitors by caching static client assets at Cloudflare edge data centers and utilizing parameterized, indexed D1 queries.
- **Atomic Double-Entry Ledger**: The `points_transactions` table guarantees point auditability, preventing double-spend and duplicate submissions under concurrent loads.
- **Zero Secrets in Client Bundle**: All password hashing, verification tokens, correct quiz answers, and admin authorization checks occur exclusively on the secure server runtime.

