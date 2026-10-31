/**
 * Leaderboard Service
 * Powers global and weekly leaderboards, real-time rank computation, and player statistics.
 */

import type { D1DatabaseLike } from './db/d1Client.ts';

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  fullName: string;
  points: number;
  questionsAnswered: number;
  accuracyPct: number;
  isCurrentUser?: boolean;
}

export interface LeaderboardResponse {
  topPlayers: LeaderboardEntry[];
  currentUserRank?: LeaderboardEntry | null;
  totalPlayers: number;
  mode: 'global' | 'weekly';
}

export class LeaderboardService {
  /**
   * Recalculate and update user's aggregated leaderboard metrics
   */
  static async updateUserStats(db: D1DatabaseLike, userId: string): Promise<void> {
    const now = new Date().toISOString();

    // 1. Compute overall totals from quiz_answers
    const stats = await db.prepare(
      `SELECT 
        COUNT(id) as total_answered,
        SUM(CASE WHEN is_correct = 1 THEN 1 ELSE 0 END) as total_correct,
        SUM(points_awarded) as total_earned
       FROM quiz_answers
       WHERE user_id = ?`
    ).bind(userId).first<{
      total_answered: number;
      total_correct: number;
      total_earned: number;
    }>();

    const totalAnswered = stats?.total_answered || 0;
    const totalCorrect = stats?.total_correct || 0;
    const accuracy = totalAnswered > 0 ? Number(((totalCorrect / totalAnswered) * 100).toFixed(1)) : 0;

    // 2. Compute weekly points (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const weeklyStats = await db.prepare(
      `SELECT SUM(points_awarded) as weekly_earned
       FROM quiz_answers
       WHERE user_id = ? AND created_at >= ?`
    ).bind(userId, sevenDaysAgo).first<{ weekly_earned: number }>();

    const weeklyPoints = weeklyStats?.weekly_earned || 0;

    // 3. Get user total points from users table
    const user = await db.prepare('SELECT total_points_earned FROM users WHERE id = ?').bind(userId).first<{ total_points_earned: number }>();
    const totalPoints = user?.total_points_earned || 0;

