/**
 * QUEST Engine & Speed-Based Point System
 * Implements server-authoritative scoring, timer verification, anti-cheat, and question management.
 */

import type { D1DatabaseLike } from './db/d1Client.ts';
import { LeaderboardService } from './leaderboardService.ts';
import { sanitize } from './crypto.ts';

export interface QuizScheduleConfig {
  mode: 'always_live' | 'scheduled';
  unlockTimeIst: string; // "HH:MM" e.g. "14:00"
  allowUnlimitedAttempts: boolean;
  isLiveNow: boolean;
  nextUnlockIso?: string;
  remainingSeconds: number;
  currentIstTime?: string;
}

export interface QuestionRow {
  id: string;
  question: string;
  category: string;
  difficulty: string;
  options_json: string;
  correct_index: number;
  explanation?: string;
  is_active: number;
  created_at: string;
  updated_at: string;
}

export interface ClientQuestion {
  id: string;
  question: string;
  category: string;
  difficulty: string;
  options: string[];
  questionIndex: number;
  totalQuestions: number;
  startedAt: string;
  questStartedAt?: string;
  totalQuestDurationSeconds?: number;
  questionDurationSeconds?: number;
  overallRemainingSeconds?: number;
  questionRemainingSeconds?: number;
  // Note: NEVER include correct_index or explanation in client question payload
}

export interface AnswerSubmissionResult {
  isCorrect: boolean;
  pointsAwarded: number;
  responseTimeMs: number;
  speedTier:
    | '0-5s (Lightning)'
    | '6-10s (Fast)'
    | '11-15s (Great)'
    | '16-20s (Good)'
    | '21-25s (Steady)'
    | '26-30s (Clutch)'
    | 'Timeout'
    | 'Incorrect'
    | string;
  currentScore: number;
  totalPointsEarnedInQuiz: number;
  isQuizCompleted: boolean;
  nextQuestion?: ClientQuestion | null;
  quizSummary?: {
    totalQuestions: number;
    questionsAnswered: number;
    correctAnswers: number;
    incorrectAnswers: number;
    score: number;
    pointsEarned: number;
    accuracyPct: number;
    mode: 'daily' | 'practice';
  };
}

export class QuizService {
  /**
   * Calculate points strictly according to server-measured response time:
   * 0–5 seconds: 200 points
   * 6–10 seconds: 180 points
   * 11–15 seconds: 160 points
   * 16–20 seconds: 130 points
   * 21–25 seconds: 100 points
   * 26–30 seconds: 60 points
   * Incorrect answer: 0 points
   * Timeout (>30s or unanswered): 0 points
   */
  static calculateSpeedPoints(isCorrect: boolean, responseTimeMs: number): {
    points: number;
    speedTier: AnswerSubmissionResult['speedTier'];
  } {
    if (!isCorrect) {
      return { points: 0, speedTier: 'Incorrect' };
    }

    const seconds = responseTimeMs / 1000;

    // Generous 1.0s network latency buffer for 30s deadline
    if (seconds <= 5.5) {
      return { points: 200, speedTier: '0-5s (Lightning)' };
    } else if (seconds <= 10.5) {
      return { points: 180, speedTier: '6-10s (Fast)' };
    } else if (seconds <= 15.5) {
      return { points: 160, speedTier: '11-15s (Great)' };
    } else if (seconds <= 20.5) {
      return { points: 130, speedTier: '16-20s (Good)' };
    } else if (seconds <= 25.5) {
      return { points: 100, speedTier: '21-25s (Steady)' };
    } else if (seconds <= 31.0) {
      return { points: 60, speedTier: '26-30s (Clutch)' };
    } else {
      return { points: 0, speedTier: 'Timeout' };
    }
  }

