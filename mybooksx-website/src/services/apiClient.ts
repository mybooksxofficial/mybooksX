/**
 * Strongly Typed MyBooksX Client API Service
 * Handles HTTP requests, cookie credentials, bearer token fallback, and API error formatting.
 */

import type { PublicUser } from '../server/authService.ts';
import type { ClientQuestion, AnswerSubmissionResult } from '../server/quizService.ts';
import type { LeaderboardResponse } from '../server/leaderboardService.ts';
import type {
  RewardItem,
  RedemptionRecord,
  ActiveSubscriptionRecord,
  WalletTransactionRecord
} from '../server/rewardsService.ts';

// In-memory token storage (also saved to sessionStorage for cross-tab persistence)
let memoryToken: string | null = null;
try {
  memoryToken = sessionStorage.getItem('mbx_auth_token');
} catch {
  // Ignore
}

export function setClientAuthToken(token: string | null) {
  memoryToken = token;
  try {
    if (token) {
      sessionStorage.setItem('mbx_auth_token', token);
    } else {
      sessionStorage.removeItem('mbx_auth_token');
    }
  } catch {
    // Ignore
  }
}

export function getClientAuthToken(): string | null {
  return memoryToken;
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {})
  };

  const token = getClientAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Pass Owner Portal key if admin
  try {
    const adminKey = sessionStorage.getItem('mybooksx_owner_key');
    if (adminKey) {
      headers['x-admin-key'] = adminKey;
    }
  } catch {
    // Ignore
  }

  const response = await fetch(endpoint, {
    ...options,
    headers,
    credentials: 'include' // include cookies
  });

  const data = await response.json().catch(() => ({
    success: false,
    message: 'Invalid server response'
  }));

  if (!response.ok && data.success !== false) {
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }

  return data as T;
}

