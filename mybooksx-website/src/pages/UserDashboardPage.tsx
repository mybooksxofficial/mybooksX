/**
 * Unified Authenticated User Dashboard (/dashboard)
 * Single cohesive authenticated application shell for Quest, Leaderboard, Wallet, Redeem, and Profile.
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { api } from '../services/apiClient.ts';
import { navigateTo } from '../utils/navigation.ts';
import type { LeaderboardResponse } from '../server/leaderboardService.ts';
import type { WalletTransactionRecord, RedemptionRecord, ActiveSubscriptionRecord } from '../server/rewardsService.ts';
import {
  Trophy,
  Zap,
  Coins,
  Clock,
  ShieldCheck,
  CheckCircle2,
  LogOut,
  TrendingUp,
  Sparkles,
  Gift,
  Key,
  ExternalLink,
  Play,
  RotateCcw,
  User,
  Mail,
  AlertCircle,
  MessageSquare
} from 'lucide-react';
import './UserDashboardPage.css';

export const UserDashboardPage: React.FC = () => {
  const { user, isAuthenticated, logout, openAuthModal } = useAuth();

  const [activeTab, setActiveTab] = useState<'quest' | 'leaderboard' | 'wallet' | 'redemptions' | 'profile'>('quest');

  // Quest State
  const [dailyStatus, setDailyStatus] = useState<{
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
  } | null>(null);

  // Active or Completed Session State
  const [activeSessionInfo, setActiveSessionInfo] = useState<{
    hasActiveSession: boolean;
    hasCompletedToday: boolean;
    session?: any;
    completedSession?: any;
  } | null>(null);

  // IST Countdown State until 8:00 PM IST
  const [countdownStr, setCountdownStr] = useState('00:00:00');
  const [isQuestUnlocked, setIsQuestUnlocked] = useState(false);

  // Leaderboard State
  const [leaderboardMode, setLeaderboardMode] = useState<'global' | 'weekly'>('global');
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardResponse | null>(null);

  // Wallet and Redemptions State
  const [transactions, setTransactions] = useState<WalletTransactionRecord[]>([]);
  const [redemptions, setRedemptions] = useState<RedemptionRecord[]>([]);
  const [subscriptions, setSubscriptions] = useState<ActiveSubscriptionRecord[]>([]);
  const [errorMsg, setErrorMsg] = useState('');

  // 1. Calculate live countdown governed by server daily status & owner schedule
  useEffect(() => {
    const updateCountdown = () => {
      // If server confirms Quest is ready and eligible to play:
      if (dailyStatus?.canPlayDaily || dailyStatus?.schedule?.isLiveNow) {
        setIsQuestUnlocked(true);
        setCountdownStr('QUEST IS LIVE NOW');
        return;
      }

      // If user has already completed today and cannot replay
      if (dailyStatus?.canPlayDaily === false && !dailyStatus?.isLockedByTime) {
        setIsQuestUnlocked(false);
        setCountdownStr('COMPLETED TODAY');
        return;
      }

      // Otherwise calculate countdown to owner's scheduled IST time
      const targetTimeIst = dailyStatus?.schedule?.unlockTimeIst || '14:00';
      const [tH, tM] = targetTimeIst.split(':').map(Number);

      const now = new Date();
      const utcMs = now.getTime() + now.getTimezoneOffset() * 60000;
      const istTime = new Date(utcMs + 5.5 * 3600000);

      const targetIst = new Date(istTime);
      targetIst.setHours(tH || 14, tM || 0, 0, 0);

      const diffMs = targetIst.getTime() - istTime.getTime();

      if (diffMs <= 0) {
        setIsQuestUnlocked(true);
        setCountdownStr('QUEST IS LIVE NOW');
      } else {
        const hours = Math.floor(diffMs / 3600000);
        const mins = Math.floor((diffMs % 3600000) / 60000);
        const secs = Math.floor((diffMs % 60000) / 1000);

        setIsQuestUnlocked(false);
        setCountdownStr(
          `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
        );
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [dailyStatus]);

  // 2. Fetch Quest Status, Active Session & Leaderboard
  const fetchDashboardData = async () => {
    if (!isAuthenticated) return;
    try {
      const [statusRes, activeRes, lbRes] = await Promise.all([
        api.quiz.getDailyStatus().catch(() => null),
        api.quiz.getActiveSession().catch(() => null),
        api.leaderboard.getLeaderboard(leaderboardMode, 10).catch(() => null)
      ]);

      if (statusRes?.success) setDailyStatus(statusRes);
      if (activeRes?.success) setActiveSessionInfo(activeRes);
      if (lbRes?.success) setLeaderboardData(lbRes.leaderboard);

      // Load wallet and redemptions if user is in those tabs
      if (activeTab === 'wallet') {
        const walletRes = await api.rewards.getMyWallet().catch(() => null);
        if (walletRes?.success) setTransactions(walletRes.transactions);
      } else if (activeTab === 'redemptions') {
        const [redRes, subRes] = await Promise.all([
          api.rewards.getMyRedemptions().catch(() => null),
          api.rewards.getMySubscriptions().catch(() => null)
        ]);
        if (redRes?.success) setRedemptions(redRes.redemptions);
        if (subRes?.success) setSubscriptions(subRes.subscriptions);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error syncing dashboard data.');
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [isAuthenticated, leaderboardMode, activeTab]);

  // Handle Logout
  const handleLogout = async () => {
    await logout();
    navigateTo('/');
  };

  // Launch Quest
  const handleStartQuest = (_questMode: 'daily' | 'practice') => {
    navigateTo('/quest');
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="mbx-dashboard-viewport unauth">
        <div className="mbx-unauth-card">
          <ShieldCheck size={36} className="text-royal" />
          <h2>MyBooksX Unified Dashboard</h2>
          <p>Please sign in to access your Quest competition, speed points, and software rewards.</p>
          <div className="unauth-actions">
            <button type="button" className="btn-primary" onClick={() => openAuthModal('login')}>
              Sign In
            </button>
            <button type="button" className="btn-secondary" onClick={() => navigateTo('/')}>
              Return to Website
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Calculate User Stats
  const points = user.pointsBalance || 0;
  const totalEarned = user.totalPointsEarned || 0;
  const userRankObj = leaderboardData?.currentUserRank;
  const userRank = userRankObj?.rank || 1;
  const questionsAnswered = userRankObj?.questionsAnswered || 0;
  const accuracy = userRankObj?.accuracyPct || 0;
  const correctAnswers = Math.round((questionsAnswered * accuracy) / 100);

  const isLockedBySchedule = Boolean(dailyStatus?.isLockedByTime);
  const hasCompletedToday = dailyStatus?.canPlayDaily === false && !isLockedBySchedule;

  return (
    <div className="mbx-dashboard-viewport">
      {/* 1. TOP HEADER SECTION */}
      <header className="mbx-dash-header">
        <div className="dash-header-container">
          <div className="dash-header-left">
            <a href="/" className="dash-brand-logo" onClick={e => { e.preventDefault(); navigateTo('/'); }}>
              <img src="/logo/mybooksx-logo.png" alt="MyBooksX" />
              <span className="brand-title">MyBooksX</span>
            </a>
            <div className="dash-nav-pills">
              <button
                type="button"
                className={`dash-pill-btn ${activeTab === 'quest' ? 'active' : ''}`}
                onClick={() => setActiveTab('quest')}
              >
                <Zap size={15} />
                <span>QUEST</span>
              </button>
              <button
                type="button"
                className={`dash-pill-btn ${activeTab === 'leaderboard' ? 'active' : ''}`}
                onClick={() => setActiveTab('leaderboard')}
              >
                <Trophy size={15} />
                <span>Leaderboard</span>
              </button>
              <button
                type="button"
                className={`dash-pill-btn ${activeTab === 'wallet' ? 'active' : ''}`}
                onClick={() => setActiveTab('wallet')}
              >
                <Coins size={15} />
                <span>My Wallet</span>
              </button>
              <button
                type="button"
                className="dash-pill-btn highlight-redeem"
                onClick={() => navigateTo('/redeem')}
                title="Open Dedicated Redeem Panel"
              >
                <Gift size={15} />
                <span>Redeem Store</span>
              </button>
              <button
                type="button"
                className={`dash-pill-btn ${activeTab === 'redemptions' ? 'active' : ''}`}
                onClick={() => setActiveTab('redemptions')}
              >
                <Key size={15} />
                <span>My Redemptions</span>
              </button>
              <button
                type="button"
                className={`dash-pill-btn ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={() => setActiveTab('profile')}
              >
                <User size={15} />
                <span>Profile</span>
              </button>
            </div>
          </div>

          <div className="dash-header-right">
            {/* Verified Account Indicator */}
            <div className="verified-status-tag" title="Verified Account">
              <ShieldCheck size={14} className="text-success" />
              <span>Verified Account</span>
            </div>

            {/* Available Points Balance */}
            <div className="dash-points-chip" onClick={() => setActiveTab('wallet')}>
              <Zap size={15} className="text-royal" />
              <strong>{points.toLocaleString()}</strong>
              <span>pts</span>
            </div>

            {/* User Profile Avatar */}
            <div className="dash-user-avatar" title={user.fullName}>
              {user.fullName.charAt(0).toUpperCase()}
            </div>

            {/* Logout Button */}
            <button
              type="button"
              className="dash-logout-btn"
              onClick={handleLogout}
              title="Sign Out"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* 2. MAIN DASHBOARD CONTENT */}
      <main className="mbx-dash-main container">
        {errorMsg && (
          <div className="mbx-alert error">
            <AlertCircle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* =========================================================================
            TAB 1: QUEST (MAIN COMPETITIVE EXPERIENCE)
            ========================================================================= */}
        {activeTab === 'quest' && (
          <div className="mbx-tab-content quest-flow">
            {/* Top Key Metrics Banner */}
            <div className="dash-kpi-grid">
              <div className="kpi-card rank-highlight">
                <span className="kpi-label">YOUR RANK</span>
                <strong className="kpi-value text-royal">#{userRank}</strong>
                <span className="kpi-sub">
                  {userRank <= 10 ? 'Top 10 Player' : `Ranked ${userRank} overall`}
                </span>
              </div>

              <div className="kpi-card">
                <span className="kpi-label">TOTAL EARNED</span>
                <strong className="kpi-value">{totalEarned.toLocaleString()}</strong>
                <span className="kpi-sub">Lifetime speed points</span>
              </div>

              <div className="kpi-card">
                <span className="kpi-label">QUESTIONS ANSWERED</span>
                <strong className="kpi-value">{questionsAnswered}</strong>
                <span className="kpi-sub">Across competitive sessions</span>
              </div>

              <div className="kpi-card">
                <span className="kpi-label">ACCURACY</span>
                <strong className="kpi-value text-success">{accuracy}%</strong>
                <span className="kpi-sub">{correctAnswers} correct answers</span>
              </div>
            </div>

            {/* Main QUEST Arena Card */}
            <div className="quest-hero-card">
              <div className="quest-hero-header">
                <div className="quest-tag">
                  <Sparkles size={14} className="text-royal" />
                  <span>DAILY COMPETITIVE EXPERIENCE</span>
                </div>
                <h2 className="quest-title">QUEST</h2>
                <p className="quest-desc">
                  Compete in 10 fast-paced business challenges in exactly 5 minutes (30 seconds per question).
                  Auto-transitions on answer or timeout.
                </p>
              </div>

              {/* Countdown Banner */}
              <div className="quest-status-banner">
                <div className="countdown-block">
                  <span className="countdown-label">
                    {hasCompletedToday
                      ? 'TODAY’S QUEST COMPLETED'
                      : isQuestUnlocked
                      ? 'COMPETITION STATUS'
                      : `NEXT QUEST UNLOCKS AT ${dailyStatus?.schedule?.unlockTimeIst || '2:00 PM'} IST IN`}
                  </span>
                  <div className={`countdown-digits ${isQuestUnlocked ? 'unlocked' : ''}`}>
                    <Clock size={20} />
                    <span>{hasCompletedToday ? 'Next Quest tomorrow or owner test mode' : countdownStr}</span>
                  </div>
                </div>

                <div className="quest-actions-block">
                  {hasCompletedToday ? (
                    <div className="quest-done-box">
                      <CheckCircle2 size={24} className="text-success" />
                      <div>
                        <strong>Attempt Registered for Today</strong>
                        <p>You earned {dailyStatus?.todayPointsEarned || 0} pts today. Come back tomorrow!</p>
                      </div>
                    </div>
                  ) : activeSessionInfo?.hasActiveSession ? (
                    <button
                      type="button"
                      className="btn-primary btn-start-quest"
                      onClick={() => handleStartQuest('daily')}
                    >
                      <RotateCcw size={18} />
                      <span>Resume Active QUEST</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="btn-primary btn-start-quest"
                      onClick={() => handleStartQuest('daily')}
                    >
                      <Play size={18} />
                      <span>Start QUEST (10 Questions • 5 Mins)</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Double Points Criteria Table */}
              <div className="quest-scoring-rules-card">
                <div className="rules-header">
                  <TrendingUp size={16} className="text-royal" />
                  <h4>30-Second Speed Points Criteria (5 Min Total)</h4>
                </div>
                <div className="scoring-table-grid">
                  <div className="score-tier">
                    <span className="time">0–5 seconds</span>
                    <strong className="pts text-royal">+200 pts</strong>
                    <span className="badge-speed">Lightning</span>
                  </div>
                  <div className="score-tier">
                    <span className="time">6–10 seconds</span>
                    <strong className="pts text-royal">+180 pts</strong>
                    <span className="badge-speed">Fast</span>
                  </div>
                  <div className="score-tier">
                    <span className="time">11–15 seconds</span>
                    <strong className="pts text-royal">+160 pts</strong>
                    <span className="badge-speed">Great</span>
                  </div>
                  <div className="score-tier">
                    <span className="time">16–20 seconds</span>
                    <strong className="pts text-royal">+130 pts</strong>
                    <span className="badge-speed">Good</span>
                  </div>
                  <div className="score-tier">
                    <span className="time">21–25 seconds</span>
                    <strong className="pts text-royal">+100 pts</strong>
                    <span className="badge-speed">Steady</span>
                  </div>
                  <div className="score-tier">
                    <span className="time">26–30 seconds</span>
                    <strong className="pts text-royal">+60 pts</strong>
                    <span className="badge-speed">Clutch</span>
                  </div>
                  <div className="score-tier incorrect">
                    <span className="time">&gt;30s / Timeout</span>
                    <strong className="pts text-muted">0 pts</strong>
                    <span className="badge-speed">No Points</span>
                  </div>
                </div>
              </div>

              {/* Practice Mode Alternative */}
              <div className="quest-practice-box">
                <div>
                  <strong>Want to sharpen your skills?</strong>
                  <p>Practice Mode lets you explore business questions anytime without daily limits.</p>
                </div>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => handleStartQuest('practice')}
                >
                  Enter Practice Mode
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 2: LEADERBOARD (WITH PINNED LOGGED-IN USER)
            ========================================================================= */}
        {activeTab === 'leaderboard' && (
          <div className="mbx-tab-content leaderboard-flow">
            <div className="lb-controls-row">
              <div>
                <h2>Global & Weekly Standings</h2>
                <p>Track your verified ranking against all active MyBooksX competitors.</p>
              </div>
              <div className="lb-mode-toggle">
                <button
                  type="button"
                  className={`toggle-btn ${leaderboardMode === 'global' ? 'active' : ''}`}
                  onClick={() => setLeaderboardMode('global')}
                >
                  All-Time Global
                </button>
                <button
                  type="button"
                  className={`toggle-btn ${leaderboardMode === 'weekly' ? 'active' : ''}`}
                  onClick={() => setLeaderboardMode('weekly')}
                >
                  Weekly Leaders
                </button>
              </div>
            </div>

            {/* PINNED LOGGED-IN USER BANNER (Always Prominently Visible) */}
            <div className="pinned-user-ranking-card">
              <div className="pinned-rank-col">
                <span className="pinned-tag">MY RANK</span>
                <div className="pinned-rank-number">#{userRank}</div>
              </div>

              <div className="pinned-user-col">
                <div className="pinned-name-row">
                  <div className="pinned-avatar">{user.fullName.charAt(0).toUpperCase()}</div>
                  <div>
                    <strong>{user.fullName} (You)</strong>
                    <span className="verified-pill">
                      <ShieldCheck size={11} /> Verified Account
                    </span>
                  </div>
                </div>
              </div>

              <div className="pinned-stat-col">
                <span className="label">Points</span>
                <strong className="value text-royal">{points.toLocaleString()} pts</strong>
              </div>

              <div className="pinned-stat-col">
                <span className="label">Answered</span>
                <strong className="value">{questionsAnswered} qs</strong>
              </div>

              <div className="pinned-stat-col">
                <span className="label">Accuracy</span>
                <strong className="value text-success">{accuracy}%</strong>
              </div>
            </div>

            {/* Top 10 Table */}
            <div className="lb-table-card">
              <table className="lb-table">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Player</th>
                    <th>Points</th>
                    <th>Questions Answered</th>
                    <th>Accuracy</th>
                  </tr>
                </thead>
                <tbody>
                  {(leaderboardData?.topPlayers || []).map((player) => {
                    const isMe = player.isCurrentUser || player.userId === user.id;
                    return (
                      <tr key={player.userId} className={isMe ? 'row-current-user' : ''}>
                        <td>
                          <div className="rank-cell">
                            {player.rank === 1 && <Trophy size={18} className="gold" />}
                            {player.rank === 2 && <Trophy size={18} className="silver" />}
                            {player.rank === 3 && <Trophy size={18} className="bronze" />}
                            <span>#{player.rank}</span>
                          </div>
                        </td>
                        <td>
                          <div className="player-cell">
                            <div className="avatar-circle">{player.fullName.charAt(0).toUpperCase()}</div>
                            <strong>{player.fullName}</strong>
                            {isMe && <span className="you-badge">YOU</span>}
                          </div>
                        </td>
                        <td>
                          <strong className="text-royal">{player.points.toLocaleString()} pts</strong>
                        </td>
                        <td>{player.questionsAnswered}</td>
                        <td>
                          <span className="accuracy-pill">{player.accuracyPct}%</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 3: MY WALLET (IMMUTABLE LEDGER)
            ========================================================================= */}
        {activeTab === 'wallet' && (
          <div className="mbx-tab-content wallet-flow">
            <div className="wallet-hero-grid">
              <div className="wallet-stat-card">
                <span className="label">Available Points Balance</span>
                <strong className="value text-royal">{points.toLocaleString()}</strong>
                <span className="sub">Ready for software redemption</span>
              </div>
              <div className="wallet-stat-card">
                <span className="label">Reserved in Pending Requests</span>
                <strong className="value text-warning">{(user.pointsReserved || 0).toLocaleString()}</strong>
                <span className="sub">Held during admin verification</span>
              </div>
              <div className="wallet-stat-card">
                <span className="label">Total Lifetime Points</span>
                <strong className="value text-success">{totalEarned.toLocaleString()}</strong>
                <span className="sub">Cumulative points earned</span>
              </div>
            </div>

            <div className="wallet-table-card">
              <div className="wallet-header">
                <h3>Points Transaction Ledger</h3>
                <p>Immutable double-entry audit history of all earned rewards and software reservations.</p>
              </div>

              {transactions.length === 0 ? (
                <div className="empty-wallet">
                  <Coins size={36} className="text-muted" />
                  <p>No points transactions recorded yet. Complete QUEST sessions to earn points!</p>
                </div>
              ) : (
                <table className="wallet-table">
                  <thead>
                    <tr>
                      <th>Transaction ID</th>
                      <th>Activity Description</th>
                      <th>Amount</th>
                      <th>Balance After</th>
                      <th>Date & Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map(tx => (
                      <tr key={tx.id}>
                        <td><code>{tx.id}</code></td>
                        <td><strong>{tx.description}</strong></td>
                        <td>
                          <span className={`tx-amount ${tx.amount > 0 ? 'plus' : 'minus'}`}>
                            {tx.amount > 0 ? `+${tx.amount.toLocaleString()}` : tx.amount.toLocaleString()} pts
                          </span>
                        </td>
                        <td>{tx.balanceAfter.toLocaleString()} pts</td>
                        <td>{new Date(tx.createdAt).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 4: MY REDEMPTIONS & ACTIVE SUBSCRIPTIONS
            ========================================================================= */}
        {activeTab === 'redemptions' && (
          <div className="mbx-tab-content redemptions-flow">
            <div className="redemptions-top-row">
              <div>
                <h2>My Redemptions & Licenses</h2>
                <p>Active 30-day corporate software subscriptions and redemption audit trail.</p>
              </div>
              <button
                type="button"
                className="btn-primary"
                onClick={() => navigateTo('/redeem')}
              >
                <Gift size={16} />
                <span>Visit Redeem Marketplace</span>
              </button>
            </div>

            {/* Active Subscriptions Cards */}
            {subscriptions.length > 0 && (
              <div className="active-subs-section">
                <h3>Active Software Subscriptions</h3>
                <div className="subs-grid">
                  {subscriptions.map(sub => (
                    <div key={sub.id} className="sub-card">
                      <div className="sub-header">
                        <h4>{sub.rewardTitle}</h4>
                        <span className="days-pill">{sub.daysRemaining} days left</span>
                      </div>
                      <div className="sub-license-row">
                        <Key size={14} className="text-royal" />
                        <code>{sub.licenseKey}</code>
                      </div>
                      <div className="sub-footer">
                        <span>Expires: {new Date(sub.expiresAt).toLocaleDateString()}</span>
                        <a href={sub.accessUrl} target="_blank" rel="noopener noreferrer" className="btn-launch">
                          Launch App <ExternalLink size={12} />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Redemptions Table */}
            <div className="redemptions-table-card">
              <h3>Redemption Requests History</h3>
              {redemptions.length === 0 ? (
                <div className="empty-redemptions">
                  <Gift size={32} className="text-muted" />
                  <p>You have not made any redemption requests yet.</p>
                </div>
              ) : (
                <table className="redemptions-table">
                  <thead>
                    <tr>
                      <th>Redemption ID</th>
                      <th>Application</th>
                      <th>Points</th>
                      <th>Requested Date</th>
                      <th>Status</th>
                      <th>License / Remarks</th>
                      <th>Direct Text to Owner</th>
                    </tr>
                  </thead>
                  <tbody>
                    {redemptions.map(r => (
                      <tr key={r.id}>
                        <td><code>{r.redemptionCode || r.id}</code></td>
                        <td><strong>{r.rewardTitle}</strong></td>
                        <td>{r.pointsReserved.toLocaleString()} pts</td>
                        <td>{new Date(r.createdAt).toLocaleDateString()}</td>
                        <td>
                          <span className={`status-tag ${r.status.toLowerCase()}`}>
                            {r.status}
                          </span>
                        </td>
                        <td>
                          {r.status === 'Approved' ? (
                            <span>{r.licenseKey ? `Key: ${r.licenseKey}` : 'Approved (30 Days)'}</span>
                          ) : r.status === 'Rejected' ? (
                            <span className="text-danger">{r.rejectionReason} (Points Refunded)</span>
                          ) : (
                            <span className="text-warning">Under review by system admin</span>
                          )}
                        </td>
                        <td>
                          <a
                            href={r.whatsappUrl || `https://wa.me/919644570828?text=${encodeURIComponent(r.voucherText || `Voucher: ${r.redemptionCode}\nApp: ${r.rewardTitle}\nPoints: ${r.pointsReserved}`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-outline"
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.3rem 0.6rem', fontSize: '0.78rem', borderColor: '#25D366', color: '#128C7E', textDecoration: 'none', borderRadius: '4px', whiteSpace: 'nowrap' }}
                            title="Direct WhatsApp Text to Owner (+91 9644570828)"
                          >
                            <MessageSquare size={13} />
                            <span>WhatsApp to +91 9644570828</span>
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 5: PROFILE
            ========================================================================= */}
        {activeTab === 'profile' && (
          <div className="mbx-tab-content profile-flow">
            <div className="profile-card">
              <div className="profile-header">
                <div className="profile-avatar-large">
                  {user.fullName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3>{user.fullName}</h3>
                  <span className="profile-email">
                    <Mail size={13} /> {user.email}
                  </span>
                  <div className="verified-badge-row">
                    <ShieldCheck size={14} className="text-success" />
                    <span>Verified Account (Email Confirmed)</span>
                  </div>
                </div>
              </div>

              <div className="profile-details-grid">
                <div className="detail-item">
                  <span className="label">Account ID</span>
                  <code>{user.id}</code>
                </div>
                <div className="detail-item">
                  <span className="label">Authentication Provider</span>
                  <strong>{user.authProvider === 'google' ? 'Google OAuth 2.0' : 'Email & Password'}</strong>
                </div>
                <div className="detail-item">
                  <span className="label">Member Since</span>
                  <span>{new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Account Role</span>
                  <strong style={{ textTransform: 'capitalize' }}>{user.role}</strong>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