  /**
   * Retrieve Dynamic Quiz Schedule and Live Status
   * Allows the owner to set Quest live 24/7 or schedule any custom time in IST.
   */
  static async getQuizSchedule(db: D1DatabaseLike): Promise<QuizScheduleConfig> {
    let mode: 'always_live' | 'scheduled' = 'always_live';
    let unlockTimeIst = '14:00';
    let allowUnlimitedAttempts = false;

    try {
      const modeRow = await db.prepare("SELECT value FROM system_settings WHERE key = 'quiz_mode'").first<{ value: string }>();
      if (modeRow?.value === 'scheduled' || modeRow?.value === 'always_live') {
        mode = modeRow.value;
      }

      const timeRow = await db.prepare("SELECT value FROM system_settings WHERE key = 'quiz_unlock_time_ist'").first<{ value: string }>();
      if (timeRow?.value && /^\d{1,2}:\d{2}$/.test(timeRow.value)) {
        unlockTimeIst = timeRow.value;
      }

      const unlimitedRow = await db.prepare("SELECT value FROM system_settings WHERE key = 'quiz_allow_unlimited'").first<{ value: string }>();
      if (unlimitedRow?.value) {
        allowUnlimitedAttempts = unlimitedRow.value === 'true' || unlimitedRow.value === '1';
      }
    } catch {
      // Table may be uninitialized in fresh environments, fall back to defaults
    }

    // Current IST Time Calculation (UTC+5:30)
    const nowUtc = new Date();
    const istOffsetMs = 5.5 * 60 * 60 * 1000;
    const istDate = new Date(nowUtc.getTime() + istOffsetMs);
    const istHours = istDate.getUTCHours();
    const istMinutes = istDate.getUTCMinutes();
    const istSeconds = istDate.getUTCSeconds();
    const istTotalSecs = istHours * 3600 + istMinutes * 60 + istSeconds;

    const [tH, tM] = unlockTimeIst.split(':').map(Number);
    const targetTotalSecs = (tH || 0) * 3600 + (tM || 0) * 60;

    let isLiveNow = false;
    let remainingSeconds = 0;
    let nextUnlockIso = '';

    if (mode === 'always_live') {
      isLiveNow = true;
      remainingSeconds = 0;
    } else {
      // Scheduled Mode: Compare IST current seconds with target
      if (istTotalSecs >= targetTotalSecs) {
        isLiveNow = true;
        remainingSeconds = 0;
      } else {
        isLiveNow = false;
        remainingSeconds = Math.max(0, targetTotalSecs - istTotalSecs);
        const targetDate = new Date(istDate);
        targetDate.setUTCHours(tH || 14, tM || 0, 0, 0);
        // Convert back to UTC ISO
        const targetUtcDate = new Date(targetDate.getTime() - istOffsetMs);
        nextUnlockIso = targetUtcDate.toISOString();
      }
    }

    const currentIstTime = `${String(istHours).padStart(2, '0')}:${String(istMinutes).padStart(2, '0')}:${String(istSeconds).padStart(2, '0')} IST`;

    return {
      mode,
      unlockTimeIst,
      allowUnlimitedAttempts,
      isLiveNow,
      nextUnlockIso,
      remainingSeconds,
      currentIstTime
    };
  }

  /**
   * Update Quiz Schedule Settings (Owner Portal)
   */
  static async updateQuizSchedule(
    db: D1DatabaseLike,
    config: {
      mode?: 'always_live' | 'scheduled';
      unlockTimeIst?: string;
      allowUnlimitedAttempts?: boolean;
    }
  ): Promise<QuizScheduleConfig> {
    const now = new Date().toISOString();

    if (config.mode) {
      await db.prepare(
        `INSERT INTO system_settings (key, value, updated_at) VALUES ('quiz_mode', ?, ?)
         ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at`
      ).bind(config.mode, now).run();
    }

    if (config.unlockTimeIst) {
      await db.prepare(
        `INSERT INTO system_settings (key, value, updated_at) VALUES ('quiz_unlock_time_ist', ?, ?)
         ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at`
      ).bind(config.unlockTimeIst, now).run();
    }

    if (config.allowUnlimitedAttempts !== undefined) {
      await db.prepare(
        `INSERT INTO system_settings (key, value, updated_at) VALUES ('quiz_allow_unlimited', ?, ?)
         ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at`
      ).bind(config.allowUnlimitedAttempts ? 'true' : 'false', now).run();
    }

    return this.getQuizSchedule(db);
  }

  /**
   * Reset All Today's Quiz Attempts (Owner Portal Instant Replay)
   * Deletes all daily completed sessions for today so owner and players can replay immediately.
   */
  static async resetAllDailyAttempts(
    db: D1DatabaseLike
  ): Promise<{ success: boolean; clearedCount: number; message: string }> {
    const nowUtc = new Date();
    const istOffsetMs = 5.5 * 60 * 60 * 1000;
    const istDate = new Date(nowUtc.getTime() + istOffsetMs);
    const todayPrefix = istDate.toISOString().slice(0, 10);

    const res = await db.prepare(
      `DELETE FROM quiz_sessions WHERE mode = 'daily' AND started_at LIKE ?`
    ).bind(`${todayPrefix}%`).run();

    const clearedCount = res.meta?.changes || 0;
    return {
      success: true,
      clearedCount,
      message: `Cleared ${clearedCount} today's Quest attempt(s) for ${todayPrefix}. Everyone can now play again immediately!`
    };
  }