export const api = {
  auth: {
    async register(params: {
      fullName: string;
      email: string;
      password: string;
      confirmPassword?: string;
      acceptedTerms: boolean;
    }) {
      const res = await request<{
        success: boolean;
        message: string;
        sessionToken?: string;
        user?: PublicUser;
        verificationCode?: string;
        error?: string;
      }>('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(params)
      });
      if (res.sessionToken) {
        setClientAuthToken(res.sessionToken);
      }
      return res;
    },

    async login(params: { email: string; password: string }) {
      const res = await request<{
        success: boolean;
        message: string;
        sessionToken?: string;
        user?: PublicUser;
        error?: string;
      }>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(params)
      });
      if (res.sessionToken) {
        setClientAuthToken(res.sessionToken);
      }
      return res;
    },

    async getGoogleAuthUrl() {
      return request<{
        success: boolean;
        url?: string;
        state?: string;
        error?: string;
        message?: string;
      }>('/api/auth/google/url', {
        method: 'GET'
      });
    },

    
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

    async quickGoogleLogin(params: { email: string; name?: string; avatarUrl?: string }) {
      const res = await request<{
        success: boolean;
        message: string;
        sessionToken?: string;
        user?: PublicUser;
        error?: string;
      }>('/api/auth/google/quick', {
        method: 'POST',
        body: JSON.stringify(params)
      });
      if (res.sessionToken) {
        setClientAuthToken(res.sessionToken);
      }
      return res;
    },

    async googleLogin(credential: string) {
      const res = await request<{
        success: boolean;
        message: string;
        sessionToken?: string;
        user?: PublicUser;
        error?: string;
      }>('/api/auth/google', {
        method: 'POST',
        body: JSON.stringify({ credential })
      });
      if (res.sessionToken) {
        setClientAuthToken(res.sessionToken);
      }
      return res;
    },

    async logout() {
      const res = await request<{ success: boolean; message: string }>('/api/auth/logout', {
        method: 'POST'
      });
      setClientAuthToken(null);
      return res;
    },

    async getMe() {
      return request<{ success: boolean; user: PublicUser | null }>('/api/auth/me', {
        method: 'GET'
      });
    },

    async verifyEmail(params: { email?: string; code: string }) {
      return request<{ success: boolean; message: string; user?: PublicUser; error?: string }>(
        '/api/auth/verify-email',
        {
          method: 'POST',
          body: JSON.stringify(params)
        }
      );
    },

    async resendCode(email?: string) {
      return request<{ success: boolean; message: string; verificationCode?: string }>(
        '/api/auth/resend-code',
        {
          method: 'POST',
          body: JSON.stringify({ email })
        }
      );
    },

    async forgotPassword(email: string) {
      return request<{ success: boolean; message: string; resetToken?: string }>(
        '/api/auth/forgot-password',
        {
          method: 'POST',
          body: JSON.stringify({ email })
        }
      );
    },

    async resetPassword(params: { token: string; newPassword: string }) {
      return request<{ success: boolean; message: string; error?: string }>(
        '/api/auth/reset-password',
        {
          method: 'POST',
          body: JSON.stringify(params)
        }
      );
    }
  },

  quiz: {
    async getSchedule() {
      return request<{
        success: boolean;
        schedule: {
          mode: 'always_live' | 'scheduled';
          unlockTimeIst: string;
          allowUnlimitedAttempts: boolean;
          isLiveNow: boolean;
          nextUnlockIso?: string;
          remainingSeconds: number;
          currentIstTime?: string;
        };
      }>('/api/quiz/schedule');
    },

    async getDailyStatus() {
      return request<{
        success: boolean;
        canPlayDaily: boolean;
        lastCompletedAt?: string;
        nextAvailableAt?: string;
        todayPointsEarned: number;
        isLockedByTime?: boolean;
        timeRemainingSeconds?: number;
        schedule?: {
          mode: 'always_live' | 'scheduled';
          unlockTimeIst: string;
          allowUnlimitedAttempts: boolean;
          isLiveNow: boolean;
          remainingSeconds: number;
        };
      }>('/api/quiz/daily-status');
    },

    async getActiveSession() {
      return request<{
        success: boolean;
        hasActiveSession: boolean;
        hasCompletedToday: boolean;
        session?: {
          id: string;
          mode: 'daily' | 'practice';
          currentQuestionIndex: number;
          totalQuestions: number;
          score: number;
          totalPoints: number;
          currentQuestion: ClientQuestion;
          startedAt: string;
        };
        completedSession?: {
          id: string;
          score: number;
          totalPoints: number;
          totalQuestions: number;
          correctAnswers?: number;
          incorrectAnswers?: number;
          accuracyPct: number;
          completedAt: string;
        };
      }>('/api/quiz/active-session');
    },

    async startQuiz(mode: 'daily' | 'practice' = 'daily') {
      return request<{
        success: boolean;
        message: string;
        sessionId?: string;
        mode?: 'daily' | 'practice';
        totalQuestions?: number;
        firstQuestion?: ClientQuestion;
      }>('/api/quiz/start', {
        method: 'POST',
        body: JSON.stringify({ mode })
      });
    },

    async submitAnswer(params: {
      sessionId: string;
      questionId: string;
      selectedOptionIndex: number;
    }) {
      return request<{
        success: boolean;
        message: string;
        result?: AnswerSubmissionResult;
      }>('/api/quiz/submit-answer', {
        method: 'POST',
        body: JSON.stringify(params)
      });
    }
  },

  leaderboard: {
    async getLeaderboard(mode: 'global' | 'weekly' = 'global', limit = 10) {
      return request<{
        success: boolean;
        leaderboard: LeaderboardResponse;
      }>(`/api/leaderboard?mode=${mode}&limit=${limit}`);
    }
  },

  rewards: {
    async getCatalog() {
      return request<{
        success: boolean;
        rewards: RewardItem[];
        userBalance: number;
        userReserved: number;
      }>('/api/rewards/catalog');
    },

    async redeem(rewardId: string) {
      return request<{
        success: boolean;
        message: string;
        redemption?: RedemptionRecord;
        error?: string;
      }>('/api/rewards/redeem', {
        method: 'POST',
        body: JSON.stringify({ rewardId })
      });
    },

    async getMyRedemptions() {
      return request<{
        success: boolean;
        redemptions: RedemptionRecord[];
      }>('/api/rewards/my-redemptions');
    },

    async getMySubscriptions() {
      return request<{
        success: boolean;
        subscriptions: ActiveSubscriptionRecord[];
      }>('/api/rewards/my-subscriptions');
    },

    async getMyWallet() {
      return request<{
        success: boolean;
        transactions: WalletTransactionRecord[];
      }>('/api/rewards/my-wallet');
    }
  },

  admin: {
    async getLeaderboard() {
      return request<{
        success: boolean;
        users: Array<{
          rank: number;
          userId: string;
          fullName: string;
          email: string;
          authProvider: string;
          isVerified: boolean;
          pointsBalance: number;
          pointsReserved: number;
          lifetimePoints: number;
          quizzesPlayed: number;
          totalCorrect: number;
          redemptionsCount: number;
          createdAt: string;
        }>;
        summary: {
          totalUsers: number;
          totalPointsCirculating: number;
          totalPointsReserved: number;
          totalPointsLifetime: number;
          topScorerName: string;
          topScore: number;
        };
      }>('/api/admin/leaderboard');
    },

    async getRedemptions(status = 'All') {
      return request<{
        success: boolean;
        redemptions: RedemptionRecord[];
      }>(`/api/admin/redemptions?status=${encodeURIComponent(status)}`);
    },

    async approveRedemption(redemptionId: string, deliveryNotes?: string) {
      return request<{
        success: boolean;
        message: string;
        licenseKey?: string;
      }>('/api/admin/redemptions/approve', {
        method: 'POST',
        body: JSON.stringify({ redemptionId, deliveryNotes })
      });
    },

    async rejectRedemption(redemptionId: string, reason: string) {
      return request<{
        success: boolean;
        message: string;
      }>('/api/admin/redemptions/reject', {
        method: 'POST',
        body: JSON.stringify({ redemptionId, reason })
      });
    },

    async getQuestions() {
      return request<{
        success: boolean;
        questions: any[];
      }>('/api/admin/questions');
    },

    async addQuestion(questionData: any) {
      return request<{
        success: boolean;
        message: string;
        id?: string;
      }>('/api/admin/questions', {
        method: 'POST',
        body: JSON.stringify(questionData)
      });
    },

    async deleteQuestion(id: string) {
      return request<{
        success: boolean;
        message: string;
      }>(`/api/admin/questions/${encodeURIComponent(id)}`, {
        method: 'DELETE'
      });
    },

    async updateQuizSchedule(params: {
      mode?: 'always_live' | 'scheduled';
      unlockTimeIst?: string;
      allowUnlimitedAttempts?: boolean;
    }) {
      return request<{
        success: boolean;
        schedule: any;
        message?: string;
      }>('/api/admin/quiz/schedule', {
        method: 'POST',
        body: JSON.stringify(params)
      });
    },

    async resetQuizAttempts() {
      return request<{
        success: boolean;
        clearedCount: number;
        message: string;
      }>('/api/admin/quiz/reset-attempts', {
        method: 'POST'
      });
    }
  }
};

