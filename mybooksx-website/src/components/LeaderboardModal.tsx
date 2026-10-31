/**
 * Live Leaderboard Modal
 * Shows global standings, weekly competition ranks, top 10 players, and user's current position.
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { api } from '../services/apiClient.ts';
import type { LeaderboardResponse } from '../server/leaderboardService.ts';
import { X, Trophy, Medal, RefreshCw, Flame, Play } from 'lucide-react';
import './LeaderboardModal.css';

export const LeaderboardModal: React.FC = () => {
  const {
    isLeaderboardModalOpen,
    closeLeaderboardModal,
    openQuizModal,
    user
  } = useAuth();

  const [mode, setMode] = useState<'global' | 'weekly'>('global');
  const [data, setData] = useState<LeaderboardResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchLeaderboard = async (selectedMode: 'global' | 'weekly') => {
    setIsLoading(true);
    try {
      const res = await api.leaderboard.getLeaderboard(selectedMode, 10);
      if (res.success && res.leaderboard) {
        setData(res.leaderboard);
      }
    } catch (err) {
      console.error('Failed to load leaderboard', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isLeaderboardModalOpen) {
      fetchLeaderboard(mode);
    }
  }, [isLeaderboardModalOpen, mode]);

  if (!isLeaderboardModalOpen) return null;

  const getRankBadgeClass = (rank: number) => {
    if (rank === 1) return 'gold';
    if (rank === 2) return 'silver';
    if (rank === 3) return 'bronze';
    return '';
  };

  return (
    <div className="leaderboard-overlay" onClick={closeLeaderboardModal}>
      <div className="leaderboard-card" onClick={e => e.stopPropagation()}>
        <button
          type="button"
          className="arena-close-btn"
          onClick={closeLeaderboardModal}
          aria-label="Close Leaderboard"
        >
          <X size={18} />
        </button>

        <div className="leaderboard-header">
          <div className="mbx-auth-brand-pill">
            <Trophy size={14} className="text-royal" />
            <span>Official Rankings</span>
          </div>
          <h2 className="mbx-auth-title">MyBooksX Arena Leaderboard</h2>
          <p className="mbx-auth-subtitle">
            Rankings calculated automatically from verified server response times.
          </p>

          <div className="leaderboard-tabs">
            <button
              type="button"
              className={`leaderboard-tab-btn ${mode === 'global' ? 'active' : ''}`}
              onClick={() => setMode('global')}
            >
              All-Time Global
            </button>
            <button
              type="button"
              className={`leaderboard-tab-btn ${mode === 'weekly' ? 'active' : ''}`}
              onClick={() => setMode('weekly')}
            >
              This Week <Flame size={13} className="inline-icon text-royal" />
            </button>
          </div>
        </div>

        {/* Current User Rank Sticky Card */}
        {data?.currentUserRank ? (
          <div className="user-rank-banner">
            <div className="rank-badge-col">
              <div className="rank-num-box">
                #{data.currentUserRank.rank}
              </div>
              <div className="rank-user-info">
                <strong>{data.currentUserRank.fullName} (You)</strong>
                <span>
                  {data.currentUserRank.questionsAnswered} Questions • {data.currentUserRank.accuracyPct}% Accuracy
                </span>
              </div>
            </div>
            <div className="rank-points-col">
              <strong>{data.currentUserRank.points.toLocaleString()}</strong>
              <span>Points Earned</span>
            </div>
          </div>
        ) : (
          user && (
            <div className="user-rank-banner" style={{ background: 'var(--bg-page)', borderColor: 'var(--border-light)' }}>
              <div className="rank-badge-col">
                <div className="rank-num-box" style={{ background: 'var(--color-taupe)' }}>
                  -
                </div>
                <div className="rank-user-info">
                  <strong>{user.fullName}</strong>
                  <span>Answer your first question to establish your official rank!</span>
                </div>
              </div>
              <button
                type="button"
                className="btn-primary"
                style={{ padding: '0.45rem 0.85rem', fontSize: '0.84rem' }}
                onClick={() => {
                  closeLeaderboardModal();
                  openQuizModal('daily');
                }}
              >
                <Play size={14} />
                <span>Play Now</span>
              </button>
            </div>
          )
        )}

        {/* Loading Spinner */}
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '2.5rem' }}>
            <RefreshCw size={28} className="spin text-royal" style={{ margin: '0 auto 0.5rem' }} />
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>Loading standings...</p>
          </div>
        ) : (
          <div className="leaderboard-list">
            {data?.topPlayers && data.topPlayers.length > 0 ? (
              data.topPlayers.map(entry => (
                <div
                  key={entry.userId}
                  className={`leaderboard-row ${entry.isCurrentUser ? 'highlight-current' : ''}`}
                >
                  <div className="row-left">
                    <div className={`row-rank ${getRankBadgeClass(entry.rank)}`}>
                      {entry.rank <= 3 ? <Medal size={16} /> : entry.rank}
                    </div>
                    <div className="row-user-details">
                      <strong>
                        {entry.fullName} {entry.isCurrentUser && '(You)'}
                      </strong>
                      <span>
                        {entry.questionsAnswered} answered • {entry.accuracyPct}% correct
                      </span>
                    </div>
                  </div>
                  <div className="row-right">
                    <div className="row-points">{entry.points.toLocaleString()} pts</div>
                    <span className="row-accuracy">Score</span>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                No rankings recorded yet for this period. Be the first to answer and top the board!
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