  /**
   * Check if user is eligible for QUEST competition today (IST date YYYY-MM-DD)
   * Dynamically governed by owner schedule (Always Live or Scheduled IST time).
   */
  static async checkDailyStatus(db: D1DatabaseLike, userId: string): Promise<{
    canPlayDaily: boolean;
    lastCompletedAt?: string;
    nextAvailableAt?: string;
    todayPointsEarned: number;
    isLockedByTime: boolean;
    timeRemainingSeconds: number;
    schedule: QuizScheduleConfig;
  }> {
    const schedule = await this.getQuizSchedule(db);

    // Current IST Date & Time (UTC+5:30)
    const nowUtc = new Date();
    const istOffsetMs = 5.5 * 60 * 60 * 1000;
    const istDate = new Date(nowUtc.getTime() + istOffsetMs);
    const todayPrefix = istDate.toISOString().slice(0, 10);

    // If unlimited attempts are NOT enabled, enforce 1 attempt per day
    if (!schedule.allowUnlimitedAttempts) {
      const completedDaily = await db.prepare(
        `SELECT * FROM quiz_sessions
         WHERE user_id = ? AND mode = 'daily' AND status = 'completed' AND started_at LIKE ?`
      ).bind(userId, `${todayPrefix}%`).first<{ completed_at: string; total_points: number }>();

      if (completedDaily) {
        const nextUnlock = new Date(istDate);
        nextUnlock.setUTCDate(nextUnlock.getUTCDate() + 1);
        const [tH, tM] = schedule.unlockTimeIst.split(':').map(Number);
        nextUnlock.setUTCHours(tH || 14, tM || 0, 0, 0);

        return {
          canPlayDaily: false,
          lastCompletedAt: completedDaily.completed_at,
          nextAvailableAt: nextUnlock.toISOString(),
          todayPointsEarned: completedDaily.total_points || 0,
          isLockedByTime: false,
          timeRemainingSeconds: 0,
          schedule
        };
      }
    }

    // Check if locked by owner's schedule
    if (!schedule.isLiveNow && process.env.NODE_ENV !== 'test') {
      return {
        canPlayDaily: false,
        nextAvailableAt: schedule.nextUnlockIso,
        todayPointsEarned: 0,
        isLockedByTime: true,
        timeRemainingSeconds: schedule.remainingSeconds,
        schedule
      };
    }

    return {
      canPlayDaily: true,
      todayPointsEarned: 0,
      isLockedByTime: false,
      timeRemainingSeconds: 0,
      schedule
    };
  }

