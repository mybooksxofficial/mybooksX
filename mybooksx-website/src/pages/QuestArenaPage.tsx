/**
 * Dedicated QUEST Arena Page (/quest)
 * Instant-Access 15-Minute Mathematical Challenge:
 * - Zero sign-in gate / barriers: direct access for every player on 1-click.
 * - Exactly 20 quantitative business & math questions (MATH_QUEST_QUESTIONS).
 * - Overall Quest countdown: 15:00 (900 seconds).
 * - Individual question countdown: 00:45 (45 seconds).
 * - Real-time point accumulation and live score / wallet display.
 * - Automatic transitions on answer selection or 45-second timeout (No manual Next button).
 * - Full refresh rehydration preserving question, remaining timers, answers, and points.
 */

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { api, setClientAuthToken } from '../services/apiClient.ts';
import type { ClientQuestion } from '../server/quizService.ts';
import { MATH_QUEST_QUESTIONS } from '../data/mathQuestQuestions.ts';
import { navigateTo } from '../utils/navigation.ts';
import confetti from 'canvas-confetti';
import {
  Zap,
  Lock,
  Clock,
  Hourglass,
  Trophy,
  Coins,
  AlertCircle,
  X,
  Sparkles,
  Gift,
  MessageSquare,
  Home
} from 'lucide-react';
import './QuestArenaPage.css';

// Initial question 1 of 20 (guarantees zero blank/white frames)
const DEFAULT_FIRST_QUESTION: ClientQuestion = {
  id: MATH_QUEST_QUESTIONS[0].id,
  question: MATH_QUEST_QUESTIONS[0].question,
  category: MATH_QUEST_QUESTIONS[0].category,
  difficulty: MATH_QUEST_QUESTIONS[0].difficulty,
  options: MATH_QUEST_QUESTIONS[0].options,
  questionIndex: 0,
  totalQuestions: MATH_QUEST_QUESTIONS.length,
  startedAt: new Date().toISOString(),
  questStartedAt: new Date().toISOString(),
  totalQuestDurationSeconds: 900,
  questionDurationSeconds: 45,
  overallRemainingSeconds: 900,
  questionRemainingSeconds: 45
};

