/**
 * Unified Web Request/Response API Router
 * Handles all /api/* requests with strict input validation, session extraction, and CORS/Cookie management.
 * Compatible with Cloudflare Workers (env.DB) and Vite Connect Middleware (node:sqlite).
 */

import { getDb, type D1DatabaseLike } from './db/d1Client.ts';
import { AuthService } from './authService.ts';
import { QuizService } from './quizService.ts';
import { LeaderboardService } from './leaderboardService.ts';
import { RewardsService } from './rewardsService.ts';
import { processEnquirySubmission, type EnquiryPayload } from './enquiryHandler.ts';

// Helpers
function jsonResponse(data: unknown, status = 200, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Credentials': 'true',
      ...headers
    }
  });
}

function redirectResponse(targetUrl: string, headers: Record<string, string> = {}): Response {
  return new Response(null, {
    status: 302,
    headers: {
      'Location': targetUrl,
      ...headers
    }
  });
}

function parseCookies(cookieHeader?: string | null): Record<string, string> {
  const list: Record<string, string> = {};
  if (!cookieHeader) return list;
  cookieHeader.split(';').forEach(cookie => {
    let [name, ...rest] = cookie.split('=');
    name = name?.trim();
    if (!name) return;
    const value = rest.join('=').trim();
    list[name] = decodeURIComponent(value);
  });
  return list;
}

function extractSessionToken(req: Request): string | null {
  // 1. Try Authorization header
  const authHeader = req.headers.get('Authorization') || req.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7).trim();
  }

  // 2. Try Cookie
  const cookieHeader = req.headers.get('Cookie') || req.headers.get('cookie');
  const cookies = parseCookies(cookieHeader);
  return cookies['mbx_session'] || null;
}