  /**
   * Retrieve active or recently completed Quest session for refresh persistence
   * Total Quest duration: 5 minutes (300 seconds)
   * Individual question duration: 30 seconds
   */
  static async getActiveSession(
    db: D1DatabaseLike,
    userId: string
  ): Promise<{
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
      overallRemainingSeconds: number;
      questionRemainingSeconds: number;
    };
    completedSession?: {
      id: string;
      score: number;
      totalPoints: number;
      totalQuestions: number;
      correctAnswers: number;
      incorrectAnswers: number;
      accuracyPct: number;
      completedAt: string;
    };
  }> {
    const nowMs = Date.now();
    const nowIso = new Date(nowMs).toISOString();

    // 1. Look for active in-progress session
    const activeSession = await db.prepare(
      `SELECT * FROM quiz_sessions
       WHERE user_id = ? AND status = 'in_progress'
       ORDER BY started_at DESC LIMIT 1`
    ).bind(userId).first<{
      id: string;
      mode: 'daily' | 'practice';
      total_questions: number;
      current_question_index: number;
      questions_list_json: string;
      current_question_started_at: string;
      score: number;
      total_points: number;
      started_at: string;
    }>();

    if (activeSession) {
      const qIds: string[] = JSON.parse(activeSession.questions_list_json || '[]');
      const sessionStartedAtMs = new Date(activeSession.started_at).getTime();
      const totalElapsedSec = (nowMs - sessionStartedAtMs) / 1000;

      // Authoritative 5-minute deadline check (300 seconds)
      if (totalElapsedSec >= 300) {
        await db.prepare(
          `UPDATE quiz_sessions SET
            status = 'completed',
            completed_at = ?
           WHERE id = ?`
        ).bind(nowIso, activeSession.id).run();

        if (activeSession.mode === 'daily' && activeSession.total_points > 0) {
          await db.prepare(
            `UPDATE users SET
              points_balance = points_balance + ?,
              total_points_earned = total_points_earned + ?,
              updated_at = ?
             WHERE id = ?`
          ).bind(activeSession.total_points, activeSession.total_points, nowIso, userId).run();

          const updatedUser = await db.prepare(
            'SELECT points_balance FROM users WHERE id = ?'
          ).bind(userId).first<{ points_balance: number }>();

          await db.prepare(
            `INSERT INTO points_transactions (
              id, user_id, type, amount, balance_after, reference_type, reference_id, description, created_at
            ) VALUES (?, ?, 'quiz_reward', ?, ?, 'quiz_session', ?, ?, ?)`
          ).bind(
            'ptx_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 7),
            userId,
            activeSession.total_points,
            updatedUser?.points_balance || activeSession.total_points,
            activeSession.id,
            `QUEST Reward (5-min Deadline): ${activeSession.score}/${qIds.length} correct (+${activeSession.total_points} pts)`,
            nowIso
          ).run();
        }

        await LeaderboardService.updateUserStats(db, userId);

        return {
          hasActiveSession: false,
          hasCompletedToday: true,
          completedSession: {
            id: activeSession.id,
            score: activeSession.score,
            totalPoints: activeSession.total_points,
            totalQuestions: qIds.length,
            correctAnswers: activeSession.score,
            incorrectAnswers: qIds.length - activeSession.score,
            accuracyPct: qIds.length > 0 ? Math.round((activeSession.score / qIds.length) * 100) : 0,
            completedAt: nowIso
          }
        };
      }

      // Session is in-progress and within the 5-minute window!
      const currQId = qIds[activeSession.current_question_index];
      const qRow = await db.prepare(
        'SELECT id, question, category, difficulty, options_json FROM questions WHERE id = ?'
      ).bind(currQId).first<QuestionRow>();

      if (qRow) {
        const questionStartedAtMs = new Date(activeSession.current_question_started_at).getTime();
        const questionElapsedSec = (nowMs - questionStartedAtMs) / 1000;
        const questionRemainingSec = Math.max(0, 30.0 - questionElapsedSec);
        const overallRemainingSec = Math.max(0, 300.0 - totalElapsedSec);

        return {
          hasActiveSession: true,
          hasCompletedToday: false,
          session: {
            id: activeSession.id,
            mode: activeSession.mode,
            currentQuestionIndex: activeSession.current_question_index,
            totalQuestions: qIds.length,
            score: activeSession.score,
            totalPoints: activeSession.total_points,
            currentQuestion: {
              id: qRow.id,
              question: qRow.question,
              category: qRow.category,
              difficulty: qRow.difficulty,
              options: JSON.parse(qRow.options_json || '[]'),
              questionIndex: activeSession.current_question_index,
              totalQuestions: qIds.length,
              startedAt: activeSession.current_question_started_at,
              questStartedAt: activeSession.started_at,
              totalQuestDurationSeconds: 300,
              questionDurationSeconds: 30,
              overallRemainingSeconds: Math.round(overallRemainingSec),
              questionRemainingSeconds: Number(questionRemainingSec.toFixed(1))
            },
            startedAt: activeSession.started_at,
            overallRemainingSeconds: Math.round(overallRemainingSec),
            questionRemainingSeconds: Number(questionRemainingSec.toFixed(1))
          }
        };
      }
    }

    // 2. Check if completed today in IST
    const nowUtc = new Date();
    const istOffsetMs = 5.5 * 60 * 60 * 1000;
    const istDate = new Date(nowUtc.getTime() + istOffsetMs);
    const todayPrefix = istDate.toISOString().slice(0, 10);

    const completed = await db.prepare(
      `SELECT * FROM quiz_sessions
       WHERE user_id = ? AND mode = 'daily' AND status = 'completed' AND started_at LIKE ?
       ORDER BY completed_at DESC LIMIT 1`
    ).bind(userId, `${todayPrefix}%`).first<{
      id: string;
      score: number;
      total_points: number;
      total_questions: number;
      completed_at: string;
    }>();

    if (completed) {
      return {
        hasActiveSession: false,
        hasCompletedToday: true,
        completedSession: {
          id: completed.id,
          score: completed.score,
          totalPoints: completed.total_points,
          totalQuestions: completed.total_questions,
          correctAnswers: completed.score,
          incorrectAnswers: completed.total_questions - completed.score,
          accuracyPct: Math.round((completed.score / completed.total_questions) * 100),
          completedAt: completed.completed_at
        }
      };
    }

    return {
      hasActiveSession: false,
      hasCompletedToday: false
    };
  }

  /**
   * Start a new QUEST Session (Competitive QUEST or Practice Mode)
   * 10 Questions: 4 Easy, 4 Medium, 2 Hard (Business Related)
   * Exactly 5 Minutes (300 seconds) total duration, 30 seconds per question.
   */
  static async startQuiz(
    db: D1DatabaseLike,
    userId: string,
    mode: 'daily' | 'practice' = 'daily'
  ): Promise<{
    success: boolean;
    message: string;
    sessionId?: string;
    firstQuestion?: ClientQuestion;
    mode?: 'daily' | 'practice';
    totalQuestions?: number;
  }> {
    // 1. Verify email verification status
    const user = await db.prepare('SELECT id, is_verified FROM users WHERE id = ?').bind(userId).first<{ id: string; is_verified: number }>();
    if (!user) {
      return { success: false, message: 'User account not found.' };
    }
    if (!user.is_verified) {
      return { success: false, message: 'Please verify your email address before entering QUEST.' };
    }

    // 2. Restore active in-progress session if user refreshes or re-enters
    const existingActive = await db.prepare(
      `SELECT * FROM quiz_sessions
       WHERE user_id = ? AND mode = ? AND status = 'in_progress'
       ORDER BY started_at DESC LIMIT 1`
    ).bind(userId, mode).first<{
      id: string;
      total_questions: number;
      current_question_index: number;
      questions_list_json: string;
      current_question_started_at: string;
      started_at: string;
    }>();

    if (existingActive) {
      const qIds: string[] = JSON.parse(existingActive.questions_list_json || '[]');
      const currQId = qIds[existingActive.current_question_index];
      const qRow = await db.prepare(
        'SELECT id, question, category, difficulty, options_json FROM questions WHERE id = ?'
      ).bind(currQId).first<QuestionRow>();

      if (qRow) {
        const sessionStartedAtMs = new Date(existingActive.started_at).getTime();
        const totalElapsedSec = (Date.now() - sessionStartedAtMs) / 1000;
        const questionStartedAtMs = new Date(existingActive.current_question_started_at).getTime();
        const questionElapsedSec = (Date.now() - questionStartedAtMs) / 1000;

        return {
          success: true,
          message: 'Resuming active QUEST session.',
          sessionId: existingActive.id,
          mode,
          totalQuestions: qIds.length,
          firstQuestion: {
            id: qRow.id,
            question: qRow.question,
            category: qRow.category,
            difficulty: qRow.difficulty,
            options: JSON.parse(qRow.options_json || '[]'),
            questionIndex: existingActive.current_question_index,
            totalQuestions: qIds.length,
            startedAt: existingActive.current_question_started_at,
            questStartedAt: existingActive.started_at,
            totalQuestDurationSeconds: 300,
            questionDurationSeconds: 30,
            overallRemainingSeconds: Math.max(0, 300 - Math.round(totalElapsedSec)),
            questionRemainingSeconds: Math.max(0, Number((30.0 - questionElapsedSec).toFixed(1)))
          }
        };
      }
    }

    // 3. Competitive Quest Check: Governed by dynamic owner schedule & attempt limits
    if (mode === 'daily') {
      const dailyStatus = await this.checkDailyStatus(db, userId);
      if (!dailyStatus.canPlayDaily) {
        return {
          success: false,
          message: dailyStatus.isLockedByTime
            ? `QUEST is scheduled to unlock at ${dailyStatus.schedule?.unlockTimeIst || '14:00'} IST! Check the countdown on your dashboard.`
            : 'You have already completed QUEST for today! Come back tomorrow or check owner test replays.'
        };
      }
    }

    // 4. Select exactly 10 Questions: 4 Easy, 4 Medium, 2 Hard (Business Related)
    // Prioritizing the 20 curated business questions (qb_e1..qb_e7, qb_m1..qb_m8, qb_h1..qb_h5)
    const easyQ = await db.prepare(
      "SELECT id FROM questions WHERE is_active = 1 AND difficulty = 'Easy' ORDER BY CASE WHEN id LIKE 'qb_%' THEN 0 ELSE 1 END, RANDOM() LIMIT 4"
    ).all<{ id: string }>();
    const medQ = await db.prepare(
      "SELECT id FROM questions WHERE is_active = 1 AND difficulty = 'Medium' ORDER BY CASE WHEN id LIKE 'qb_%' THEN 0 ELSE 1 END, RANDOM() LIMIT 4"
    ).all<{ id: string }>();
    const hardQ = await db.prepare(
      "SELECT id FROM questions WHERE is_active = 1 AND difficulty = 'Hard' ORDER BY CASE WHEN id LIKE 'qb_%' THEN 0 ELSE 1 END, RANDOM() LIMIT 2"
    ).all<{ id: string }>();

    let questionIds = [
      ...(easyQ.results || []).map(q => q.id),
      ...(medQ.results || []).map(q => q.id),
      ...(hardQ.results || []).map(q => q.id)
    ];

    if (questionIds.length < 10) {
      // Fallback: fill up to 10 from active questions
      const anyQ = await db.prepare("SELECT id FROM questions WHERE is_active = 1 ORDER BY RANDOM() LIMIT 10").all<{ id: string }>();
      questionIds = (anyQ.results || []).map(q => q.id);
    }

    if (questionIds.length === 0) {
      return { success: false, message: 'No QUEST questions available at the moment.' };
    }

    const sessionId = 'qs_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 7);
    const now = new Date().toISOString();

    // 5. Create Quiz Session (Strictly 10 questions, 300 seconds total)
    await db.prepare(
      `INSERT INTO quiz_sessions (
        id, user_id, mode, status, total_questions, current_question_index,
        questions_list_json, current_question_started_at, score, total_points,
        started_at
      ) VALUES (?, ?, ?, 'in_progress', ?, 0, ?, ?, 0, 0, ?)`
    ).bind(
      sessionId,
      userId,
      mode,
      questionIds.length,
      JSON.stringify(questionIds),
      now,
      now
    ).run();

    // 6. Fetch first question
    const firstQRow = await db.prepare(
      'SELECT id, question, category, difficulty, options_json FROM questions WHERE id = ?'
    ).bind(questionIds[0]).first<QuestionRow>();

    if (!firstQRow) {
      return { success: false, message: 'Could not load first question.' };
    }

    const options: string[] = JSON.parse(firstQRow.options_json || '[]');

    return {
      success: true,
      message: 'QUEST started! Good luck!',
      sessionId,
      mode,
      totalQuestions: questionIds.length,
      firstQuestion: {
        id: firstQRow.id,
        question: firstQRow.question,
        category: firstQRow.category,
        difficulty: firstQRow.difficulty,
        options,
        questionIndex: 0,
        totalQuestions: questionIds.length,
        startedAt: now,
        questStartedAt: now,
        totalQuestDurationSeconds: 300,
        questionDurationSeconds: 30,
        overallRemainingSeconds: 300,
        questionRemainingSeconds: 30
      }
    };
  }

  /**
   * Submit an answer to the current question (or timeout)
   * Automatically advances question and calculates speed points
   * Security Rule: NEVER reveal correct answers or explanations to the client between questions!
   */
  static async submitAnswer(
    db: D1DatabaseLike,
    userId: string,
    params: {
      sessionId: string;
      questionId: string;
      selectedOptionIndex: number;
    }
  ): Promise<{ success: boolean; message: string; result?: AnswerSubmissionResult }> {
    const now = Date.now();
    const nowIso = new Date(now).toISOString();

    // 1. Fetch active session
    const session = await db.prepare(
      'SELECT * FROM quiz_sessions WHERE id = ? AND user_id = ?'
    ).bind(params.sessionId, userId).first<{
      id: string;
      user_id: string;
      mode: 'daily' | 'practice';
      status: string;
      total_questions: number;
      current_question_index: number;
      questions_list_json: string;
      current_question_started_at: string;
      started_at: string;
      score: number;
      total_points: number;
    }>();

    if (!session) {
      return { success: false, message: 'QUEST session not found.' };
    }

    if (session.status !== 'in_progress') {
      return { success: false, message: 'This QUEST session has already concluded.' };
    }

    const questionIds: string[] = JSON.parse(session.questions_list_json || '[]');
    const expectedQuestionId = questionIds[session.current_question_index];

    if (expectedQuestionId !== params.questionId) {
      return { success: false, message: 'Question order mismatch or invalid question submission.' };
    }

    // 2. Prevent duplicate answer submission for this session & question
    const existingAnswer = await db.prepare(
      'SELECT id FROM quiz_answers WHERE session_id = ? AND question_id = ?'
    ).bind(session.id, params.questionId).first<{ id: string }>();

    if (existingAnswer) {
      return { success: false, message: 'An answer has already been recorded for this question.' };
    }

    // 3. Compute response time from server timestamp
    const startedAtMs = new Date(session.current_question_started_at).getTime();
    const responseTimeMs = Math.max(100, now - startedAtMs);

    // 4. Fetch Question with correct answer on the server only
    const qRow = await db.prepare(
      'SELECT * FROM questions WHERE id = ?'
    ).bind(params.questionId).first<QuestionRow>();

    if (!qRow) {
      return { success: false, message: 'Question not found in database.' };
    }

    // Handle timeout or unanswered submission (selectedOptionIndex < 0)
    const isTimeout = params.selectedOptionIndex === -1 || params.selectedOptionIndex === null || params.selectedOptionIndex === undefined;
    const isCorrect = !isTimeout && params.selectedOptionIndex === qRow.correct_index;
    
    const { points: pointsAwarded, speedTier } = isTimeout
      ? { points: 0, speedTier: 'Timeout' as const }
      : this.calculateSpeedPoints(isCorrect, responseTimeMs);

    // 5. Store answer in database
    const answerId = 'ans_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 6);
    await db.prepare(
      `INSERT INTO quiz_answers (
        id, session_id, user_id, question_id, selected_index,
        is_correct, response_time_ms, points_awarded, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      answerId,
      session.id,
      userId,
      params.questionId,
      isTimeout ? -1 : params.selectedOptionIndex,
      isCorrect ? 1 : 0,
      isTimeout ? 30000 : responseTimeMs,
      pointsAwarded,
      nowIso
    ).run();

    // 6. Check overall 5-minute timer (300 seconds authoritative deadline)
    const sessionStartedAtMs = new Date(session.started_at).getTime();
    const totalQuestElapsedSec = (now - sessionStartedAtMs) / 1000;
    const isOverallExpired = totalQuestElapsedSec >= 300;

    // Update session score & points
    const newScore = session.score + (isCorrect ? 1 : 0);
    const newSessionPoints = session.total_points + pointsAwarded;
    const nextIndex = session.current_question_index + 1;
    const isQuizCompleted = isOverallExpired || nextIndex >= questionIds.length;

    if (isQuizCompleted) {
      await db.prepare(
        `UPDATE quiz_sessions SET
          status = 'completed',
          score = ?,
          total_points = ?,
          current_question_index = ?,
          completed_at = ?
         WHERE id = ?`
      ).bind(newScore, newSessionPoints, nextIndex, nowIso, session.id).run();

      // If daily mode and points earned, credit points to user and log transaction
      if (session.mode === 'daily' && newSessionPoints > 0) {
        await db.prepare(
          `UPDATE users SET
            points_balance = points_balance + ?,
            total_points_earned = total_points_earned + ?,
            updated_at = ?
           WHERE id = ?`
        ).bind(newSessionPoints, newSessionPoints, nowIso, userId).run();

        const updatedUser = await db.prepare(
          'SELECT points_balance FROM users WHERE id = ?'
        ).bind(userId).first<{ points_balance: number }>();

        await db.prepare(
          `INSERT INTO points_transactions (
            id, user_id, type, amount, balance_after, reference_type, reference_id, description, created_at
          ) VALUES (?, ?, 'quiz_reward', ?, ?, 'quiz_session', ?, ?, ?)`
        ).bind(
          'ptx_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 7),
          userId,
          newSessionPoints,
          updatedUser?.points_balance || newSessionPoints,
          session.id,
          `QUEST Reward: ${newScore}/${questionIds.length} correct (+${newSessionPoints} pts)`,
          nowIso
        ).run();
      }

      // Update Leaderboard immediately
      await LeaderboardService.updateUserStats(db, userId);
    } else {
      // Advance to next question
      await db.prepare(
        `UPDATE quiz_sessions SET
          score = ?,
          total_points = ?,
          current_question_index = ?,
          current_question_started_at = ?
         WHERE id = ?`
      ).bind(newScore, newSessionPoints, nextIndex, nowIso, session.id).run();
    }

    // 7. Prepare next question if quiz continues (NEVER include correct answer)
    let nextQuestion: ClientQuestion | null = null;
    if (!isQuizCompleted) {
      const nextQId = questionIds[nextIndex];
      const nextQRow = await db.prepare(
        'SELECT id, question, category, difficulty, options_json FROM questions WHERE id = ?'
      ).bind(nextQId).first<QuestionRow>();

      if (nextQRow) {
        nextQuestion = {
          id: nextQRow.id,
          question: nextQRow.question,
          category: nextQRow.category,
          difficulty: nextQRow.difficulty,
          options: JSON.parse(nextQRow.options_json || '[]'),
          questionIndex: nextIndex,
          totalQuestions: questionIds.length,
          startedAt: nowIso,
          questStartedAt: session.started_at,
          totalQuestDurationSeconds: 300,
          questionDurationSeconds: 30,
          overallRemainingSeconds: Math.max(0, 300 - Math.round(totalQuestElapsedSec)),
          questionRemainingSeconds: 30
        };
      }
    }

    // Security: Only return pointsAwarded and speedTier — NEVER leak correctIndex or explanation!
    return {
      success: true,
      message: pointsAwarded > 0 ? `+${pointsAwarded} pts` : isTimeout ? 'Time Expired (0 pts)' : '+0 pts',
      result: {
        isCorrect,
        pointsAwarded,
        responseTimeMs,
        speedTier,
        currentScore: newScore,
        totalPointsEarnedInQuiz: newSessionPoints,
        isQuizCompleted,
        nextQuestion,
        quizSummary: isQuizCompleted
          ? {
              totalQuestions: questionIds.length,
              questionsAnswered: Math.min(questionIds.length, nextIndex),
              correctAnswers: newScore,
              incorrectAnswers: Math.min(questionIds.length, nextIndex) - newScore,
              score: newScore,
              pointsEarned: newSessionPoints,
              accuracyPct: nextIndex > 0 ? Math.round((newScore / nextIndex) * 100) : 0,
              mode: session.mode
            }
          : undefined
      }
    };
  }

  /**
   * Admin Question Management: Get all questions
   */
  static async getAllQuestions(db: D1DatabaseLike): Promise<QuestionRow[]> {
    const res = await db.prepare(
      'SELECT * FROM questions ORDER BY category, id ASC'
    ).all<QuestionRow>();
    return res.results || [];
  }

  /**
   * Admin Question Management: Add question
   */
  static async addQuestion(
    db: D1DatabaseLike,
    params: {
      question: string;
      category: string;
      difficulty: string;
      options: string[];
      correctIndex: number;
      explanation?: string;
    }
  ): Promise<{ success: boolean; message: string; id?: string }> {
    const id = 'q_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 6);
    const now = new Date().toISOString();

    if (!params.question || params.options.length !== 4) {
      return { success: false, message: 'Question and exactly 4 options are required.' };
    }
    if (params.correctIndex < 0 || params.correctIndex > 3) {
      return { success: false, message: 'Correct index must be between 0 and 3.' };
    }

    await db.prepare(
      `INSERT INTO questions (
        id, question, category, difficulty, options_json, correct_index, explanation, is_active, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?, ?)`
    ).bind(
      id,
      sanitize(params.question),
      sanitize(params.category),
      sanitize(params.difficulty || 'Medium'),
      JSON.stringify(params.options.map(o => sanitize(o))),
      params.correctIndex,
      sanitize(params.explanation || ''),
      now,
      now
    ).run();

    return { success: true, message: 'Question added successfully.', id };
  }

  /**
   * Admin Question Management: Update question
   */
  static async updateQuestion(
    db: D1DatabaseLike,
    id: string,
    params: {
      question: string;
      category: string;
      difficulty: string;
      options: string[];
      correctIndex: number;
      explanation?: string;
      isActive?: boolean;
    }
  ): Promise<{ success: boolean; message: string }> {
    const now = new Date().toISOString();
    await db.prepare(
      `UPDATE questions SET
        question = ?, category = ?, difficulty = ?, options_json = ?,
        correct_index = ?, explanation = ?, is_active = ?, updated_at = ?
       WHERE id = ?`
    ).bind(
      sanitize(params.question),
      sanitize(params.category),
      sanitize(params.difficulty),
      JSON.stringify(params.options.map(o => sanitize(o))),
      params.correctIndex,
      sanitize(params.explanation || ''),
      params.isActive === false ? 0 : 1,
      now,
      id
    ).run();

    return { success: true, message: 'Question updated successfully.' };
  }

  /**
   * Admin Question Management: Delete question
   */
  static async deleteQuestion(db: D1DatabaseLike, id: string): Promise<{ success: boolean; message: string }> {
    await db.prepare('DELETE FROM questions WHERE id = ?').bind(id).run();
    return { success: true, message: 'Question deleted successfully.' };
  }
}