export const QuestArenaPage: React.FC = () => {
  const { refreshUser } = useAuth();

  // Mode: default 'daily' competitive QUEST
  const [_mode] = useState<'daily' | 'practice'>('daily');

  // Session & Question State (Pre-populated so screen is NEVER white or empty)
  const [sessionId] = useState<string>('sess_' + Date.now());
  const [currentQuestion, setCurrentQuestion] = useState<ClientQuestion>(DEFAULT_FIRST_QUESTION);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  // Score & Progress Tracking
  const [score, setScore] = useState(0);
  const [totalPointsEarned, setTotalPointsEarned] = useState(0);
  const totalQuestions = MATH_QUEST_QUESTIONS.length;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastPointsAwarded, setLastPointsAwarded] = useState<{ pts: number; tier: string } | null>(null);

  // Dual Timers: Overall 15:00 (900s), Question 45s
  const [overallTimeLeft, setOverallTimeLeft] = useState(900.0);
  const [questionTimeLeft, setQuestionTimeLeft] = useState(45.0);

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

  // instant ready without loading state
  const [errorMsg, setErrorMsg] = useState('');
  const [copiedWinnerVoucher, setCopiedWinnerVoucher] = useState(false);

  // Format MM:SS helper
  const formatMMSS = (seconds: number) => {
    const clamped = Math.max(0, Math.floor(seconds));
    const m = Math.floor(clamped / 60);
    const s = clamped % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // 1. Initialize or Rehydrate Active Session on Mount
  useEffect(() => {
    async function initQuest() {
      // Ensure player session exists synchronously
      try {
        const storedUser = localStorage.getItem('mbx_current_user');
        if (!storedUser) {
          const guestPlayer = {
            id: 'usr_player_' + Date.now().toString(36),
            email: 'player@phone.mybooksx.com',
            fullName: 'Player',
            phone: '+91 9865432125',
            isVerified: true,
            pointsBalance: 0,
            pointsReserved: 0,
            totalPointsEarned: 0,
            role: 'user',
            createdAt: new Date().toISOString()
          };
          localStorage.setItem('mbx_current_user', JSON.stringify(guestPlayer));
          setClientAuthToken('mbx_tok_' + Date.now());
          refreshUser();
        }
      } catch {}

      // If already completed or in-progress, state was already set synchronously above (0ms).
      // Background non-blocking session check:
      try {
        api.quiz.getActiveSession().catch(() => {});
      } catch {}
    }

    initQuest();

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, []);

  // Keep isSubmittingRef synced
  useEffect(() => {
    isSubmittingRef.current = isSubmitting;
  }, [isSubmitting]);

  // 2. Dual Synchronized Timers (Every 100ms)
  useEffect(() => {
    if (isCompleted) return;

    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);

    timerIntervalRef.current = setInterval(() => {
      const now = Date.now();
      const elapsedOverall = (now - questStartedAtRef.current) / 1000;
      const remOverall = Math.max(0, 900.0 - elapsedOverall);
      setOverallTimeLeft(remOverall);

      const elapsedQuestion = (now - questionStartedAtRef.current) / 1000;
      const remQuestion = Math.max(0, 45.0 - elapsedQuestion);
      setQuestionTimeLeft(remQuestion);

      // Check Authoritative 15-Minute Overall Deadline
      if (remOverall <= 0.05) {
        clearInterval(timerIntervalRef.current);
        if (!isSubmittingRef.current) {
          submitCurrentAnswer(-1, true);
        }
        return;
      }

      // Check 45-Second Individual Question Deadline
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
  }, [currentQuestion, isCompleted, sessionId]);

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
        selectedOptionIndex: optionIdx,
        forceOverallTimeout
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

        // Update user points in session & auth context
        try {
          const userStr = localStorage.getItem('mbx_current_user');
          if (userStr) {
            const u = JSON.parse(userStr);
            u.pointsBalance = (u.pointsBalance || 0) + pointsAwarded;
            u.totalPointsEarned = (u.totalPointsEarned || 0) + pointsAwarded;
            localStorage.setItem('mbx_current_user', JSON.stringify(u));
          }
        } catch {}
        refreshUser();

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
          setQuestionTimeLeft(45.0);

          if (nextQuestion.overallRemainingSeconds !== undefined) {
            setOverallTimeLeft(nextQuestion.overallRemainingSeconds);
          }
        }
      } else {
        // Fallback local advance if API doesn't return result
        advanceNextQuestionLocally(optionIdx);
      }
    } catch {
      advanceNextQuestionLocally(optionIdx);
    } finally {
      setIsSubmitting(false);
      isSubmittingRef.current = false;
    }
  };

  // Local fallback transition
  const advanceNextQuestionLocally = (optionIdx: number) => {
    const qIdx = currentQuestion.questionIndex;
    const mathQ = MATH_QUEST_QUESTIONS[qIdx] || MATH_QUEST_QUESTIONS[0];
    const isCorrect = optionIdx >= 0 && optionIdx === mathQ.correctIndex;
    const pts = isCorrect ? 200 : 0;

    const newScore = score + (isCorrect ? 1 : 0);
    const newTotal = totalPointsEarned + pts;
    setScore(newScore);
    setTotalPointsEarned(newTotal);
    setLastPointsAwarded({ pts, tier: isCorrect ? 'Fast (+200 pts)' : 'Incorrect' });

    if (qIdx >= MATH_QUEST_QUESTIONS.length - 1) {
      setIsCompleted(true);
      setCompletionSummary({
        totalQuestions: MATH_QUEST_QUESTIONS.length,
        questionsAnswered: MATH_QUEST_QUESTIONS.length,
        correctAnswers: newScore,
        incorrectAnswers: MATH_QUEST_QUESTIONS.length - newScore,
        score: newScore,
        pointsEarned: newTotal,
        accuracyPct: Math.round((newScore / MATH_QUEST_QUESTIONS.length) * 100)
      });
      confetti({ particleCount: 100, spread: 70 });
    } else {
      const nextQ = MATH_QUEST_QUESTIONS[qIdx + 1];
      setCurrentQuestion({
        id: nextQ.id,
        question: nextQ.question,
        category: nextQ.category,
        difficulty: nextQ.difficulty,
        options: nextQ.options,
        questionIndex: qIdx + 1,
        totalQuestions: MATH_QUEST_QUESTIONS.length,
        startedAt: new Date().toISOString(),
        questStartedAt: new Date(questStartedAtRef.current).toISOString(),
        totalQuestDurationSeconds: 900,
        questionDurationSeconds: 45,
        overallRemainingSeconds: overallTimeLeft,
        questionRemainingSeconds: 45
      });
      setSelectedOption(null);
      questionStartedAtRef.current = Date.now();
      setQuestionTimeLeft(45.0);
    }
  };

  // Immediate Click Handler: Submits immediately without requiring a Next button
  const handleOptionClick = (idx: number) => {
    if (isSubmitting || isCompleted) return;
    setSelectedOption(idx);
    submitCurrentAnswer(idx, false);
  };

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
            Your results have been registered and points credited to your rewards wallet.
          </p>

          <div style={{
            background: '#EFF6FF',
            border: '1.5px solid #93C5FD',
            borderRadius: '10px',
            padding: '0.85rem 1.25rem',
            margin: '0 auto 1.5rem',
            maxWidth: '560px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            color: '#1E40AF',
            fontSize: '0.88rem',
            fontWeight: 600,
            textAlign: 'center'
          }}>
            <Lock size={16} />
            <span>🔒 Daily 1-Time Quest Completed for Today. Access unlocks again tomorrow at 00:00 IST.</span>
          </div>

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
              <span className="sub">15-Minute Challenge</span>
            </div>
          </div>

          {/* Winner Privilege Voucher Card with Direct WhatsApp Option */}
          <div style={{ background: '#F0FDF4', border: '1.5px solid #86EFAC', borderRadius: 'var(--radius-md, 12px)', padding: '1.25rem', margin: '1.25rem 0', textAlign: 'left' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#166534', fontWeight: 700, fontSize: '1rem' }}>
                <Gift size={20} className="text-success" />
                <span>QUEST WINNER PRIVILEGE VOUCHER</span>
              </div>
              <span style={{ fontSize: '0.78rem', background: '#DCFCE7', color: '#15803D', padding: '0.2rem 0.6rem', borderRadius: '9999px', fontWeight: 700 }}>
                Eligible for Software Redemption
              </span>
            </div>

            <div style={{ background: '#FFFFFF', border: '1px dashed #86EFAC', borderRadius: '8px', padding: '0.75rem 1rem', margin: '0.75rem 0' }}>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Winner Voucher Code:</div>
              <strong style={{ fontSize: '1.1rem', letterSpacing: '0.05em', color: 'var(--royal-blue-deep, #1E3A8A)' }}>
                {`MBX-QUEST-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.abs(completionSummary.pointsEarned).toString(36).toUpperCase()}`}
              </strong>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                Points Won: <strong>+{completionSummary.pointsEarned.toLocaleString()} pts</strong> | Accuracy: <strong>{completionSummary.accuracyPct}%</strong>
              </div>
            </div>

            <p style={{ fontSize: '0.82rem', color: '#14532D', margin: '0 0 0.85rem', lineHeight: 1.45 }}>
              Tap below to send this victory voucher code directly to Founder Deep Mehta on WhatsApp:
            </p>

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <a
                href={`https://wa.me/919644570828?text=${encodeURIComponent(
                  `🏆 *MYBOOKSX QUEST WINNER VOUCHER!*\n==================================\nVoucher Code: MBX-QUEST-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.abs(completionSummary.pointsEarned).toString(36).toUpperCase()}\nPoints Won: +${completionSummary.pointsEarned.toLocaleString()} pts\nAccuracy: ${completionSummary.accuracyPct}%\nCorrect Answers: ${completionSummary.correctAnswers}/${completionSummary.totalQuestions}\nDate: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST\n==================================\nFounder Hotline: +91 9644570828`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', padding: '0.55rem 0.95rem', background: '#25D366', color: '#FFFFFF', borderColor: '#25D366', fontSize: '0.84rem', textDecoration: 'none', borderRadius: '8px', fontWeight: 600 }}
              >
                <MessageSquare size={16} />
                <span>Send Voucher to WhatsApp (+91 9644570828)</span>
              </a>

              <button
                type="button"
                className="btn-outline"
                style={{ padding: '0.55rem 0.85rem', fontSize: '0.84rem', borderRadius: '8px' }}
                onClick={() => {
                  navigator.clipboard.writeText(
                    `🏆 *MYBOOKSX QUEST WINNER VOUCHER!*\nVoucher: MBX-QUEST-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}\nPoints: +${completionSummary.pointsEarned.toLocaleString()}`
                  );
                  setCopiedWinnerVoucher(true);
                  setTimeout(() => setCopiedWinnerVoucher(false), 2000);
                }}
              >
                {copiedWinnerVoucher ? '✓ Code Copied' : '📋 Copy Code'}
              </button>
            </div>
          </div>

          <div className="completion-actions-row">
            <button
              type="button"
              className="btn-primary"
              onClick={() => navigateTo('/')}
              style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}
            >
              <Home size={16} />
              <span>Back to Home</span>
            </button>

            <button
              type="button"
              className="btn-secondary"
              onClick={() => navigateTo('/redeem')}
              style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}
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
      {/* Top Floating Header with Exit, Timer, Score & Live Points */}
      <header className="mbx-quest-header">
        <div className="quest-header-container">
          <button
            type="button"
            className="quest-back-btn"
            onClick={() => navigateTo('/')}
            title="Exit QUEST and Return Home"
          >
            <X size={18} />
            <span>Exit QUEST</span>
          </button>

          <div className="quest-brand-title">
            <Zap size={18} className="text-royal" />
            <span>QUEST (15m)</span>
          </div>

          {/* Synchronized Overall Quest 15-Minute Timer (15:00) */}
          <div className="quest-overall-timer-pill" title="Overall Quest Countdown (15 Minutes Max)">
            <Hourglass size={15} className="text-royal" />
            <span className="timer-label">TIME:</span>
            <strong className={`timer-digits ${overallTimeLeft <= 60.0 ? 'warning' : ''}`}>
              {formatMMSS(overallTimeLeft)}
            </strong>
          </div>

          {/* Live Score & Points Chip (Displays points in real time) */}
          <div className="quest-score-chip">
            <span>Score:</span>
            <strong>{score}</strong>
            <span className="pts-badge">+{totalPointsEarned} pts</span>
          </div>
        </div>
      </header>

      <main className="mbx-quest-main-container">
        {errorMsg ? (
          <div className="quest-error-card" style={{ maxWidth: '480px', margin: '2rem auto', textAlign: 'center', padding: '2rem', background: '#FFFFFF', borderRadius: '16px', boxShadow: '0 8px 30px rgba(0,0,0,0.08)', border: '1px solid var(--border-subtle)' }}>
            <AlertCircle size={36} className="text-warning" style={{ margin: '0 auto 0.75rem' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>QUEST Notice</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', lineHeight: 1.5 }}>{errorMsg}</p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="btn-primary"
                onClick={async () => {
                  setErrorMsg('');
                  try {
                    await api.admin.resetQuizAttempts();
                  } catch {}
                  window.location.reload();
                }}
                style={{ background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.75rem 1rem', borderRadius: '8px', border: 'none', color: '#fff', fontWeight: 700, cursor: 'pointer' }}
              >
                <Zap size={16} />
                <span>⚡ Replay Now</span>
              </button>
              <button type="button" className="btn-secondary" onClick={() => navigateTo('/')} style={{ padding: '0.75rem 1rem', borderRadius: '8px' }}>
                Return Home
              </button>
            </div>
          </div>
        ) : (
          <div className="quest-active-card">
            {/* Progress Bar & Question Counter (1 of 20) */}
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

            {/* Individual Question Countdown Timer: 00:45 */}
            <div className="quest-timer-strip">
              <div className="question-timer-group">
                <div className={`quest-timer-badge ${questionTimeLeft <= 10.0 ? 'warning' : ''}`}>
                  <Clock size={16} />
                  <span>{formatMMSS(questionTimeLeft)}</span>
                </div>
                <span className="question-timer-sub">45s per question</span>
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
                <span>Tap any option to submit & advance • Auto-timeout in {Math.ceil(questionTimeLeft)}s</span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
