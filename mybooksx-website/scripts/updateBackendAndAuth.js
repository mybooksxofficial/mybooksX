import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// 1. UPDATE authService.ts
const authServicePath = path.join(rootDir, 'src/server/authService.ts');
let authServiceCode = fs.readFileSync(authServicePath, 'utf8');

if (!authServiceCode.includes('phone?: string;')) {
  authServiceCode = authServiceCode.replace(
    'export interface UserRecord {\n  id: string;\n  email: string;',
    'export interface UserRecord {\n  id: string;\n  email: string;\n  phone?: string;'
  ).replace(
    'export interface UserRecord {\r\n  id: string;\r\n  email: string;',
    'export interface UserRecord {\r\n  id: string;\r\n  email: string;\r\n  phone?: string;'
  );

  authServiceCode = authServiceCode.replace(
    'export interface PublicUser {\n  id: string;\n  email: string;',
    'export interface PublicUser {\n  id: string;\n  email: string;\n  phone?: string;'
  ).replace(
    'export interface PublicUser {\r\n  id: string;\r\n  email: string;',
    'export interface PublicUser {\r\n  id: string;\r\n  email: string;\r\n  phone?: string;'
  );

  authServiceCode = authServiceCode.replace(
    '    email: u.email,\n    fullName: u.full_name,',
    '    email: u.email,\n    phone: u.phone || undefined,\n    fullName: u.full_name,'
  ).replace(
    '    email: u.email,\r\n    fullName: u.full_name,',
    '    email: u.email,\r\n    phone: u.phone || undefined,\r\n    fullName: u.full_name,'
  );
}

const phoneMethod = `
  /**
   * Real Name & Mobile Phone Authentication
   * Allows real players to authenticate directly with Name and Mobile number.
   * Immediately verified, active session created, real records displayed on Owner Portal.
   */
  static async loginOrRegisterWithPhone(
    db: D1DatabaseLike,
    params: {
      fullName: string;
      phone: string;
      clientIp?: string;
    }
  ): Promise<{ success: boolean; message: string; sessionToken?: string; user?: PublicUser; error?: string }> {
    const rawName = (params.fullName || '').trim();
    const rawPhone = (params.phone || '').trim();

    if (!rawName || rawName.length < 2) {
      return { success: false, message: 'Please enter your full name (at least 2 characters).', error: 'INVALID_NAME' };
    }

    const cleanDigits = rawPhone.replace(/\\D/g, '');
    if (cleanDigits.length < 10) {
      return { success: false, message: 'Please enter a valid 10-digit mobile number.', error: 'INVALID_PHONE' };
    }

    const formatted10 = cleanDigits.slice(-10);
    const displayPhone = '+91 ' + formatted10;
    const generatedEmail = formatted10 + '@phone.mybooksx.com';
    const now = new Date().toISOString();

    let user = await db.prepare(
      'SELECT * FROM users WHERE phone = ? OR phone = ? OR email = ?'
    ).bind(displayPhone, formatted10, generatedEmail).first<UserRecord>();

    if (!user) {
      user = await db.prepare(
        'SELECT * FROM users WHERE phone LIKE ?'
      ).bind('%' + formatted10 + '%').first<UserRecord>();
    }

    if (user) {
      await db.prepare(
        'UPDATE users SET full_name = ?, phone = ?, is_verified = 1, updated_at = ? WHERE id = ?'
      ).bind(rawName, displayPhone, now, user.id).run();

      user.full_name = rawName;
      user.phone = displayPhone;
      user.is_verified = 1;
    } else {
      const newId = 'usr_ph_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 6);
      await db.prepare(
        \`INSERT INTO users (
          id, email, full_name, phone, password_hash, salt, is_verified,
          points_balance, points_reserved, total_points_earned, role, auth_provider,
          created_at, updated_at
        ) VALUES (?, ?, ?, ?, 'phone_auth_hash', 'phone_salt', 1, 0, 0, 0, 'user', 'phone', ?, ?)\`
      ).bind(newId, generatedEmail, rawName, displayPhone, now, now).run();

      user = await db.prepare('SELECT * FROM users WHERE id = ?').bind(newId).first<UserRecord>();
      if (!user) {
        return { success: false, message: 'Failed to create user account.', error: 'DB_ERROR' };
      }
    }

    const sessionToken = generateSessionToken();
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    await db.prepare(
      \`INSERT INTO sessions (id, user_id, expires_at, user_agent, ip_address, created_at)
       VALUES (?, ?, ?, 'mobile_web', ?, ?)\`
    ).bind(sessionToken, user.id, expiresAt, params.clientIp || '127.0.0.1', now).run();

    return {
      success: true,
      message: 'Welcome ' + user.full_name + '! Signed in successfully.',
      sessionToken,
      user: toPublicUser(user)
    };
  }
`;

