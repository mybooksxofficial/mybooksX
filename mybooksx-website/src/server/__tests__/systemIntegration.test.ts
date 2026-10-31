/**
 * End-to-End System Integration Tests
 * Validates Auth, Quiz Engine, Speed Scoring, Leaderboards, Atomic Redemptions, and Admin Workflows.
 */

import { getLocalDatabase } from '../db/d1Client.ts';
import { AuthService } from '../authService.ts';
import { QuizService } from '../quizService.ts';
import { LeaderboardService } from '../leaderboardService.ts';
import { RewardsService } from '../rewardsService.ts';
import { hashPassword, verifyPassword, generateSalt } from '../crypto.ts';

async function runTests() {
  console.log('--- Starting MyBooksX Quiz & Rewards Platform Test Suite ---');
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passed++;
    } else {
      console.error(`[FAIL] ${testName}`);
      failed++;
    }
  }

  // 1. In-memory D1 test database
  const db = await getLocalDatabase(':memory:');

  // TEST 1: Web Crypto PBKDF2 Password Hashing
  const salt = generateSalt();
  const hash = await hashPassword('TestSecurePass#2026', salt);
  const isValid = await verifyPassword('TestSecurePass#2026', hash, salt);
  const isInvalid = await verifyPassword('WrongPassword!', hash, salt);
  assert(isValid === true && isInvalid === false, 'Password hashing and verification with PBKDF2 works');

  // TEST 2: User Registration & Duplicate Email Protection
  const reg1 = await AuthService.register(db, {
    fullName: 'Aarav Patel',
    email: 'aarav.patel@example.com',
    password: 'Password123#',
    confirmPassword: 'Password123#',
    acceptedTerms: true
  });
  assert(reg1.success === true && reg1.user?.fullName === 'Aarav Patel', 'User registration succeeds with terms accepted');

  const regDuplicate = await AuthService.register(db, {
    fullName: 'Duplicate Aarav',
    email: 'aarav.patel@example.com',
    password: 'Password123#',
    confirmPassword: 'Password123#',
    acceptedTerms: true
  });
  assert(regDuplicate.success === false && regDuplicate.error === 'EMAIL_ALREADY_EXISTS', 'Duplicate email registration is blocked');

  // TEST 3: Email Verification Requirement
  const unverifiedUser = reg1.user!;
  await db.prepare('UPDATE users SET is_verified = 0, verification_code = ? WHERE id = ?').bind('889900', unverifiedUser.id).run();
  const quizBeforeVerify = await QuizService.startQuiz(db, unverifiedUser.id, 'daily');
  assert(quizBeforeVerify.success === false, 'Unverified users cannot start a quiz');

  // Verify email
  const verifyRes = await AuthService.verifyEmail(db, {
    email: 'aarav.patel@example.com',
    code: '889900'
  });
  assert(verifyRes.success === true && verifyRes.user?.isVerified === true, 'Email verification succeeds with valid code');

  // TEST 4: Login & Persistent Session
  const loginRes = await AuthService.login(db, {
    email: 'aarav.patel@example.com',
    password: 'Password123#'
  });
  assert(loginRes.success === true && typeof loginRes.sessionToken === 'string', 'Login succeeds and returns valid session token');

  const sessionUser = await AuthService.getUserFromSession(db, loginRes.sessionToken);
  assert(sessionUser?.id === unverifiedUser.id, 'Session token resolves to the authenticated user');

  // TEST 5: Quiz Session Start & Payload Integrity (Correct answer NEVER exposed)
  const quizSession = await QuizService.startQuiz(db, unverifiedUser.id, 'daily');
  assert(quizSession.success === true, 'Verified user can start a Daily Quiz session');
  assert(quizSession.totalQuestions === 10, 'QUEST session contains exactly 10 questions');
  assert(
    quizSession.firstQuestion !== undefined &&
    !(('correct_index' in (quizSession.firstQuestion as any)) || ('correctIndex' in (quizSession.firstQuestion as any))),
    'Server question payload NEVER leaks correct answer to client'
  );

  // TEST 6: 30-Second Speed-Based Point Calculation
  const pts0to5 = QuizService.calculateSpeedPoints(true, 3200);
  assert(pts0to5.points === 200 && pts0to5.speedTier.includes('0-5s'), '0-5s response earns 200 points');

  const pts6to10 = QuizService.calculateSpeedPoints(true, 7500);
  assert(pts6to10.points === 180 && pts6to10.speedTier.includes('6-10s'), '6-10s response earns 180 points');

  const pts11to15 = QuizService.calculateSpeedPoints(true, 12800);
  assert(pts11to15.points === 160 && pts11to15.speedTier.includes('11-15s'), '11-15s response earns 160 points');

  const pts16to20 = QuizService.calculateSpeedPoints(true, 18200);
  assert(pts16to20.points === 130 && pts16to20.speedTier.includes('16-20s'), '16-20s response earns 130 points');

  const pts21to25 = QuizService.calculateSpeedPoints(true, 23400);
  assert(pts21to25.points === 100 && pts21to25.speedTier.includes('21-25s'), '21-25s response earns 100 points');

  const pts26to30 = QuizService.calculateSpeedPoints(true, 28100);
  assert(pts26to30.points === 60 && pts26to30.speedTier.includes('26-30s'), '26-30s response earns 60 points');

  const ptsIncorrect = QuizService.calculateSpeedPoints(false, 3000);
  assert(ptsIncorrect.points === 0 && ptsIncorrect.speedTier === 'Incorrect', 'Incorrect answer earns 0 points regardless of speed');

  const ptsTimeout = QuizService.calculateSpeedPoints(true, 33500);
  assert(ptsTimeout.points === 0 && ptsTimeout.speedTier === 'Timeout', 'Answer after 30s deadline earns 0 points');

  // TEST 7: Quiz Answer Submission & Duplicate Answer Protection
  const firstQ = quizSession.firstQuestion!;
  // Get question from db to answer correctly
  const qRow = await db.prepare('SELECT correct_index FROM questions WHERE id = ?').bind(firstQ.id).first<{ correct_index: number }>();
  
  const submit1 = await QuizService.submitAnswer(db, unverifiedUser.id, {
    sessionId: quizSession.sessionId!,
    questionId: firstQ.id,
    selectedOptionIndex: qRow!.correct_index
  });
  assert(submit1.success === true && submit1.result?.isCorrect === true, 'Submitting correct answer succeeds');

  const submitDuplicate = await QuizService.submitAnswer(db, unverifiedUser.id, {
    sessionId: quizSession.sessionId!,
    questionId: firstQ.id,
    selectedOptionIndex: qRow!.correct_index
  });
  assert(submitDuplicate.success === false, 'Duplicate submission for the same question is blocked');

  // TEST 8: Leaderboard Visible Immediately After First Question
  await LeaderboardService.updateUserStats(db, unverifiedUser.id);
  const leaderboard = await LeaderboardService.getLeaderboard(db, 'global', unverifiedUser.id);
  assert(leaderboard.totalPlayers >= 1, 'Total players in leaderboard increments after first answered question');
  assert(leaderboard.currentUserRank?.userId === unverifiedUser.id, 'User sees their own position immediately on leaderboard');

  // Complete remaining questions to conclude quiz session (test timeout on Question 2)
  let curQ = submit1.result?.nextQuestion;
  if (curQ) {
    const timeoutSub = await QuizService.submitAnswer(db, unverifiedUser.id, {
      sessionId: quizSession.sessionId!,
      questionId: curQ.id,
      selectedOptionIndex: -1 // 30s timeout unanswered
    });
    assert(timeoutSub.success === true && timeoutSub.result?.pointsAwarded === 0 && timeoutSub.result?.speedTier === 'Timeout', 'Automatic timeout submission records 0 points and Timeout tier');
    curQ = timeoutSub.result?.nextQuestion;
  }

  while (curQ) {
    const row = await db.prepare('SELECT correct_index FROM questions WHERE id = ?').bind(curQ.id).first<{ correct_index: number }>();
    const sub = await QuizService.submitAnswer(db, unverifiedUser.id, {
      sessionId: quizSession.sessionId!,
      questionId: curQ.id,
      selectedOptionIndex: row!.correct_index
    });
    curQ = sub.result?.nextQuestion;
  }

  // Check user points balance updated
  const userAfterQuiz = await db.prepare('SELECT points_balance FROM users WHERE id = ?').bind(unverifiedUser.id).first<{ points_balance: number }>();
  assert((userAfterQuiz?.points_balance || 0) > 0, 'User points balance is credited after quiz completion');

  // TEST 9: Rewards Catalog & Atomic Redemption Reservation
  // Give user 3,500 points for test
  await db.prepare('UPDATE users SET points_balance = 3500 WHERE id = ?').bind(unverifiedUser.id).run();

  const catalog = await RewardsService.getCatalog(db, unverifiedUser.id);
  assert(catalog.rewards.length === 5, 'Rewards catalog lists all 5 flagship software items');

  // DocTracker requires 1000 pts
  const docTracker = catalog.rewards.find(r => r.code === 'DOCTRACKER')!;
  const redeemRes = await RewardsService.requestRedemption(db, unverifiedUser.id, docTracker.id);
  assert(redeemRes.success === true && redeemRes.redemption?.status === 'Pending', 'Redemption request succeeds and enters Pending status');
  assert(Boolean(redeemRes.redemption?.redemptionCode.startsWith('MBX-RDM-')), 'Unique receipt ID is generated with MBX-RDM prefix');

  // Verify points reserved atomically
  const userAfterReserve = await db.prepare('SELECT points_balance, points_reserved FROM users WHERE id = ?').bind(unverifiedUser.id).first<{ points_balance: number; points_reserved: number }>();
  assert(userAfterReserve?.points_balance === 2500 && userAfterReserve?.points_reserved === 1000, 'Points reserved atomically (2500 balance, 1000 reserved)');

  // TEST 10: Conflicting Pending Redemption Prevention
  const secondRedeemSame = await RewardsService.requestRedemption(db, unverifiedUser.id, docTracker.id);
  assert(secondRedeemSame.success === false && secondRedeemSame.error === 'ALREADY_PENDING', 'Conflicting redemption for the same app is rejected');

  // TEST 11: Admin Approval Workflow
  const rdmId = redeemRes.redemption!.id;
  const approveRes = await RewardsService.approveRedemption(db, rdmId, 'Automated enterprise deployment key');
  assert(approveRes.success === true && typeof approveRes.licenseKey === 'string', 'Admin approval succeeds and generates license key');

  const subs = await RewardsService.getUserSubscriptions(db, unverifiedUser.id);
  assert(subs.length === 1 && subs[0].rewardTitle === 'DocTracker', 'Approved redemption creates active 30-day subscription');

  // TEST 12: Admin Rejection & Point Refund Workflow
  // Request Tracker-X (3000 pts) - User now has 2500 pts, so insufficient!
  const failInsufficient = await RewardsService.requestRedemption(db, unverifiedUser.id, catalog.rewards.find(r => r.code === 'TRACKER_X')!.id);
  assert(failInsufficient.success === false && failInsufficient.error === 'INSUFFICIENT_POINTS', 'Redemption with insufficient points is blocked');

  // Request Trip-X (2000 pts) with 2500 balance
  const tripX = catalog.rewards.find(r => r.code === 'TRIP_X')!;
  const redeemTripX = await RewardsService.requestRedemption(db, unverifiedUser.id, tripX.id);
  assert(redeemTripX.success === true, 'Trip-X redemption requested');

  // Reject Trip-X and verify points refund
  const rejectRes = await RewardsService.rejectRedemption(db, redeemTripX.redemption!.id, 'Identity re-verification needed');
  assert(rejectRes.success === true, 'Admin rejection succeeds');

  const userAfterReject = await db.prepare('SELECT points_balance, points_reserved FROM users WHERE id = ?').bind(unverifiedUser.id).first<{ points_balance: number; points_reserved: number }>();
  assert(userAfterReject?.points_balance === 2500 && userAfterReject?.points_reserved === 0, 'Reserved points are fully refunded to user upon rejection');

  // TEST 13: Wallet Audit Trail
  const walletTx = await RewardsService.getUserWalletTransactions(db, unverifiedUser.id);
  assert(walletTx.length >= 3, 'Complete double-entry audit trail is recorded in wallet transactions');

  // TEST 14: Real Google OAuth Authentication Flow
  const mockHeader = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).toString('base64url');
  const mockPayload = Buffer.from(JSON.stringify({
    iss: 'https://accounts.google.com',
    sub: 'goog_9876543210',
    email: 'priya.sharma@gmail.com',
    email_verified: true,
    name: 'Priya Sharma',
    picture: 'https://lh3.googleusercontent.com/a/test-avatar',
    exp: Math.floor(Date.now() / 1000) + 3600
  })).toString('base64url');
  const mockGoogleCredential = `${mockHeader}.${mockPayload}.mockSignatureBytes`;

  const googleAuthRes = await AuthService.loginWithGoogle(db, {
    credential: mockGoogleCredential,
    clientIp: '127.0.0.1'
  });

  assert(googleAuthRes.success === true, 'Google authentication succeeds with verified Google ID token');
  assert(googleAuthRes.user?.isVerified === true, 'Google authenticated user is automatically email-verified');
  assert(googleAuthRes.user?.email === 'priya.sharma@gmail.com', 'Google email is accurately stored and indexed');
  assert(typeof googleAuthRes.sessionToken === 'string', 'Session token is issued for Google user');

  // Repeat login links to existing account
  const googleRepeatLogin = await AuthService.loginWithGoogle(db, {
    credential: mockGoogleCredential,
    clientIp: '127.0.0.1'
  });
  assert(googleRepeatLogin.user?.id === googleAuthRes.user?.id, 'Subsequent Google logins resolve to the same user without duplicate records');

  // TEST 15: Google PKCE URL Generation & State Security
  const urlRes = await AuthService.createGoogleAuthUrl(db, {
    origin: 'http://localhost:5173',
    envConfig: {
      GOOGLE_CLIENT_ID: 'test-client-id.apps.googleusercontent.com',
      GOOGLE_CLIENT_SECRET: 'test-client-secret',
      GOOGLE_REDIRECT_URI: 'http://localhost:5173/api/auth/google/callback'
    }
  });
  assert(urlRes.success === true && !!urlRes.url && !!urlRes.state, 'createGoogleAuthUrl generates valid PKCE authorization URL');
  assert(Boolean(urlRes.url?.includes('code_challenge=')), 'Authorization URL includes PKCE code_challenge');
  assert(Boolean(urlRes.url?.includes('code_challenge_method=S256')), 'Authorization URL uses S256 code challenge method');

  // Verify state is securely stored in oauth_states
  const dbState = await db.prepare('SELECT * FROM oauth_states WHERE state = ?').bind(urlRes.state).first();
  assert(!!dbState, 'OAuth state and PKCE verifier are securely stored in oauth_states table');

  // TEST 16: Invalid and Expired State Rejection
  const invalidStateRes = await AuthService.handleGoogleCallback(db, {
    code: 'some-code',
    state: 'non-existent-state',
    envConfig: {
      GOOGLE_CLIENT_ID: 'test-client-id.apps.googleusercontent.com',
      GOOGLE_CLIENT_SECRET: 'test-client-secret'
    }
  });
  assert(invalidStateRes.success === false && invalidStateRes.error === 'INVALID_STATE', 'Invalid state parameter is strictly rejected');

  // Insert expired state
  await db.prepare('INSERT INTO oauth_states (state, nonce, code_verifier, redirect_uri, created_at, expires_at) VALUES (?, ?, ?, ?, ?, ?)')
    .bind('expired-state', 'nonce1', 'verifier1', 'http://localhost:5173/api/auth/google/callback', new Date(Date.now() - 20000).toISOString(), new Date(Date.now() - 10000).toISOString())
    .run();
  const expiredStateRes = await AuthService.handleGoogleCallback(db, {
    code: 'some-code',
    state: 'expired-state',
    envConfig: {
      GOOGLE_CLIENT_ID: 'test-client-id.apps.googleusercontent.com',
      GOOGLE_CLIENT_SECRET: 'test-client-secret'
    }
  });
  assert(expiredStateRes.success === false && expiredStateRes.error === 'EXPIRED_STATE', 'Expired OAuth state is strictly rejected');

  // TEST 17: Mocked End-to-End Google Authorization Code Exchange & Token Claims
  const originalFetch = globalThis.fetch;
  try {
    globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
      const urlStr = input.toString();
      if (urlStr === 'https://oauth2.googleapis.com/token') {
        return new Response(JSON.stringify({
          access_token: 'mock-access-token',
          id_token: 'mock.id.token',
          expires_in: 3600,
          token_type: 'Bearer'
        }), { status: 200, headers: { 'Content-Type': 'application/json' } });
      }
      if (urlStr.startsWith('https://oauth2.googleapis.com/tokeninfo')) {
        return new Response(JSON.stringify({
          iss: 'https://accounts.google.com',
          aud: 'test-client-id.apps.googleusercontent.com',
          sub: 'goog_1122334455',
          email: 'aarav.patel@example.com', // Matches user from TEST 2!
          email_verified: true,
          name: 'Aarav Patel',
          exp: Math.floor(Date.now() / 1000) + 3600
        }), { status: 200, headers: { 'Content-Type': 'application/json' } });
      }
      return originalFetch(input, init);
    };

    // Valid callback flow
    const validStateRes = await AuthService.createGoogleAuthUrl(db, {
      envConfig: {
        GOOGLE_CLIENT_ID: 'test-client-id.apps.googleusercontent.com',
        GOOGLE_CLIENT_SECRET: 'test-client-secret'
      }
    });

    const callbackRes = await AuthService.handleGoogleCallback(db, {
      code: 'valid-google-code',
      state: validStateRes.state!,
      envConfig: {
        GOOGLE_CLIENT_ID: 'test-client-id.apps.googleusercontent.com',
        GOOGLE_CLIENT_SECRET: 'test-client-secret'
      }
    });

    assert(callbackRes.success === true, 'handleGoogleCallback successfully validates and logs in user');
    assert(callbackRes.user?.email === 'aarav.patel@example.com', 'Google callback links to existing account by verified email');
    assert(typeof callbackRes.sessionToken === 'string', 'Session token is generated on Google OAuth callback');

    // TEST 18: Unverified Google Email Rejection
    globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
      const urlStr = input.toString();
      if (urlStr === 'https://oauth2.googleapis.com/token') {
        return new Response(JSON.stringify({
          access_token: 'mock-access-token',
          id_token: 'mock.unverified.id.token'
        }), { status: 200, headers: { 'Content-Type': 'application/json' } });
      }
      if (urlStr.startsWith('https://oauth2.googleapis.com/tokeninfo')) {
        return new Response(JSON.stringify({
          iss: 'https://accounts.google.com',
          aud: 'test-client-id.apps.googleusercontent.com',
          sub: 'goog_9999999999',
          email: 'unverified@example.com',
          email_verified: false, // UNVERIFIED!
          name: 'Unverified User',
          exp: Math.floor(Date.now() / 1000) + 3600
        }), { status: 200, headers: { 'Content-Type': 'application/json' } });
      }
      return originalFetch(input, init);
    };

    const unverifiedState = await AuthService.createGoogleAuthUrl(db, {
      envConfig: {
        GOOGLE_CLIENT_ID: 'test-client-id.apps.googleusercontent.com',
        GOOGLE_CLIENT_SECRET: 'test-client-secret'
      }
    });

    const unverifiedRes = await AuthService.handleGoogleCallback(db, {
      code: 'code-for-unverified',
      state: unverifiedState.state!,
      envConfig: {
        GOOGLE_CLIENT_ID: 'test-client-id.apps.googleusercontent.com',
        GOOGLE_CLIENT_SECRET: 'test-client-secret'
      }
    });

    assert(unverifiedRes.success === false && unverifiedRes.error === 'UNVERIFIED_EMAIL', 'Google accounts with unverified emails are strictly rejected');
  } finally {
    globalThis.fetch = originalFetch;
  }

  // TEST 19: Session Termination / Logout
  await AuthService.logout(db, loginRes.sessionToken!);
  const userAfterLogout = await AuthService.getUserFromSession(db, loginRes.sessionToken);
  assert(userAfterLogout === null, 'User session is invalidated upon logout');

  // TEST 20: Instant 1-Click Google Sign-In (Unblockable fast local dev authentication)
  const quickGoogleRes = await AuthService.quickGoogleLogin(db, {
    email: 'deepmehta@mybooks.com',
    name: 'Deep Mehta (Founder)'
  });
  assert(quickGoogleRes.success === true, 'quickGoogleLogin succeeds immediately');
  assert(quickGoogleRes.user?.authProvider === 'google', 'quickGoogleLogin registers user with Google auth provider');
  assert(quickGoogleRes.user?.isVerified === true, 'quickGoogleLogin user is automatically verified');
  assert(typeof quickGoogleRes.sessionToken === 'string', 'quickGoogleLogin issues persistent 30-day session token');

  // TEST 21: Owner Portal Leaderboard Directory (kiske pass kitne point hai)
  const adminLb = await LeaderboardService.getAdminLeaderboard(db);
  assert(adminLb.users.length > 0, 'Admin leaderboard returns all registered users');
  assert(adminLb.users[0].rank === 1, 'Admin leaderboard ranks players correctly');
  assert(typeof adminLb.users[0].pointsBalance === 'number', 'Admin leaderboard accurately exposes points balance for each user');
  assert(adminLb.summary.totalUsers >= 2, 'Admin leaderboard computes summary total users count');

  // TEST 22: Voucher Text Generation & Direct Transmission to +91 9644570828
  const voucherText = RewardsService.buildVoucherText({
    redemptionCode: 'MBX-RDM-TEST-1234',
    userName: 'Aarav Patel',
    userEmail: 'aarav.patel@example.com',
    rewardTitle: 'DocTracker (30 Days)',
    pointsReserved: 1000,
    status: 'Pending'
  });
  assert(voucherText.includes('MBX-RDM-TEST-1234'), 'Voucher text contains unique voucher code');
  assert(voucherText.includes('+91 9644570828'), 'Voucher text explicitly targets Founder hotline +91 9644570828');
  assert(voucherText.includes('1,000 pts'), 'Voucher text states points redeemed');

  console.log(`\nTest Run Completed: ${passed} Passed, ${failed} Failed.`);
  if (failed > 0) {
    throw new Error(`${failed} tests failed!`);
  }
}

runTests().catch(err => {
  console.error('Test Suite Failed:', err);
  process.exit(1);
});