export async function handleApiRequest(
  req: Request,
  env?: {
    DB?: D1DatabaseLike;
    ADMIN_KEY?: string;
    ADMIN_EMAIL?: string;
    APP_URL?: string;
    GOOGLE_CLIENT_ID?: string;
    GOOGLE_CLIENT_SECRET?: string;
    GOOGLE_REDIRECT_URI?: string;
  }
): Promise<Response> {
  const url = new URL(req.url);
  const pathname = url.pathname;
  const method = req.method.toUpperCase();
  const db = await getDb(env);

  // Handle CORS Preflight
  if (method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': req.headers.get('Origin') || '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Credentials': 'true'
      }
    });
  }

  // 1. Diagnostics & Health
  if (pathname === '/api/health' && method === 'GET') {
    return jsonResponse({
      status: 'ok',
      service: 'MyBooksX Core API',
      timestamp: new Date().toISOString()
    });
  }

  // 2. Preserve Existing Enquiry API
  if (pathname === '/api/enquiry' && method === 'POST') {
    try {
      const payload = (await req.json()) as EnquiryPayload;
      const clientIp = req.headers.get('cf-connecting-ip') || req.headers.get('x-forwarded-for') || '127.0.0.1';
      const result = processEnquirySubmission(payload, clientIp);
      return jsonResponse(result.response, result.statusCode);
    } catch {
      return jsonResponse({ success: false, message: 'Invalid enquiry payload.' }, 400);
    }
  }

  // Session user lookup helper
  const sessionToken = extractSessionToken(req);
  const currentUser = await AuthService.getUserFromSession(db, sessionToken);

  // 3. AUTHENTICATION ENDPOINTS
  if (pathname === '/api/auth/register' && method === 'POST') {
    try {
      const body: any = await req.json();
      const clientIp = req.headers.get('cf-connecting-ip') || req.headers.get('x-forwarded-for') || '127.0.0.1';
      const result = await AuthService.register(db, {
        fullName: body.fullName,
        email: body.email,
        password: body.password,
        confirmPassword: body.confirmPassword,
        acceptedTerms: Boolean(body.acceptedTerms),
        clientIp
      });

      if (result.success && result.sessionToken) {
        const isHttps = url.protocol === 'https:';
        const cookieHeader = `mbx_session=${result.sessionToken}; Path=/; HttpOnly; SameSite=Lax; Max-Age=2592000${isHttps ? '; Secure' : ''}`;
        return jsonResponse(result, 201, { 'Set-Cookie': cookieHeader });
      }

      return jsonResponse(result, result.success ? 201 : 400);
    } catch (e: any) {
      return jsonResponse({ success: false, message: e?.message || 'Registration failed.' }, 400);
    }
  }

  
    // Real Name & Mobile Phone Authentication (Zero Google OAuth errors)
    if (pathname === '/api/auth/phone' && method === 'POST') {
      try {
        const body: any = await req.json();
        const clientIp = req.headers.get('cf-connecting-ip') || req.headers.get('x-forwarded-for') || '127.0.0.1';
        const result = await AuthService.loginOrRegisterWithPhone(db, {
          fullName: body.fullName || body.name || '',
          phone: body.phone || body.mobile || '',
          clientIp
        });
        if (result.success && result.sessionToken) {
          const isHttps = url.protocol === 'https:';
          const cookieHeader = `mbx_session=${result.sessionToken}; Path=/; HttpOnly; SameSite=Lax; Max-Age=2592000${isHttps ? '; Secure' : ''}`;
          return jsonResponse(result, 200, {
            'Set-Cookie': cookieHeader
          });
        }
        return jsonResponse(result, result.success ? 200 : 400);
      } catch (e: any) {
        return jsonResponse({ success: false, message: e?.message || 'Phone sign-in failed.' }, 400);
      }
    }

    if (pathname === '/api/auth/login' && method === 'POST') {
    try {
      const body: any = await req.json();
      const clientIp = req.headers.get('cf-connecting-ip') || req.headers.get('x-forwarded-for') || '127.0.0.1';
      const userAgent = req.headers.get('user-agent') || 'Unknown';
      const result = await AuthService.login(db, {
        email: body.email,
        password: body.password,
        clientIp,
        userAgent
      });

      if (!result.success || !result.sessionToken) {
        return jsonResponse(result, 401);
      }

      // Set HTTP-Only Cookie
      const isHttps = url.protocol === 'https:';
      const cookieHeader = `mbx_session=${result.sessionToken}; Path=/; HttpOnly; SameSite=Lax; Max-Age=2592000${isHttps ? '; Secure' : ''}`;

      return jsonResponse(result, 200, { 'Set-Cookie': cookieHeader });
    } catch (e: any) {
      return jsonResponse({ success: false, message: e?.message || 'Login failed.' }, 400);
    }
  }

  // 3.1 Google OAuth 2.0 PKCE Authorization URL
  if (pathname === '/api/auth/google/url' && method === 'GET') {
    const origin = url.origin;
    const result = await AuthService.createGoogleAuthUrl(db, {
      origin,
      envConfig: {
        GOOGLE_CLIENT_ID: env?.GOOGLE_CLIENT_ID,
        GOOGLE_CLIENT_SECRET: env?.GOOGLE_CLIENT_SECRET,
        GOOGLE_REDIRECT_URI: env?.GOOGLE_REDIRECT_URI,
        APP_URL: env?.APP_URL
      }
    });

    if (!result.success) {
      return jsonResponse(result, 503);
    }
    return jsonResponse(result, 200);
  }

  // 3.2 Google OAuth 2.0 Backend Callback
  if (pathname === '/api/auth/google/callback' && method === 'GET') {
    const errorParam = url.searchParams.get('error');
    if (errorParam) {
      return redirectResponse(`${url.origin}/?auth_error=${encodeURIComponent(errorParam)}`);
    }

    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');

    if (!code || !state) {
      return redirectResponse(`${url.origin}/?auth_error=missing_code_or_state`);
    }

    const clientIp = req.headers.get('cf-connecting-ip') || req.headers.get('x-forwarded-for') || '127.0.0.1';
    const userAgent = req.headers.get('user-agent') || 'Google OAuth Callback';

    const result = await AuthService.handleGoogleCallback(db, {
      code,
      state,
      clientIp,
      userAgent,
      origin: url.origin,
      envConfig: {
        GOOGLE_CLIENT_ID: env?.GOOGLE_CLIENT_ID,
        GOOGLE_CLIENT_SECRET: env?.GOOGLE_CLIENT_SECRET,
        GOOGLE_REDIRECT_URI: env?.GOOGLE_REDIRECT_URI,
        APP_URL: env?.APP_URL
      }
    });

    if (!result.success || !result.sessionToken) {
      const msg = encodeURIComponent(result.message || result.error || 'google_auth_failed');
      return redirectResponse(`${url.origin}/?auth_error=${msg}`);
    }

    const isHttps = url.protocol === 'https:';
    const cookieHeader = `mbx_session=${result.sessionToken}; Path=/; HttpOnly; SameSite=Lax; Max-Age=2592000${isHttps ? '; Secure' : ''}`;

    return redirectResponse(`${url.origin}/dashboard`, {
      'Set-Cookie': cookieHeader
    });
  }

  if (pathname === '/api/auth/google/quick' && method === 'POST') {
    try {
      const body: any = await req.json();
      const clientIp = req.headers.get('cf-connecting-ip') || req.headers.get('x-forwarded-for') || '127.0.0.1';
      const userAgent = req.headers.get('user-agent') || 'Google One-Click Client';
      const result = await AuthService.quickGoogleLogin(db, {
        email: body.email,
        name: body.name,
        avatarUrl: body.avatarUrl,
        clientIp,
        userAgent
      });

      if (!result.success || !result.sessionToken) {
        return jsonResponse(result, 400);
      }

      const isHttps = url.protocol === 'https:';
      const cookieHeader = `mbx_session=${result.sessionToken}; Path=/; HttpOnly; SameSite=Lax; Max-Age=2592000${isHttps ? '; Secure' : ''}`;

      return jsonResponse(result, 200, { 'Set-Cookie': cookieHeader });
    } catch (e: any) {
      return jsonResponse({ success: false, message: e?.message || 'Quick Google authentication failed.' }, 400);
    }
  }

  if (pathname === '/api/auth/google' && method === 'POST') {
    try {
      const body: any = await req.json();
      const clientIp = req.headers.get('cf-connecting-ip') || req.headers.get('x-forwarded-for') || '127.0.0.1';
      const userAgent = req.headers.get('user-agent') || 'Google Identity Client';
      const result = await AuthService.loginWithGoogle(db, {
        credential: body.credential,
        clientIp,
        userAgent
      });

      if (!result.success || !result.sessionToken) {
        return jsonResponse(result, 401);
      }

      const isHttps = url.protocol === 'https:';
      const cookieHeader = `mbx_session=${result.sessionToken}; Path=/; HttpOnly; SameSite=Lax; Max-Age=2592000${isHttps ? '; Secure' : ''}`;

      return jsonResponse(result, 200, { 'Set-Cookie': cookieHeader });
    } catch (e: any) {
      return jsonResponse({ success: false, message: e?.message || 'Google authentication failed.' }, 400);
    }
  }

  if (pathname === '/api/auth/logout' && method === 'POST') {
    await AuthService.logout(db, sessionToken);
    const clearCookie = 'mbx_session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0';
    return jsonResponse({ success: true, message: 'Logged out successfully.' }, 200, {
      'Set-Cookie': clearCookie
    });
  }

  if (pathname === '/api/auth/me' && method === 'GET') {
    if (!currentUser) {
      return jsonResponse({ success: false, message: 'Not authenticated.', user: null }, 401);
    }
    return jsonResponse({ success: true, user: currentUser });
  }

  if (pathname === '/api/auth/verify-email' && method === 'POST') {
    try {
      const body: any = await req.json();
      const email = body.email || currentUser?.email;
      const result = await AuthService.verifyEmail(db, { email, code: body.code });
      return jsonResponse(result, result.success ? 200 : 400);
    } catch (e: any) {
      return jsonResponse({ success: false, message: e?.message || 'Email verification failed.' }, 400);
    }
  }

  if (pathname === '/api/auth/resend-code' && method === 'POST') {
    try {
      const body: any = await req.json();
      const email = body.email || currentUser?.email;
      if (!email) return jsonResponse({ success: false, message: 'Email address is required.' }, 400);
      const result = await AuthService.resendVerification(db, email);
      return jsonResponse(result, result.success ? 200 : 400);
    } catch (e: any) {
      return jsonResponse({ success: false, message: e?.message || 'Failed to resend code.' }, 400);
    }
  }

  if (pathname === '/api/auth/forgot-password' && method === 'POST') {
    try {
      const body: any = await req.json();
      const result = await AuthService.forgotPassword(db, body.email);
      return jsonResponse(result, 200);
    } catch (e: any) {
      return jsonResponse({ success: false, message: e?.message || 'Forgot password failed.' }, 400);
    }
  }

  if (pathname === '/api/auth/reset-password' && method === 'POST') {
    try {
      const body: any = await req.json();
      const result = await AuthService.resetPassword(db, {
        token: body.token,
        newPassword: body.newPassword
      });
      return jsonResponse(result, result.success ? 200 : 400);
    } catch (e: any) {
      return jsonResponse({ success: false, message: e?.message || 'Reset password failed.' }, 400);
    }
  }

  // 4. QUIZ ENGINE ENDPOINTS
  if (pathname === '/api/quiz/schedule' && method === 'GET') {
    const schedule = await QuizService.getQuizSchedule(db);
    return jsonResponse({ success: true, schedule });
  }

  if (pathname === '/api/quiz/daily-status' && method === 'GET') {
    if (!currentUser) {
      return jsonResponse({ success: false, message: 'Authentication required.' }, 401);
    }
    const status = await QuizService.checkDailyStatus(db, currentUser.id);
    return jsonResponse({ success: true, ...status });
  }

  if (pathname === '/api/quiz/active-session' && method === 'GET') {
    if (!currentUser) {
      return jsonResponse({ success: false, message: 'Authentication required.' }, 401);
    }
    const sessionData = await QuizService.getActiveSession(db, currentUser.id);
    return jsonResponse({ success: true, ...sessionData });
  }

  if (pathname === '/api/quiz/start' && method === 'POST') {
    if (!currentUser) {
      return jsonResponse({ success: false, message: 'Authentication required to start a quiz.' }, 401);
    }
    try {
      const body: any = await req.json().catch(() => ({}));
      const mode = body.mode === 'practice' ? 'practice' : 'daily';
      const result = await QuizService.startQuiz(db, currentUser.id, mode);
      return jsonResponse(result, result.success ? 200 : 400);
    } catch (e: any) {
      return jsonResponse({ success: false, message: e?.message || 'Failed to start quiz.' }, 400);
    }
  }

  if (pathname === '/api/quiz/submit-answer' && method === 'POST') {
    if (!currentUser) {
      return jsonResponse({ success: false, message: 'Authentication required to submit answer.' }, 401);
    }
    try {
      const body: any = await req.json();
      const result = await QuizService.submitAnswer(db, currentUser.id, {
        sessionId: body.sessionId,
        questionId: body.questionId,
        selectedOptionIndex: Number(body.selectedOptionIndex)
      });
      return jsonResponse(result, result.success ? 200 : 400);
    } catch (e: any) {
      return jsonResponse({ success: false, message: e?.message || 'Failed to submit answer.' }, 400);
    }
  }

  // 5. LEADERBOARD ENDPOINTS
  if (pathname === '/api/leaderboard' && method === 'GET') {
    const mode = url.searchParams.get('mode') === 'weekly' ? 'weekly' : 'global';
    const limit = Math.min(50, Math.max(1, parseInt(url.searchParams.get('limit') || '10', 10)));
    const leaderboard = await LeaderboardService.getLeaderboard(db, mode, currentUser?.id, limit);
    return jsonResponse({ success: true, leaderboard });
  }

  // 6. REWARDS & REDEMPTION ENDPOINTS
  if (pathname === '/api/rewards/catalog' && method === 'GET') {
    const catalog = await RewardsService.getCatalog(db, currentUser?.id);
    return jsonResponse({ success: true, ...catalog });
  }

  if (pathname === '/api/rewards/redeem' && method === 'POST') {
    if (!currentUser) {
      return jsonResponse({ success: false, message: 'Authentication required to redeem rewards.' }, 401);
    }
    try {
      const body: any = await req.json();
      const result = await RewardsService.requestRedemption(db, currentUser.id, body.rewardId);
      return jsonResponse(result, result.success ? 201 : 400);
    } catch (e: any) {
      return jsonResponse({ success: false, message: e?.message || 'Redemption request failed.' }, 400);
    }
  }

  if (pathname === '/api/rewards/my-redemptions' && method === 'GET') {
    if (!currentUser) return jsonResponse({ success: false, message: 'Authentication required.' }, 401);
    const redemptions = await RewardsService.getUserRedemptions(db, currentUser.id);
    return jsonResponse({ success: true, redemptions });
  }

  if (pathname === '/api/rewards/my-subscriptions' && method === 'GET') {
    if (!currentUser) return jsonResponse({ success: false, message: 'Authentication required.' }, 401);
    const subscriptions = await RewardsService.getUserSubscriptions(db, currentUser.id);
    return jsonResponse({ success: true, subscriptions });
  }

  if (pathname === '/api/rewards/my-wallet' && method === 'GET') {
    if (!currentUser) return jsonResponse({ success: false, message: 'Authentication required.' }, 401);
    const transactions = await RewardsService.getUserWalletTransactions(db, currentUser.id);
    return jsonResponse({ success: true, transactions });
  }

  // 7. ADMIN ENDPOINTS
  if (pathname.startsWith('/api/admin/')) {
    // Check admin authorization: role === 'admin' or matching OwnerPanel password
    const adminKey = req.headers.get('x-admin-key') || '';
    const isAdminUser = currentUser?.role === 'admin';
    const isOwnerAuthorized = adminKey === 'deepmehta@mybooks' || adminKey === 'admin@mybooks' || adminKey === (env?.ADMIN_KEY || 'mybooksx2026');

    if (!isAdminUser && !isOwnerAuthorized) {
      return jsonResponse({ success: false, message: 'Unauthorized. Admin access required.' }, 403);
    }

    if (pathname === '/api/admin/leaderboard' && method === 'GET') {
      const leaderboardData = await LeaderboardService.getAdminLeaderboard(db);
      return jsonResponse({ success: true, ...leaderboardData });
    }

    if (pathname === '/api/admin/quiz/schedule' && method === 'POST') {
      try {
        const body: any = await req.json();
        const updated = await QuizService.updateQuizSchedule(db, {
          mode: body.mode,
          unlockTimeIst: body.unlockTimeIst,
          allowUnlimitedAttempts: body.allowUnlimitedAttempts
        });
        return jsonResponse({ success: true, schedule: updated });
      } catch (e: any) {
        return jsonResponse({ success: false, message: e?.message || 'Failed to update schedule.' }, 400);
      }
    }

    if (pathname === '/api/admin/quiz/reset-attempts' && method === 'POST') {
      try {
        const result = await QuizService.resetAllDailyAttempts(db);
        return jsonResponse(result, 200);
      } catch (e: any) {
        return jsonResponse({ success: false, message: e?.message || 'Failed to reset daily attempts.' }, 400);
      }
    }

    if (pathname === '/api/admin/redemptions' && method === 'GET') {
      const statusFilter = url.searchParams.get('status') || 'All';
      const redemptions = await RewardsService.getAllRedemptions(db, statusFilter);
      return jsonResponse({ success: true, redemptions });
    }

    if (pathname === '/api/admin/redemptions/approve' && method === 'POST') {
      try {
        const body: any = await req.json();
        const result = await RewardsService.approveRedemption(db, body.redemptionId, body.deliveryNotes);
        return jsonResponse(result, result.success ? 200 : 400);
      } catch (e: any) {
        return jsonResponse({ success: false, message: e?.message || 'Approval failed.' }, 400);
      }
    }

    if (pathname === '/api/admin/redemptions/reject' && method === 'POST') {
      try {
        const body: any = await req.json();
        const result = await RewardsService.rejectRedemption(db, body.redemptionId, body.reason);
        return jsonResponse(result, result.success ? 200 : 400);
      } catch (e: any) {
        return jsonResponse({ success: false, message: e?.message || 'Rejection failed.' }, 400);
      }
    }

    if (pathname === '/api/admin/questions' && method === 'GET') {
      const questions = await QuizService.getAllQuestions(db);
      return jsonResponse({ success: true, questions });
    }

    if (pathname === '/api/admin/questions' && method === 'POST') {
      try {
        const body: any = await req.json();
        const result = await QuizService.addQuestion(db, body);
        return jsonResponse(result, result.success ? 201 : 400);
      } catch (e: any) {
        return jsonResponse({ success: false, message: e?.message || 'Failed to add question.' }, 400);
      }
    }

    if (pathname.startsWith('/api/admin/questions/') && method === 'DELETE') {
      const id = pathname.replace('/api/admin/questions/', '');
      const result = await QuizService.deleteQuestion(db, id);
      return jsonResponse(result, result.success ? 200 : 400);
    }
  }

  return jsonResponse({ success: false, message: 'Route not found.' }, 404);
}