    // 4. Upsert into leaderboard_records
    await db.prepare(
      `INSERT INTO leaderboard_records (
        id, user_id, total_points, questions_answered, correct_answers,
        accuracy_pct, weekly_points, last_answered_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(user_id) DO UPDATE SET
        total_points = excluded.total_points,
        questions_answered = excluded.questions_answered,
        correct_answers = excluded.correct_answers,
        accuracy_pct = excluded.accuracy_pct,
        weekly_points = excluded.weekly_points,
        last_answered_at = excluded.last_answered_at,
        updated_at = excluded.updated_at`
    ).bind(
      'lb_' + userId,
      userId,
      totalPoints,
      totalAnswered,
      totalCorrect,
      accuracy,
      weeklyPoints,
      now,
      now
    ).run();
  }

  /**
   * Retrieve Global or Weekly leaderboard with top 10 and current user's position
   */
  static async getLeaderboard(
    db: D1DatabaseLike,
    mode: 'global' | 'weekly' = 'global',
    currentUserId?: string | null,
    limit = 10
  ): Promise<LeaderboardResponse> {
    const pointsColumn = mode === 'weekly' ? 'lr.weekly_points' : 'lr.total_points';

    // 1. Query Top N players
    const topRows = await db.prepare(
      `SELECT 
        lr.user_id,
        u.full_name,
        ${pointsColumn} as points,
        lr.questions_answered,
        lr.accuracy_pct
       FROM leaderboard_records lr
       JOIN users u ON lr.user_id = u.id
       WHERE lr.questions_answered > 0
       ORDER BY ${pointsColumn} DESC, lr.accuracy_pct DESC, lr.questions_answered DESC
       LIMIT ?`
    ).bind(limit).all<{
      user_id: string;
      full_name: string;
      points: number;
      questions_answered: number;
      accuracy_pct: number;
    }>();

    const topPlayers: LeaderboardEntry[] = (topRows.results || []).map((row, idx) => ({
      rank: idx + 1,
      userId: row.user_id,
      fullName: row.full_name,
      points: row.points || 0,
      questionsAnswered: row.questions_answered || 0,
      accuracyPct: row.accuracy_pct || 0,
      isCurrentUser: Boolean(currentUserId && row.user_id === currentUserId)
    }));

    // 2. Count total players who have answered at least 1 question
    const countRow = await db.prepare(
      'SELECT COUNT(id) as total FROM leaderboard_records WHERE questions_answered > 0'
    ).first<{ total: number }>();
    const totalPlayers = countRow?.total || 0;

    // 3. Locate current user's rank if not in top 10
    let currentUserRank: LeaderboardEntry | null = null;
    if (currentUserId) {
      const topFound = topPlayers.find(p => p.userId === currentUserId);
      if (topFound) {
        currentUserRank = topFound;
      } else {
        // Query user's exact ranking by counting players with higher score
        const userRecord = await db.prepare(
          `SELECT 
            lr.user_id,
            u.full_name,
            ${pointsColumn} as points,
            lr.questions_answered,
            lr.accuracy_pct
           FROM leaderboard_records lr
           JOIN users u ON lr.user_id = u.id
           WHERE lr.user_id = ?`
        ).bind(currentUserId).first<{
          user_id: string;
          full_name: string;
          points: number;
          questions_answered: number;
          accuracy_pct: number;
        }>();

        if (userRecord) {
          const higherRanked = await db.prepare(
            `SELECT COUNT(id) as higher_count
             FROM leaderboard_records
             WHERE (
               ${pointsColumn} > ? OR (${pointsColumn} = ? AND accuracy_pct > ?)
             )`
          ).bind(
            userRecord.points || 0,
            userRecord.points || 0,
            userRecord.accuracy_pct || 0
          ).first<{ higher_count: number }>();

          const exactRank = (higherRanked?.higher_count || 0) + 1;
          currentUserRank = {
            rank: exactRank,
            userId: userRecord.user_id,
            fullName: userRecord.full_name,
            points: userRecord.points || 0,
            questionsAnswered: userRecord.questions_answered || 0,
            accuracyPct: userRecord.accuracy_pct || 0,
            isCurrentUser: true
          };
        } else {
          // If no leaderboard record yet, query user directly
          const u = await db.prepare('SELECT id, full_name, points_balance FROM users WHERE id = ?').bind(currentUserId).first<{ id: string; full_name: string; points_balance: number }>();
          if (u) {
            currentUserRank = {
              rank: totalPlayers + 1,
              userId: u.id,
              fullName: u.full_name,
              points: u.points_balance || 0,
              questionsAnswered: 0,
              accuracyPct: 0,
              isCurrentUser: true
            };
          }
        }
      }
    }

    return {
      topPlayers,
      currentUserRank,
      totalPlayers,
      mode
    };
  }

  /**
   * Comprehensive Leaderboard & Points Directory for Owner Portal
   * Reports all users, their current points balance, reserved points, lifetime points, and activity.
   */
  static async getAdminLeaderboard(db: D1DatabaseLike): Promise<{
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
  }> {
    const rawUsers = await db.prepare(
      `SELECT 
        u.id as user_id,
        u.full_name,
        u.email,
        u.phone,
        u.auth_provider,
        u.is_verified,
        u.points_balance,
        u.points_reserved,
        u.total_points_earned as lifetime_points,
        u.created_at,
        COALESCE((SELECT COUNT(id) FROM quiz_sessions WHERE user_id = u.id AND status = 'completed'), 0) as quizzes_played,
        COALESCE((SELECT COUNT(id) FROM quiz_answers WHERE user_id = u.id AND is_correct = 1), 0) as total_correct,
        COALESCE((SELECT COUNT(id) FROM redemption_requests WHERE user_id = u.id), 0) as redemptions_count
       FROM users u
       ORDER BY u.points_balance DESC, u.total_points_earned DESC, u.created_at ASC`
    ).all<{
      user_id: string;
      full_name: string;
      email: string;
      auth_provider: string;
      is_verified: number;
      points_balance: number;
      points_reserved: number;
      lifetime_points: number;
      created_at: string;
      quizzes_played: number;
      total_correct: number;
      redemptions_count: number;
    }>();

    let circulatingSum = 0;
    let reservedSum = 0;
    let lifetimeSum = 0;
    let topScorerName = 'None';
    let topScore = 0;

    const list = rawUsers?.results || [];
    const rankedUsers = list.map((u, index) => {
      const balance = u.points_balance || 0;
      const reserved = u.points_reserved || 0;
      const lifetime = u.lifetime_points || 0;

      circulatingSum += balance;
      reservedSum += reserved;
      lifetimeSum += lifetime;

      if (index === 0 && balance > 0) {
        topScorerName = u.full_name;
        topScore = balance;
      }

      return {
        rank: index + 1,
        userId: u.user_id,
        fullName: u.full_name || 'Anonymous Player',
        email: u.email,
        phone: u.phone || (u.email && u.email.includes('@phone.mybooksx.com') ? '+91 ' + u.email.replace('@phone.mybooksx.com', '') : ''),
        authProvider: u.auth_provider || 'phone',
        isVerified: Boolean(u.is_verified),
        pointsBalance: balance,
        pointsReserved: reserved,
        lifetimePoints: lifetime,
        quizzesPlayed: u.quizzes_played || 0,
        totalCorrect: u.total_correct || 0,
        redemptionsCount: u.redemptions_count || 0,
        createdAt: u.created_at
      };
    });

    return {
      users: rankedUsers,
      summary: {
        totalUsers: rankedUsers.length,
        totalPointsCirculating: circulatingSum,
        totalPointsReserved: reservedSum,
        totalPointsLifetime: lifetimeSum,
        topScorerName,
        topScore
      }
    };
  }
}