if (!authServiceCode.includes('loginOrRegisterWithPhone')) {
  authServiceCode = authServiceCode.replace(
    'export class AuthService {',
    'export class AuthService {\n' + phoneMethod
  );
  fs.writeFileSync(authServicePath, authServiceCode, 'utf8');
  console.log('✅ Updated src/server/authService.ts with loginOrRegisterWithPhone');
}

// 2. UPDATE apiRouter.ts
const apiRouterPath = path.join(rootDir, 'src/server/apiRouter.ts');
let apiRouterCode = fs.readFileSync(apiRouterPath, 'utf8');

const phoneRoute = `
    // Real Name & Mobile Phone Authentication (Zero Google OAuth errors)
    if (pathname === '/api/auth/phone' && method === 'POST') {
      try {
        const body: any = await req.json();
        const result = await AuthService.loginOrRegisterWithPhone(db, {
          fullName: body.fullName || body.name || '',
          phone: body.phone || body.mobile || '',
          clientIp
        });
        if (result.success && result.sessionToken) {
          return jsonResponse(result, 200, {
            'Set-Cookie': createSessionCookie(result.sessionToken)
          });
        }
        return jsonResponse(result, result.success ? 200 : 400);
      } catch (e: any) {
        return jsonResponse({ success: false, message: e?.message || 'Phone sign-in failed.' }, 400);
      }
    }
`;

if (!apiRouterCode.includes("'/api/auth/phone'")) {
  apiRouterCode = apiRouterCode.replace(
    "if (pathname === '/api/auth/login' && method === 'POST') {",
    phoneRoute + "\n    if (pathname === '/api/auth/login' && method === 'POST') {"
  );
  fs.writeFileSync(apiRouterPath, apiRouterCode, 'utf8');
  console.log('✅ Updated src/server/apiRouter.ts with /api/auth/phone route');
}

// 3. UPDATE leaderboardService.ts
const leaderboardPath = path.join(rootDir, 'src/server/leaderboardService.ts');
let leaderboardCode = fs.readFileSync(leaderboardPath, 'utf8');

leaderboardCode = leaderboardCode.replace(
  'u.id as user_id,\n        u.full_name,\n        u.email,\n        u.auth_provider,',
  'u.id as user_id,\n        u.full_name,\n        u.email,\n        u.phone,\n        u.auth_provider,'
).replace(
  'u.id as user_id,\r\n        u.full_name,\r\n        u.email,\r\n        u.auth_provider,',
  'u.id as user_id,\r\n        u.full_name,\r\n        u.email,\r\n        u.phone,\r\n        u.auth_provider,'
);

// Remove WHERE u.role != 'admin' so ALL real users are visible on owner portal
leaderboardCode = leaderboardCode.replace(
  "WHERE u.role != 'admin' OR u.role IS NULL\n       ORDER BY u.points_balance DESC",
  "ORDER BY u.points_balance DESC"
).replace(
  "WHERE u.role != 'admin' OR u.role IS NULL\r\n       ORDER BY u.points_balance DESC",
  "ORDER BY u.points_balance DESC"
);

// Include phone in rankedUsers
if (!leaderboardCode.includes('phone: u.phone')) {
  leaderboardCode = leaderboardCode.replace(
    "email: u.email,\n        authProvider: u.auth_provider || 'email',",
    "email: u.email,\n        phone: u.phone || (u.email && u.email.includes('@phone.mybooksx.com') ? '+91 ' + u.email.replace('@phone.mybooksx.com', '') : ''),\n        authProvider: u.auth_provider || 'phone',"
  ).replace(
    "email: u.email,\r\n        authProvider: u.auth_provider || 'email',",
    "email: u.email,\r\n        phone: u.phone || (u.email && u.email.includes('@phone.mybooksx.com') ? '+91 ' + u.email.replace('@phone.mybooksx.com', '') : ''),\r\n        authProvider: u.auth_provider || 'phone',"
  );
  fs.writeFileSync(leaderboardPath, leaderboardCode, 'utf8');
  console.log('✅ Updated src/server/leaderboardService.ts with phone support & full user visibility');
}

// 4. UPDATE apiClient.ts
const apiClientPath = path.join(rootDir, 'src/services/apiClient.ts');
let apiClientCode = fs.readFileSync(apiClientPath, 'utf8');

const clientPhoneMethod = `
    async phoneLogin(data: { fullName: string; phone: string }) {
      return request<{
        success: boolean;
        message: string;
        user?: any;
        sessionToken?: string;
        error?: string;
      }>('/api/auth/phone', {
        method: 'POST',
        body: JSON.stringify(data)
      });
    },
`;

if (!apiClientCode.includes('phoneLogin(data:')) {
  apiClientCode = apiClientCode.replace(
    'async quickGoogleLogin(',
    clientPhoneMethod + '\n    async quickGoogleLogin('
  );
  fs.writeFileSync(apiClientPath, apiClientCode, 'utf8');
  console.log('✅ Updated src/services/apiClient.ts with phoneLogin');
}

console.log('🏁 Step 1 completed successfully.');

