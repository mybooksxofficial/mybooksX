/**
 * MyBooksX Quiz Arena Modal
 * Server-authoritative 15-second speed competition with immediate feedback and instant point rewards.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { api } from '../services/apiClient.ts';
import type { ClientQuestion, AnswerSubmissionResult } from '../server/quizService.ts';
import confetti from 'canvas-confetti';
import {
  X,
  Timer,
  Award,
  Zap,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RefreshCw,
  Trophy,
  ShoppingBag,
  ShieldAlert,
  Play
} from 'lucide-react';
import './QuizArenaModal.css';

export const QuizArenaModal: React.FC = () => {
  const {
    isQuizModalOpen,
    quizMode,
    closeQuizModal,
    openAuthModal,
    openLeaderboardModal,
    openRewardsModal,
    user,
    isAuthenticated,
    refreshUser
  } = useAuth();

  // Arena session state
  const [gameState, setGameState] = useState<'idle' | 'loading' | 'playing' | 'answered' | 'completed' | 'daily_locked'>('idle');
  const [sessionId, setSessionId] = useState<string>('');
  const [currentQ, setCurrentQ] = useState<ClientQuestion | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(15);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answerResult, setAnswerResult] = useState<AnswerSubmissionResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [completedSummary, setCompletedSummary] = useState<AnswerSubmissionResult['quizSummary'] | null>(null);

  // Timer ref
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  // Submit answer callback
  const submitCurrentAnswer = useCallback(async (optionIdx: number) => {
    if (!sessionId || !currentQ || isSubmitting) return;

    clearTimer();
    setIsSubmitting(true);
    setSelectedOption(optionIdx);

    try {
      const res = await api.quiz.submitAnswer({
        sessionId,
        questionId: currentQ.id,
        selectedOptionIndex: optionIdx
      });

      if (res.success && res.result) {
        setAnswerResult(res.result);
        setGameState('answered');

        if (res.result.isQuizCompleted) {
          setCompletedSummary(res.result.quizSummary || null);
          await refreshUser();
          if ((res.result.quizSummary?.score || 0) >= 3) {
            try {
              confetti({ particleCount: 90, spread: 65, origin: { y: 0.6 } });
            } catch {
              // Ignore
            }
          }
        }
      } else {
        setErrorMsg(res.message || 'Failed to submit answer.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Network error.');
    } finally {
      setIsSubmitting(false);
    }
  }, [sessionId, currentQ, isSubmitting, refreshUser]);

  // Start 15-second countdown timer for current question
  useEffect(() => {
    if (gameState === 'playing' && currentQ) {
      setTimeLeft(15);
      clearTimer();

      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearTimer();
            // Auto submit timeout
            submitCurrentAnswer(-1);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearTimer();
  }, [gameState, currentQ, submitCurrentAnswer]);

  // Start quiz session
  const initQuiz = async (mode: 'daily' | 'practice') => {
    setErrorMsg('');
    setGameState('loading');
    setSelectedOption(null);
    setAnswerResult(null);

    try {
      const res = await api.quiz.startQuiz(mode);
      if (res.success && res.firstQuestion && res.sessionId) {
        setSessionId(res.sessionId);
        setCurrentQ(res.firstQuestion);
        setGameState('playing');
      } else {
        if (res.message?.includes('already completed')) {
          setGameState('daily_locked');
        } else {
          setErrorMsg(res.message || 'Unable to start quiz.');
          setGameState('idle');
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Network failure starting quiz.');
      setGameState('idle');
    }
  };

  // On modal open, evaluate user state
  useEffect(() => {
    if (isQuizModalOpen) {
      if (isAuthenticated && user?.isVerified) {
        initQuiz(quizMode);
      } else {
        setGameState('idle');
      }
    } else {
      clearTimer();
      setGameState('idle');
    }
  }, [isQuizModalOpen, isAuthenticated, user, quizMode]);

  if (!isQuizModalOpen) return null;

  const handleNextQuestion = () => {
    if (answerResult?.isQuizCompleted) {
      setGameState('completed');
    } else if (answerResult?.nextQuestion) {
      setCurrentQ(answerResult.nextQuestion);
      setSelectedOption(null);
      setAnswerResult(null);
      setGameState('playing');
    }
  };

  return (
    <div className="quiz-arena-overlay" onClick={closeQuizModal}>
      <div className="quiz-arena-card" onClick={e => e.stopPropagation()}>
        <button
          type="button"
          className="arena-close-btn"
          onClick={closeQuizModal}
          aria-label="Close Quiz Arena"
        >
          <X size={18} />
        </button>

        {/* 1. GUEST / UNVERIFIED USER STATE */}
        {(!isAuthenticated || !user?.isVerified) && (
          <div className="arena-completion-view">
            <div className="arena-award-icon" style={{ background: 'var(--color-peach-light)', color: 'var(--color-espresso)' }}>
              <ShieldAlert size={36} />
            </div>
            <h2>Verification Required</h2>
            <p style={{ color: 'var(--text-secondary)', margin: '0.75rem 0 1.5rem', lineHeight: 1.5 }}>
              {!isAuthenticated
                ? 'Please create an account or sign in to enter the MyBooksX Quiz Arena and earn speed rewards.'
                : 'Please verify your email address to unlock official daily competitions and reward point redemptions.'}
            </p>
            <button
              type="button"
              className="mbx-btn-submit"
              onClick={() => {
                closeQuizModal();
                openAuthModal(!isAuthenticated ? 'login' : 'verify');
              }}
            >
              <span>{!isAuthenticated ? 'Sign In / Register' : 'Verify My Email'}</span>
              <ArrowRight size={16} />
            </button>
          </div>
        )}

        {/* 2. DAILY ALREADY COMPLETED STATE */}
        {isAuthenticated && user?.isVerified && gameState === 'daily_locked' && (
          <div className="arena-completion-view">
            <div className="arena-award-icon">
              <CheckCircle2 size={36} />
            </div>
            <h2>Today's Competition Completed!</h2>
            <p style={{ color: 'var(--text-secondary)', margin: '0.75rem 0 1.5rem', lineHeight: 1.5 }}>
              You have already finished today's Daily Quiz challenge. New questions arrive at midnight! In the meantime, you can sharpen your speed in Practice Mode.
            </p>
            <div className="arena-completion-actions">
              <button
                type="button"
                className="mbx-btn-submit"
                onClick={() => initQuiz('practice')}
              >
                <Play size={16} />
                <span>Play Practice Mode (Anytime)</span>
              </button>
              <button
                type="button"
                className="arena-option-btn"
                style={{ justifyContent: 'center', textAlign: 'center' }}
                onClick={() => {
                  closeQuizModal();
                  openLeaderboardModal();
                }}
              >
                <Trophy size={16} className="text-royal" />
                <span>View Live Leaderboard</span>
              </button>
            </div>
          </div>
        )}

        {/* 3. LOADING STATE */}
        {gameState === 'loading' && (
          <div style={{ textAlign: 'center', padding: '3.5rem 1rem' }}>
            <RefreshCw size={36} className="spin text-royal" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Preparing Your Question Session...</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Measuring secure edge server latency and locking speed tiers.
            </p>
          </div>
        )}

        {/* 4. ACTIVE QUESTION ARENA */}
        {(gameState === 'playing' || gameState === 'answered') && currentQ && (
          <div>
            <div className="arena-header">
              <div className="arena-tag-row">
                <span className="arena-category-tag">{currentQ.category}</span>
                <span className="arena-mode-badge">
                  {quizMode === 'daily' ? 'Daily Competition' : 'Practice Mode'}
                </span>
              </div>
              <div className={`arena-timer-pill ${timeLeft <= 4 ? 'urgent' : ''}`}>
                <Timer size={16} />
                <span>{timeLeft}s</span>
              </div>
            </div>

            <div className="arena-progress-wrap">
              <div className="arena-progress-meta">
                <span>Question {currentQ.questionIndex + 1} of {currentQ.totalQuestions}</span>
                <span>Speed Points: Up to 100 pts</span>
              </div>
              <div className="arena-progress-bar">
                <div
                  className="arena-progress-fill"
                  style={{
                    width: `${((currentQ.questionIndex + 1) / currentQ.totalQuestions) * 100}%`
                  }}
                />
              </div>
            </div>

            <h3 className="arena-question-title">{currentQ.question}</h3>

            <div className="arena-options-grid">
              {currentQ.options.map((opt, idx) => {
                let stateClass = '';
                if (gameState === 'answered' && idx === selectedOption) {
                  stateClass = 'selected-option';
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    className={`arena-option-btn ${stateClass}`}
                    onClick={() => submitCurrentAnswer(idx)}
                    disabled={gameState === 'answered' || isSubmitting}
                  >
                    <span className="arena-opt-letter">{String.fromCharCode(65 + idx)}</span>
                    <span className="arena-opt-text">{opt}</span>
                  </button>
                );
              })}
            </div>

            {/* Answer Result Banner */}
            {gameState === 'answered' && answerResult && (
              <div className="arena-feedback-box correct">
                <div className="feedback-row">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Zap size={16} className="text-royal" />
                    <strong>{answerResult.pointsAwarded > 0 ? `+${answerResult.pointsAwarded} pts` : '+0 pts'}</strong>
                  </div>
                  <div className="feedback-speed-badge">
                    <span>{answerResult.speedTier}</span>
                  </div>
                </div>
                <button
                  type="button"
                  className="mbx-btn-submit"
                  style={{ marginTop: '0.85rem' }}
                  onClick={handleNextQuestion}
                >
                  <span>{answerResult.isQuizCompleted ? 'View Final Results' : 'Next Question'}</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            )}

            {/* Speed Rules Strip */}
            <div className="arena-speed-legend">
              <span>⚡ 0–3s: <strong>100 pts</strong></span>
              <span>4–6s: <strong>85 pts</strong></span>
              <span>7–9s: <strong>70 pts</strong></span>
              <span>10–12s: <strong>50 pts</strong></span>
              <span>13–15s: <strong>30 pts</strong></span>
            </div>
          </div>
        )}

        {/* 5. QUIZ COMPLETED VIEW */}
        {gameState === 'completed' && completedSummary && (
          <div className="arena-completion-view">
            <div className="arena-award-icon">
              <Award size={40} />
            </div>
            <h2>Quiz Round Complete!</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginTop: '0.35rem' }}>
              {quizMode === 'daily'
                ? 'Your points have been recorded in your wallet and on the live leaderboard.'
                : 'Practice run complete! Ready to compete in the Daily Quiz?'}
            </p>

            <div className="arena-score-stats">
              <div className="arena-stat-box">
                <span>Score</span>
                <strong>{completedSummary.score} / {completedSummary.totalQuestions}</strong>
              </div>
              <div className="arena-stat-box">
                <span>Points Earned</span>
                <strong style={{ color: 'var(--royal-blue)' }}>+{completedSummary.pointsEarned}</strong>
              </div>
              <div className="arena-stat-box">
                <span>Accuracy</span>
                <strong>{completedSummary.accuracyPct}%</strong>
              </div>
            </div>

            <div className="arena-completion-actions">
              <button
                type="button"
                className="mbx-btn-submit"
                onClick={() => {
                  closeQuizModal();
                  openLeaderboardModal();
                }}
              >
                <Trophy size={16} />
                <span>View Leaderboard Standings</span>
              </button>

              <button
                type="button"
                className="arena-option-btn"
                style={{ justifyContent: 'center' }}
                onClick={() => {
                  closeQuizModal();
                  openRewardsModal();
                }}
              >
                <ShoppingBag size={16} className="text-royal" />
                <span>Visit MyBooksX Rewards Store</span>
              </button>
            </div>
          </div>
        )}

        {/* Errors */}
        {errorMsg && (
          <div className="mbx-auth-alert error" style={{ marginTop: '1rem' }}>
            <XCircle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>
    </div>
  );
};

