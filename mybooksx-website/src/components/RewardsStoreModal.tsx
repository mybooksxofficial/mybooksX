/**
 * MyBooksX Rewards Store Modal
 * Displays luxury software cards with point costs, atomic reservation confirmation, and official receipt modal.
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { api } from '../services/apiClient.ts';
import type { RewardItem, RedemptionRecord } from '../server/rewardsService.ts';
import {
  X,
  ShoppingBag,
  Clock,
  Sparkles,
  FileText,
  Compass,
  Layers,
  Receipt,
  Crown,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ArrowRight,
  ShieldCheck,
  Printer
} from 'lucide-react';
import './RewardsStoreModal.css';

export const RewardsStoreModal: React.FC = () => {
  const {
    isRewardsModalOpen,
    closeRewardsModal,
    openAuthModal,
    openDashboardModal,
    user,
    isAuthenticated,
    refreshUser
  } = useAuth();

  const [rewards, setRewards] = useState<RewardItem[]>([]);
  const [userBalance, setUserBalance] = useState<number>(0);
  const [userReserved, setUserReserved] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Selected reward for confirmation
  const [selectedReward, setSelectedReward] = useState<RewardItem | null>(null);
  const [isConfirming, setIsConfirming] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Completed receipt
  const [receipt, setReceipt] = useState<RedemptionRecord | null>(null);

  const fetchCatalog = async () => {
    setIsLoading(true);
    try {
      const res = await api.rewards.getCatalog();
      if (res.success) {
        setRewards(res.rewards || []);
        setUserBalance(res.userBalance || 0);
        setUserReserved(res.userReserved || 0);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to load catalog');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isRewardsModalOpen) {
      fetchCatalog();
      setReceipt(null);
      setSelectedReward(null);
      setIsConfirming(false);
      setErrorMsg('');
    }
  }, [isRewardsModalOpen, user]);

  if (!isRewardsModalOpen) return null;

  const handleInitiateRedeem = (reward: RewardItem) => {
    if (!isAuthenticated) {
      closeRewardsModal();
      openAuthModal('login');
      return;
    }
    if (!user?.isVerified) {
      closeRewardsModal();
      openAuthModal('verify');
      return;
    }
    setSelectedReward(reward);
    setIsConfirming(true);
  };

  const handleConfirmRedeem = async () => {
    if (!selectedReward) return;
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const res = await api.rewards.redeem(selectedReward.id);
      if (res.success && res.redemption) {
        setReceipt(res.redemption);
        setIsConfirming(false);
        await refreshUser();
        await fetchCatalog();
      } else {
        setErrorMsg(res.message || 'Redemption request failed.');
        setIsConfirming(false);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Network error.');
      setIsConfirming(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRewardIcon = (iconName: string) => {
    switch (iconName) {
      case 'FileText': return <FileText size={22} />;
      case 'Compass': return <Compass size={22} />;
      case 'Layers': return <Layers size={22} />;
      case 'Receipt': return <Receipt size={22} />;
      case 'Crown': return <Crown size={22} />;
      default: return <Sparkles size={22} />;
    }
  };

  return (
    <div className="rewards-modal-overlay" onClick={closeRewardsModal}>
      <div className="rewards-modal-card" onClick={e => e.stopPropagation()}>
        <button
          type="button"
          className="arena-close-btn"
          onClick={closeRewardsModal}
          aria-label="Close Store"
        >
          <X size={18} />
        </button>

        {/* 1. CONFIRMATION RECEIPT VIEW */}
        {receipt ? (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
              <div className="arena-award-icon" style={{ background: '#DEF7EC', color: '#03543F' }}>
                <CheckCircle2 size={38} />
              </div>
              <h2 className="mbx-auth-title">Redemption Request Confirmed</h2>
              <p className="mbx-auth-subtitle">
                Your request has been queued for administrative activation. Save this confirmation receipt.
              </p>
            </div>

            <div className="receipt-wrapper">
              <div className="receipt-header-row">
                <div>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>RECEIPT REFERENCE</span>
                  <div className="receipt-code-badge">{receipt.redemptionCode}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>CURRENT STATUS</span>
                  <div style={{ fontWeight: 700, color: '#D97706' }}>⏳ {receipt.status}</div>
                </div>
              </div>

              <div className="receipt-grid">
                <div className="receipt-field">
                  <label>Applicant Name</label>
                  <strong>{receipt.userName}</strong>
                </div>
                <div className="receipt-field">
                  <label>Applicant Email</label>
                  <strong>{receipt.userEmail}</strong>
                </div>
                <div className="receipt-field">
                  <label>Selected Application</label>
                  <strong>{receipt.rewardTitle}</strong>
                </div>
                <div className="receipt-field">
                  <label>Promotional Points Reserved</label>
                  <strong>{receipt.pointsReserved.toLocaleString()} Points</strong>
                </div>
                <div className="receipt-field">
                  <label>Subscription Duration</label>
                  <strong>30 Days Access</strong>
                </div>
                <div className="receipt-field">
                  <label>Submission Date</label>
                  <strong>{new Date(receipt.createdAt).toLocaleString()}</strong>
                </div>
              </div>

              <div className="receipt-disclaimer-box">
                <strong>Legal Notice:</strong> This document is a promotional software redemption receipt, not a financial tax invoice or cash receipt. Points hold zero cash redemption value and cannot be withdrawn. App access credentials will be delivered upon administrative review.
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
              <button
                type="button"
                className="mbx-btn-submit"
                onClick={() => {
                  closeRewardsModal();
                  openDashboardModal('subscriptions');
                }}
              >
                <span>View in My Subscriptions</span>
                <ArrowRight size={15} />
              </button>
              <button
                type="button"
                className="arena-option-btn"
                style={{ width: 'auto', padding: '0 1.25rem' }}
                onClick={() => window.print()}
              >
                <Printer size={16} />
                <span>Print Receipt</span>
              </button>
            </div>
          </div>
        ) : isConfirming && selectedReward ? (
          /* 2. PRE-REDEMPTION CONFIRMATION DIALOG */
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div className="arena-award-icon">
              <ShoppingBag size={36} />
            </div>
            <h2 className="mbx-auth-title">Confirm Software Redemption</h2>
            <p className="mbx-auth-subtitle" style={{ maxWidth: '480px', margin: '0.5rem auto 1.5rem' }}>
              You are about to redeem 30 days of access to <strong>{selectedReward.title}</strong> in exchange for{' '}
              <strong>{selectedReward.pointsCost.toLocaleString()} points</strong>.
            </p>

            <div style={{ background: 'var(--bg-page)', padding: '1.25rem', borderRadius: 'var(--radius-md)', textAlign: 'left', maxWidth: '440px', margin: '0 auto 1.5rem', border: '1px solid var(--border-light)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Current Balance:</span>
                <strong>{userBalance.toLocaleString()} pts</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#DC2626' }}>
                <span>Points to Reserve:</span>
                <strong>- {selectedReward.pointsCost.toLocaleString()} pts</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.5rem', borderTop: '1px solid var(--border-light)', fontSize: '0.94rem' }}>
                <span style={{ fontWeight: 600 }}>Balance After Reservation:</span>
                <strong style={{ color: 'var(--royal-blue)' }}>{(userBalance - selectedReward.pointsCost).toLocaleString()} pts</strong>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', maxWidth: '440px', margin: '0 auto' }}>
              <button
                type="button"
                className="mbx-btn-submit"
                onClick={handleConfirmRedeem}
                disabled={isSubmitting}
              >
                {isSubmitting ? <RefreshCw size={16} className="spin" /> : <ShieldCheck size={16} />}
                <span>{isSubmitting ? 'Reserving Points...' : 'Confirm & Reserve'}</span>
              </button>
              <button
                type="button"
                className="arena-option-btn"
                style={{ width: 'auto' }}
                onClick={() => setIsConfirming(false)}
                disabled={isSubmitting}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          /* 3. CATALOG LISTING VIEW */
          <div>
            <div className="leaderboard-header">
              <div className="mbx-auth-brand-pill">
                <Crown size={14} className="text-royal" />
                <span>MyBooksX Software Rewards</span>
              </div>
              <h2 className="mbx-auth-title">Redeem Full Software Subscriptions</h2>
              <p className="mbx-auth-subtitle">
                Convert your quiz victory points into 30-day enterprise application licenses.
              </p>
            </div>

            {/* Prominent Balance Banner */}
            <div className="rewards-balance-header">
              <div className="balance-title-block">
                <strong>{isAuthenticated ? `Hello, ${user?.fullName}` : 'Promotional Wallet'}</strong>
                <span>
                  {isAuthenticated
                    ? userReserved > 0
                      ? `${userReserved.toLocaleString()} points currently reserved in pending reviews.`
                      : 'Points available for instant software redemptions.'
                    : 'Sign in to see your points balance and redeem awards.'}
                </span>
              </div>
              <div className="balance-value-block">
                <strong>{isAuthenticated ? userBalance.toLocaleString() : '0'}</strong>
                <span>Available Points</span>
              </div>
            </div>

            {errorMsg && (
              <div className="mbx-auth-alert error" style={{ marginBottom: '1.25rem' }}>
                <AlertCircle size={16} />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Catalog Grid */}
            {isLoading ? (
              <div style={{ textAlign: 'center', padding: '3rem' }}>
                <RefreshCw size={32} className="spin text-royal" style={{ margin: '0 auto 0.75rem' }} />
                <p style={{ color: 'var(--text-secondary)' }}>Loading flagship rewards catalog...</p>
              </div>
            ) : (
              <div className="rewards-store-grid">
                {rewards.map(reward => {
                  const isBundle = reward.code === 'PREMIUM_BUNDLE';
                  const isInsufficient = isAuthenticated && userBalance < reward.pointsCost;
                  const isPending = reward.userStatus === 'pending_review';
                  const isActive = reward.userStatus === 'active_subscription';

                  let btnLabel = 'Redeem Application';
                  if (!isAuthenticated) btnLabel = 'Sign In to Redeem';
                  else if (isActive) btnLabel = 'Already Active (30 Days)';
                  else if (isPending) btnLabel = 'Redemption Under Review';
                  else if (isInsufficient) btnLabel = 'Insufficient Points';

                  return (
                    <div
                      key={reward.id}
                      className={`reward-card ${isBundle ? 'featured-bundle' : ''}`}
                    >
                      <div>
                        <div className="reward-card-top">
                          <div className="reward-icon-box">{getRewardIcon(reward.iconName)}</div>
                          <div className="reward-cost-tag">
                            <span>{reward.pointsCost.toLocaleString()} pts</span>
                          </div>
                        </div>

                        <h3 className="reward-title">{reward.title}</h3>
                        <p className="reward-description">{reward.description}</p>

                        <div className="reward-duration-badge">
                          <Clock size={12} />
                          <span>30 Days Full Access</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        className="reward-redeem-btn"
                        onClick={() => handleInitiateRedeem(reward)}
                        disabled={isAuthenticated && (isInsufficient || isPending || isActive)}
                      >
                        <ShieldCheck size={16} />
                        <span>{btnLabel}</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Free-to-play Legal Strip */}
            <div className="rewards-legal-strip">
              Points are free, non-transferable promotional reward points awarded for speed and skill. They hold zero monetary value, cannot be purchased, exchanged for cash, or withdrawn. All granted software licenses are valid for 30 days.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

