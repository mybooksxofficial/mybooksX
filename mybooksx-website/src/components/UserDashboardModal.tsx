/**
 * Personalized User Dashboard & Promotional Wallet Modal
 * Central account hub showing points balance, active subscriptions, quiz stats, and audit transactions.
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { api } from '../services/apiClient.ts';
import type {
  ActiveSubscriptionRecord,
  RedemptionRecord,
  WalletTransactionRecord
} from '../server/rewardsService.ts';
import {
  X,
  User,
  Wallet,
  Layers,
  History,
  Clock,
  ExternalLink,
  Play,
  ShoppingBag,
  LogOut,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import './UserDashboardModal.css';

export const UserDashboardModal: React.FC = () => {
  const {
    isDashboardModalOpen,
    dashboardTab,
    closeDashboardModal,
    openQuizModal,
    openRewardsModal,
    user,
    logout
  } = useAuth();

  const [activeTab, setActiveTab] = useState<'overview' | 'wallet' | 'subscriptions' | 'history'>('overview');
  const [subscriptions, setSubscriptions] = useState<ActiveSubscriptionRecord[]>([]);
  const [redemptions, setRedemptions] = useState<RedemptionRecord[]>([]);
  const [transactions, setTransactions] = useState<WalletTransactionRecord[]>([]);
  const [dailyStatus, setDailyStatus] = useState<{ canPlayDaily: boolean; todayPointsEarned: number } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (dashboardTab) {
      setActiveTab(dashboardTab);
    }
  }, [dashboardTab]);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const [subsRes, redRes, walletRes, dailyRes] = await Promise.all([
        api.rewards.getMySubscriptions(),
        api.rewards.getMyRedemptions(),
        api.rewards.getMyWallet(),
        api.quiz.getDailyStatus()
      ]);

      if (subsRes.success) setSubscriptions(subsRes.subscriptions || []);
      if (redRes.success) setRedemptions(redRes.redemptions || []);
      if (walletRes.success) setTransactions(walletRes.transactions || []);
      if (dailyRes.success) setDailyStatus(dailyRes);
    } catch (err) {
      console.error('Failed to load dashboard data', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isDashboardModalOpen && user) {
      loadDashboardData();
    }
  }, [isDashboardModalOpen, user]);

  if (!isDashboardModalOpen || !user) return null;

  return (
    <div className="dashboard-modal-overlay" onClick={closeDashboardModal}>
      <div className="dashboard-card" onClick={e => e.stopPropagation()}>
        <button
          type="button"
          className="arena-close-btn"
          onClick={closeDashboardModal}
          aria-label="Close Dashboard"
        >
          <X size={18} />
        </button>

        {/* User Hero Header */}
        <div className="dashboard-user-hero">
          <div className="dash-avatar-row">
            <div className="dash-avatar-circle">
              {user.fullName.charAt(0).toUpperCase()}
            </div>
            <div className="dash-user-names">
              <strong>{user.fullName}</strong>
              <span>{user.email}</span>
              <div>
                <span className="dash-verified-badge">
                  <CheckCircle2 size={13} />
                  <span>Email Verified Member</span>
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.65rem' }}>
            <button
              type="button"
              className="arena-option-btn"
              style={{ width: 'auto', padding: '0.5rem 0.85rem', fontSize: '0.84rem' }}
              onClick={async () => {
                await logout();
                closeDashboardModal();
              }}
            >
              <LogOut size={15} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Nav Tabs */}
        <div className="dashboard-nav-tabs">
          <button
            type="button"
            className={`dash-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <User size={15} />
            <span>Overview</span>
          </button>
          <button
            type="button"
            className={`dash-tab-btn ${activeTab === 'subscriptions' ? 'active' : ''}`}
            onClick={() => setActiveTab('subscriptions')}
          >
            <Layers size={15} />
            <span>Active Apps ({subscriptions.length})</span>
          </button>
          <button
            type="button"
            className={`dash-tab-btn ${activeTab === 'wallet' ? 'active' : ''}`}
            onClick={() => setActiveTab('wallet')}
          >
            <Wallet size={15} />
            <span>My Wallet</span>
          </button>
          <button
            type="button"
            className={`dash-tab-btn ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            <History size={15} />
            <span>Redemption Requests</span>
          </button>
        </div>

        {isLoading && (
          <div style={{ textAlign: 'center', padding: '1rem' }}>
            <RefreshCw size={22} className="spin text-royal" />
          </div>
        )}

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div>
            <div className="dash-metrics-grid">
              <div className="dash-metric-card">
                <span>Available Points</span>
                <strong>{user.pointsBalance.toLocaleString()}</strong>
              </div>
              <div className="dash-metric-card">
                <span>Total Earned</span>
                <strong style={{ color: 'var(--color-espresso)' }}>
                  {user.totalPointsEarned.toLocaleString()}
                </strong>
              </div>
              <div className="dash-metric-card">
                <span>Reserved Points</span>
                <strong style={{ color: '#D97706' }}>
                  {user.pointsReserved.toLocaleString()}
                </strong>
              </div>
              <div className="dash-metric-card">
                <span>Active Apps</span>
                <strong style={{ color: '#059669' }}>{subscriptions.length}</strong>
              </div>
            </div>

            {/* Daily Quiz Availability Card */}
            <div
              style={{
                background: 'linear-gradient(135deg, var(--royal-blue-light), #FFFFFF)',
                border: '1.5px solid var(--royal-blue)',
                borderRadius: 'var(--radius-md)',
                padding: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1.5rem'
              }}
            >
              <div>
                <strong style={{ display: 'block', fontSize: '1rem', color: 'var(--royal-blue-deep)' }}>
                  {dailyStatus?.canPlayDaily
                    ? '🎯 Today\'s Daily Competition is Ready!'
                    : '✅ Daily Quiz Completed for Today'}
                </strong>
                <span style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                  {dailyStatus?.canPlayDaily
                    ? 'Earn up to 500 bonus speed points for your wallet and climb the global ranks.'
                    : `You earned +${dailyStatus?.todayPointsEarned} points today. Practice mode remains available.`}
                </span>
              </div>
              <button
                type="button"
                className="btn-primary"
                style={{ padding: '0.6rem 1rem', fontSize: '0.86rem' }}
                onClick={() => {
                  closeDashboardModal();
                  openQuizModal(dailyStatus?.canPlayDaily ? 'daily' : 'practice');
                }}
              >
                <Play size={15} />
                <span>{dailyStatus?.canPlayDaily ? 'Play Daily' : 'Practice'}</span>
              </button>
            </div>

            {/* Quick Rewards Store Banner */}
            <div
              style={{
                background: 'var(--bg-page)',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-md)',
                padding: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <strong style={{ display: 'block', fontSize: '1rem', color: 'var(--text-primary)' }}>
                  MyBooksX Rewards Store
                </strong>
                <span style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                  Redeem DocTracker, Trip-X, Tracker-X, Expense-X or the Premium Bundle.
                </span>
              </div>
              <button
                type="button"
                className="arena-option-btn"
                style={{ width: 'auto', padding: '0.6rem 1rem', fontSize: '0.86rem' }}
                onClick={() => {
                  closeDashboardModal();
                  openRewardsModal();
                }}
              >
                <ShoppingBag size={15} className="text-royal" />
                <span>Browse Store</span>
              </button>
            </div>
          </div>
        )}

        {/* ACTIVE APPS / SUBSCRIPTIONS TAB */}
        {activeTab === 'subscriptions' && (
          <div>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Active Software Subscriptions</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', marginBottom: '1.25rem' }}>
              Your 30-day promotional licenses unlocked through quiz performance.
            </p>

            {subscriptions.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2.5rem', background: 'var(--bg-page)', borderRadius: 'var(--radius-md)' }}>
                <Layers size={32} style={{ color: 'var(--text-muted)', margin: '0 auto 0.5rem' }} />
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  You do not have any active software subscriptions yet.
                </p>
                <button
                  type="button"
                  className="btn-primary"
                  style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}
                  onClick={() => {
                    closeDashboardModal();
                    openRewardsModal();
                  }}
                >
                  <ShoppingBag size={15} />
                  <span>Redeem an Application</span>
                </button>
              </div>
            ) : (
              <div className="sub-cards-list">
                {subscriptions.map(sub => (
                  <div key={sub.id} className="sub-card">
                    <div className="sub-card-header">
                      <div>
                        <strong style={{ fontSize: '1.05rem', color: 'var(--text-primary)' }}>
                          {sub.rewardTitle}
                        </strong>
                        <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                          Valid until {new Date(sub.expiresAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="reward-duration-badge" style={{ margin: 0, background: '#DEF7EC', color: '#03543F' }}>
                        <Clock size={12} />
                        <span>{sub.daysRemaining} Days Remaining</span>
                      </div>
                    </div>

                    <div className="sub-license-box">
                      <span>KEY: {sub.licenseKey}</span>
                      <a
                        href={sub.accessUrl}
                        target="_blank"
                        rel="noreferrer"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: 'var(--royal-blue)', fontWeight: 600, textDecoration: 'none' }}
                      >
                        <span>Launch App</span>
                        <ExternalLink size={13} />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* MY WALLET LEDGER TAB */}
        {activeTab === 'wallet' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem' }}>My Points Ledger</h3>
                <span style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                  Complete double-entry audit history of every point earned, reserved, and redeemed.
                </span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Balance</span>
                <div style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--royal-blue)', fontFamily: 'var(--font-heading)' }}>
                  {user.pointsBalance.toLocaleString()} pts
                </div>
              </div>
            </div>

            {transactions.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', background: 'var(--bg-page)', borderRadius: 'var(--radius-md)', color: 'var(--text-secondary)' }}>
                No points transactions recorded yet.
              </div>
            ) : (
              <div className="wallet-table-wrap">
                <table className="wallet-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Description</th>
                      <th>Amount</th>
                      <th>Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map(tx => (
                      <tr key={tx.id}>
                        <td>{new Date(tx.createdAt).toLocaleDateString()}</td>
                        <td>{tx.description}</td>
                        <td className={tx.amount >= 0 ? 'wallet-amount-positive' : 'wallet-amount-negative'}>
                          {tx.amount > 0 ? `+${tx.amount}` : tx.amount}
                        </td>
                        <td>{tx.balanceAfter.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* REDEMPTION HISTORY TAB */}
        {activeTab === 'history' && (
          <div>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Redemption Request Statuses</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', marginBottom: '1.25rem' }}>
              Track the progress of your submitted software redemptions.
            </p>

            {redemptions.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2.5rem', background: 'var(--bg-page)', borderRadius: 'var(--radius-md)', color: 'var(--text-secondary)' }}>
                You have not submitted any software redemption requests yet.
              </div>
            ) : (
              <div className="sub-cards-list">
                {redemptions.map(r => (
                  <div key={r.id} className="sub-card">
                    <div className="sub-card-header">
                      <div>
                        <strong style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>
                          {r.rewardTitle}
                        </strong>
                        <span style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                          Ref: {r.redemptionCode} • {new Date(r.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <div
                        style={{
                          padding: '0.25rem 0.65rem',
                          borderRadius: 'var(--radius-full)',
                          fontSize: '0.76rem',
                          fontWeight: 700,
                          background:
                            r.status === 'Approved' ? '#DEF7EC' : r.status === 'Pending' ? '#FEF3C7' : '#FDF2F2',
                          color:
                            r.status === 'Approved' ? '#03543F' : r.status === 'Pending' ? '#92400E' : '#9B1C1C'
                        }}
                      >
                        {r.status === 'Pending' ? '⏳ Under Review' : r.status === 'Approved' ? '✅ Approved' : '❌ Rejected'}
                      </div>
                    </div>

                    {r.deliveryDetails && (
                      <div className="sub-license-box">
                        <span>{r.deliveryDetails}</span>
                      </div>
                    )}

                    {r.rejectionReason && (
                      <div style={{ fontSize: '0.8rem', color: '#9B1C1C', marginTop: '0.5rem' }}>
                        Rejection Reason: {r.rejectionReason}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
