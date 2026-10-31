/**
 * Dedicated QUEST Arena Page (/quest)
 * 5-Minute (300-second) Automatic Question System:
 * - Exactly 10 business questions.
 * - Overall Quest countdown: 05:00.
 * - Individual question countdown: 00:30.
 * - Progress: Question 1 of 10.
 * - Automatic transitions on answer selection or 30-second timeout (No manual Next button).
 * - Synchronized with server timestamps, authoritative 5-minute deadline.
 * - Strict anti-leak answer security (zero answer reveals during transitions).
 * - Full refresh rehydration preserving question, remaining timers, answers, and points.
 */

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { api } from '../services/apiClient.ts';
import type { ClientQuestion } from '../server/quizService.ts';
import { navigateTo } from '../utils/navigation.ts';
import confetti from 'canvas-confetti';
import {
  Zap,
  Clock,
  Hourglass,
  Trophy,
  Coins,
  ShieldCheck,
  AlertCircle,
  X,
  LayoutDashboard,
  Sparkles,
  Gift,
  MessageSquare,
  Phone
} from 'lucide-react';
import './QuestArenaPage.css';

export const QuestArenaPage: React.FC = () => {
  const { isAuthenticated, openAuthModal, refreshUser } = useAuth();
  const [copiedWinnerVoucher, setCopiedWinnerVoucher] = useState(false);

  // Mode: default 'daily' competitive QUEST
  const [_mode, setMode] = useState<'daily' | 'practice'>('daily');

  // Session & Question State
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<ClientQuestion | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  // Score & Progress Tracking
  const [score, setScore] = useState(0);
  const [totalPointsEarned, setTotalPointsEarned] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(10);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastPointsAwarded, setLastPointsAwarded] = useState<{ pts: number; tier: string } | null>(null);

  // Dual Timers (Synchronized with authoritative server timestamps)
  // Overall Quest Timer: 300 seconds (05:00)
  // Question Timer: 30 seconds (00:30)
  const [overallTimeLeft, setOverallTimeLeft] = useState(300.0);
  const [questionTimeLeft, setQuestionTimeLeft] = useState(30.0);

  const questStartedAtRef = useRef<number>(Date.now());
  const questionStartedAtRef = useRef<number>(Date.now());
  const timerIntervalRef = useRef<any>(null);
  const isSubmittingRef = useRef(false);

  // Completion State
  const [isCompleted, setIsCompleted] = useState(false);
  const [completionSummary, setCompletionSummary] = useState<{
    totalQuestions: number;
    questionsAnswered: number;
    correctAnswers: number;
    incorrectAnswers: number;
    score: number;
    pointsEarned: number;
    accuracyPct: number;
  } | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  // Format MM:SS helper
  const formatMMSS = (seconds: number) => {
    const clamped = Math.max(0, Math.floor(seconds));
    const m = Math.floor(clamped / 60);
    const s = clamped % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // 1. Initialize or Rehydrate Active Session on Mount / Refresh
  useEffect(() => {
    let isMounted = true;

    async function initQuest() {
      if (!isAuthenticated) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setErrorMsg('');

      try {
        // First check for active in-progress session or completed session today
        const activeRes = await api.quiz.getActiveSession();
        if (!isMounted) return;

        if (activeRes.success && activeRes.hasActiveSession && activeRes.session) {
          // Rehydrate active session!
          const sess = activeRes.session;
          const nowMs = Date.now();
          const sessStartedAtMs = new Date(sess.startedAt).getTime();
          const qStartedAtMs = new Date(sess.currentQuestion.startedAt).getTime();

          questStartedAtRef.current = sessStartedAtMs;
          questionStartedAtRef.current = qStartedAtMs;

          const elapsedOverall = (nowMs - sessStartedAtMs) / 1000;
          const remOverall = Math.max(0, 300.0 - elapsedOverall);

          const elapsedQuestion = (nowMs - qStartedAtMs) / 1000;
          const remQuestion = Math.max(0, 30.0 - elapsedQuestion);

          setSessionId(sess.id);
          setMode(sess.mode);
          setScore(sess.score);
          setTotalPointsEarned(sess.totalPoints);
          setTotalQuestions(sess.totalQuestions || 10);
          setCurrentQuestion(sess.currentQuestion);
          setOverallTimeLeft(remOverall);
          setQuestionTimeLeft(remQuestion);
          setSelectedOption(null);
          setIsLoading(false);
          return;
        }

        if (activeRes.success && activeRes.hasCompletedToday && activeRes.completedSession) {
          // Already completed today: restore completion screen!
          const comp = activeRes.completedSession;
          setIsCompleted(true);
          setCompletionSummary({
            totalQuestions: comp.totalQuestions,
            questionsAnswered: comp.totalQuestions,
            correctAnswers: comp.correctAnswers ?? comp.score,
            incorrectAnswers: comp.incorrectAnswers ?? Math.max(0, comp.totalQuestions - comp.score),
            score: comp.score,
            pointsEarned: comp.totalPoints,
            accuracyPct: comp.accuracyPct
          });
          setIsLoading(false);
          return;
        }

        // Start new competitive QUEST session (10 questions, 300s total)
        const startRes = await api.quiz.startQuiz('daily');
        if (!isMounted) return;

        if (startRes.success && startRes.sessionId && startRes.firstQuestion) {
          const nowMs = Date.now();
          questStartedAtRef.current = nowMs;
          questionStartedAtRef.current = nowMs;

          setSessionId(startRes.sessionId);
          setMode(startRes.mode || 'daily');
          setCurrentQuestion(startRes.firstQuestion);
          setTotalQuestions(startRes.totalQuestions || 10);
          setScore(0);
          setTotalPointsEarned(0);
          setOverallTimeLeft(300.0);
          setQuestionTimeLeft(30.0);
          setSelectedOption(null);
          setIsCompleted(false);
        } else {
          setErrorMsg(startRes.message || 'Could not start QUEST session.');
        }
      } catch (err: any) {
        if (!isMounted) return;
        setErrorMsg(err.message || 'Error initializing QUEST arena.');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    initQuest();

    return () => {
      isMounted = false;
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [isAuthenticated]);

  // Keep isSubmittingRef synced
  useEffect(() => {
    isSubmittingRef.current = isSubmitting;
  }, [isSubmitting]);

  // 2. Dual Synchronized Timers (Every 100ms)
  useEffect(() => {
    if (!currentQuestion || isCompleted || isLoading || !sessionId) return;

    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);

    timerIntervalRef.current = setInterval(() => {
      const now = Date.now();
      const elapsedOverall = (now - questStartedAtRef.current) / 1000;
      const remOverall = Math.max(0, 300.0 - elapsedOverall);
      setOverallTimeLeft(remOverall);

      const elapsedQuestion = (now - questionStartedAtRef.current) / 1000;
      const remQuestion = Math.max(0, 30.0 - elapsedQuestion);
      setQuestionTimeLeft(remQuestion);

      // Check Authoritative 5-Minute Overall Deadline
      if (remOverall <= 0.05) {
        clearInterval(timerIntervalRef.current);
        if (!isSubmittingRef.current) {
          submitCurrentAnswer(-1, true);
        }
        return;
      }

      // Check 30-Second Individual Question Deadline
      if (remQuestion <= 0.05) {
        clearInterval(timerIntervalRef.current);
        if (!isSubmittingRef.current) {
          submitCurrentAnswer(-1, false);
        }
        return;
      }
    }, 100);

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [currentQuestion, isCompleted, isLoading, sessionId]);

  // 3. Submit Answer with Automatic Question Transitions (No manual Next button)
  const submitCurrentAnswer = async (optionIdx: number, forceOverallTimeout = false) => {
    if (!sessionId || !currentQuestion || isSubmittingRef.current) return;

    setIsSubmitting(true);
    isSubmittingRef.current = true;
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);

    try {
      const res = await api.quiz.submitAnswer({
        sessionId,
        questionId: currentQuestion.id,
        selectedOptionIndex: optionIdx
      });

      if (res.success && res.result) {
        const {
          pointsAwarded,
          speedTier,
          currentScore,
          totalPointsEarnedInQuiz,
          isQuizCompleted,
          nextQuestion,
          quizSummary
        } = res.result;

        setScore(currentScore);
        setTotalPointsEarned(totalPointsEarnedInQuiz);
        setLastPointsAwarded({ pts: pointsAwarded, tier: speedTier });

        if (isQuizCompleted || forceOverallTimeout) {
          setIsCompleted(true);
          setCompletionSummary(
            quizSummary || {
              totalQuestions,
              questionsAnswered: currentQuestion.questionIndex + 1,
              correctAnswers: currentScore,
              incorrectAnswers: Math.max(0, currentQuestion.questionIndex + 1 - currentScore),
              score: currentScore,
              pointsEarned: totalPointsEarnedInQuiz,
              accuracyPct: Math.round((currentScore / totalQuestions) * 100)
            }
          );
          await refreshUser();
          confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.6 }
          });
        } else if (nextQuestion) {
          // Automatic Transition: Immediately load next question
          setCurrentQuestion(nextQuestion);
          setSelectedOption(null);
          questionStartedAtRef.current = Date.now();
          setQuestionTimeLeft(30.0);

          if (nextQuestion.overallRemainingSeconds !== undefined) {
            setOverallTimeLeft(nextQuestion.overallRemainingSeconds);
          }
        }
      } else {
        setErrorMsg(res.message || 'Answer submission failed.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Network error submitting answer.');
    } finally {
      setIsSubmitting(false);
      isSubmittingRef.current = false;
    }
  };

  // Immediate Click Handler: Submits immediately without requiring a Next button
  const handleOptionClick = (idx: number) => {
    if (isSubmitting || isCompleted) return;
    setSelectedOption(idx);
    submitCurrentAnswer(idx, false);
  };

  // Render Unauthenticated State
  if (!isAuthenticated) {
    return (
      <div className="mbx-quest-viewport center-layout">
        <div className="quest-gate-card">
          <Zap size={36} className="text-royal" />
          <h2>Authentication Required</h2>
          <p>You must be signed in with a verified account to participate in QUEST.</p>
          <div className="gate-actions">
            <button type="button" className="btn-primary" onClick={() => openAuthModal('login')}>
              Sign In to Enter QUEST
            </button>
            <button type="button" className="btn-secondary" onClick={() => navigateTo('/dashboard')}>
              Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render Final Completion Screen
  if (isCompleted && completionSummary) {
    return (
      <div className="mbx-quest-viewport">
        <div className="quest-completion-card">
          <div className="completion-badge">
            <Trophy size={48} className="text-royal trophy-bounce" />
          </div>

          <h1 className="completion-title">QUEST COMPLETED</h1>
          <p className="completion-sub">
            Your results have been registered and your leaderboard standings updated.
          </p>

          <div className="completion-stats-grid">
            <div className="comp-stat-box highlight">
              <span className="label">Total Points Earned</span>
              <strong className="value text-royal">+{completionSummary.pointsEarned.toLocaleString()}</strong>
              <span className="sub">Credited to Your Wallet</span>
            </div>

            <div className="comp-stat-box">
              <span className="label">Correct Answers</span>
              <strong className="value text-success">
                {completionSummary.correctAnswers} / {completionSummary.totalQuestions}
              </strong>
              <span className="sub">{completionSummary.accuracyPct}% Accuracy</span>
            </div>

            <div className="comp-stat-box">
              <span className="label">Incorrect / Timed Out</span>
              <strong className="value text-muted">
                {completionSummary.incorrectAnswers}
              </strong>
              <span className="sub">0 Points Awarded</span>
            </div>

            <div className="comp-stat-box">
              <span className="label">Total Questions</span>
              <strong className="value">{completionSummary.totalQuestions}</strong>
              <span className="sub">5-Minute Challenge</span>
            </div>
          </div>

          {/* Winner Privilege Voucher Card with Direct Owner Transmission */}
          <div style={{ background: '#F0FDF4', border: '1.5px solid #86EFAC', borderRadius: 'var(--radius-md)', padding: '1.25rem', margin: '1.25rem 0', textAlign: 'left' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#166534', fontWeight: 700, fontSize: '1rem' }}>
                <Gift size={20} className="text-success" />
                <span>QUEST WINNER PRIVILEGE VOUCHER</span>
              </div>
              <span style={{ fontSize: '0.78rem', background: '#DCFCE7', color: '#15803D', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)', fontWeight: 700 }}>
                Eligible for Software Redemption
              </span>
            </div>

            <div style={{ background: '#FFFFFF', border: '1px dashed #86EFAC', borderRadius: 'var(--radius-sm)', padding: '0.75rem 1rem', margin: '0.75rem 0' }}>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Winner Voucher Code:</div>
              <strong style={{ fontSize: '1.1rem', letterSpacing: '0.05em', color: 'var(--royal-blue-deep)' }}>
                {`MBX-QUEST-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.abs(completionSummary.pointsEarned).toString(36).toUpperCase()}`}
              </strong>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                Points Won: <strong>+{completionSummary.pointsEarned.toLocaleString()} pts</strong> | Accuracy: <strong>{completionSummary.accuracyPct}%</strong>
              </div>
            </div>

            <p style={{ fontSize: '0.82rem', color: '#14532D', margin: '0 0 0.85rem', lineHeight: 1.45 }}>
              Your victory voucher has been formatted as text. Tap below to send this voucher text directly to Founder Deep Mehta on WhatsApp (+91 9644570828):
            </p>

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <a
                href={`https://wa.me/919644570828?text=${encodeURIComponent(
                  `🏆 *MYBOOKSX QUEST WINNER VOUCHER!*\n==================================\nVoucher Code: MBX-QUEST-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.abs(completionSummary.pointsEarned).toString(36).toUpperCase()}\nPoints Won: +${completionSummary.pointsEarned.toLocaleString()} pts\nAccuracy: ${completionSummary.accuracyPct}%\nCorrect Answers: ${completionSummary.correctAnswers}/${completionSummary.totalQuestions}\nDate: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST\nClaim Rewards: http://localhost:5173/redeem\n==================================\nFounder Hotline: +91 9644570828`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', padding: '0.55rem 0.95rem', background: '#25D366', color: '#FFFFFF', borderColor: '#25D366', fontSize: '0.84rem', textDecoration: 'none', borderRadius: 'var(--radius-sm)', fontWeight: 600 }}
              >
                <MessageSquare size={16} />
                <span>Send Winning Voucher to WhatsApp (+91 9644570828)</span>
              </a>

              <a
                href={`sms:+919644570828?body=${encodeURIComponent(
                  `🏆 *MYBOOKSX QUEST WINNER VOUCHER!*\nVoucher: MBX-QUEST-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}\nPoints Won: +${completionSummary.pointsEarned.toLocaleString()} pts\nAccuracy: ${completionSummary.accuracyPct}%`
                )}`}
                className="btn-outline"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', padding: '0.55rem 0.95rem', fontSize: '0.84rem', borderRadius: 'var(--radius-sm)' }}
              >
                <Phone size={15} />
                <span>Send via SMS to +91 9644570828</span>
              </a>

              <button
                type="button"
                className="btn-outline"
                style={{ padding: '0.55rem 0.85rem', fontSize: '0.84rem', borderRadius: 'var(--radius-sm)' }}
                onClick={() => {
                  navigator.clipboard.writeText(
                    `🏆 *MYBOOKSX QUEST WINNER VOUCHER!*\nVoucher: MBX-QUEST-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}\nPoints: +${completionSummary.pointsEarned.toLocaleString()}`
                  );
                  setCopiedWinnerVoucher(true);
                  setTimeout(() => setCopiedWinnerVoucher(false), 2000);
                }}
              >
                {copiedWinnerVoucher ? '✓ Text Copied' : '📋 Copy Text'}
              </button>
            </div>
          </div>

          <div className="completion-notice">
            <ShieldCheck size={16} className="text-royal" />
            <span>
              Competitive QUEST attempt registered for today. Next QUEST unlocks tomorrow at 2:00 PM IST.
            </span>
          </div>

          <div className="completion-actions-row">
            <button
              type="button"
              className="btn-primary"
              onClick={() => navigateTo('/dashboard')}
            >
              <LayoutDashboard size={16} />
              <span>Return to Dashboard</span>
            </button>

            <button
              type="button"
              className="btn-secondary"
              onClick={() => navigateTo('/redeem')}
            >
              <Coins size={16} />
              <span>Redeem Points</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mbx-quest-viewport">
      {/* Top Floating Header */}
      <header className="mbx-quest-header">
        <div className="quest-header-container">
          <button
            type="button"
            className="quest-back-btn"
            onClick={() => navigateTo('/dashboard')}
            title="Return to Dashboard"
          >
            <X size={18} />
            <span>Exit QUEST</span>
          </button>

          <div className="quest-brand-title">
            <Zap size={18} className="text-royal" />
            <span>QUEST</span>
          </div>

          {/* Synchronized Overall Quest 5-Minute Timer (05:00) */}
          <div className="quest-overall-timer-pill" title="Overall Quest Countdown (5 Minutes Max)">
            <Hourglass size={15} className="text-royal" />
            <span className="timer-label">OVERALL:</span>
            <strong className={`timer-digits ${overallTimeLeft <= 30.0 ? 'warning' : ''}`}>
              {formatMMSS(overallTimeLeft)}
            </strong>
          </div>

          <div className="quest-score-chip">
            <span>Score:</span>
            <strong>{score}</strong>
            <span className="pts-badge">+{totalPointsEarned} pts</span>
          </div>
        </div>
      </header>

      <main className="mbx-quest-main-container">
        {isLoading ? (
          <div className="quest-loading-state">
            <Zap size={32} className="spin text-royal" />
            <h3>Preparing QUEST Challenge...</h3>
            <p>Loading 10 verified business questions (5 minutes total, 30s per question).</p>
          </div>
        ) : errorMsg ? (
          <div className="quest-error-card">
            <AlertCircle size={32} className="text-danger" />
            <h3>Notice</h3>
            <p>{errorMsg}</p>
            <button type="button" className="btn-primary" onClick={() => navigateTo('/dashboard')}>
              Back to Dashboard
            </button>
          </div>
        ) : currentQuestion ? (
          <div className="quest-active-card">
            {/* Progress Bar & Question Counter */}
            <div className="quest-progress-bar-row">
              <div className="progress-info">
                <span>QUESTION {currentQuestion.questionIndex + 1} OF {totalQuestions}</span>
                <span className="difficulty-tag">{currentQuestion.difficulty}</span>
              </div>
              <div className="progress-track">
                <div
                  className="progress-fill"
                  style={{ width: `${((currentQuestion.questionIndex + 1) / totalQuestions) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Individual Question Countdown Timer: 00:30 */}
            <div className="quest-timer-strip">
              <div className="question-timer-group">
                <div className={`quest-timer-badge ${questionTimeLeft <= 5.0 ? 'warning' : ''}`}>
                  <Clock size={16} />
                  <span>{formatMMSS(questionTimeLeft)}</span>
                </div>
                <span className="question-timer-sub">30s per question</span>
              </div>

              {lastPointsAwarded && (
                <div className="last-points-toast">
                  <span className={lastPointsAwarded.pts > 0 ? 'pts-gain' : 'pts-zero'}>
                    {lastPointsAwarded.pts > 0 ? `+${lastPointsAwarded.pts} pts` : '+0 pts'} ({lastPointsAwarded.tier})
                  </span>
                </div>
              )}
            </div>

            {/* Question Text */}
            <h2 className="quest-question-text">{currentQuestion.question}</h2>

            {/* 4 Options Grid (Automatic Submission on Click) */}
            <div className="quest-options-grid">
              {currentQuestion.options.map((optionText, idx) => {
                const isSelected = selectedOption === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    className={`quest-option-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleOptionClick(idx)}
                    disabled={isSubmitting}
                  >
                    <span className="option-letter">{['A', 'B', 'C', 'D'][idx]}</span>
                    <span className="option-text">{optionText}</span>
                    {isSelected && isSubmitting && (
                      <span className="option-spinner">
                        <Zap size={14} className="spin text-royal" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Automatic Transition Status Footer (NO manual Next button required) */}
            <div className="quest-auto-footer">
              <div className="auto-advance-pill">
                <Sparkles size={14} className="text-royal" />
                <span>Select an answer to advance automatically • Auto-timeout in {Math.ceil(questionTimeLeft)}s</span>
              </div>
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
};
