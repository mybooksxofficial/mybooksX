/**
 * Dedicated MyBooksX Rewards & Redeem Panel (/redeem)
 * Completely separate marketplace from Quest, Quiz, and Leaderboards.
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { api } from '../services/apiClient.ts';
import type { RewardItem, RedemptionRecord } from '../server/rewardsService.ts';
import { navigateTo } from '../utils/navigation.ts';
import { 
  Gift, 
  Zap, 
  Coins, 
  Clock, 
  ShieldCheck, 
  CheckCircle2, 
  X, 
  AlertCircle, 
  FileText, 
  Compass, 
  Layers, 
  Receipt, 
  Crown, 
  ArrowLeft, 
  Check, 
  Key,
  MessageSquare
} from 'lucide-react';
import './RedeemPage.css';

export const RedeemPage: React.FC = () => {
  const { user, isAuthenticated, openAuthModal, refreshUser } = useAuth();

  const [rewards, setRewards] = useState<RewardItem[]>([]);
  const [redemptions, setRedemptions] = useState<RedemptionRecord[]>([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Confirmation Dialog State
  const [selectedReward, setSelectedReward] = useState<RewardItem | null>(null);
  const [isRedeeming, setIsRedeeming] = useState(false);


  // Load Catalog and My Redemptions
  const loadData = async () => {
    setErrorMsg('');
    try {
      const catalogRes = await api.rewards.getCatalog();
      if (catalogRes.success) {
        setRewards(catalogRes.rewards);
      }

      if (isAuthenticated) {
        const redemptionsRes = await api.rewards.getMyRedemptions();
        if (redemptionsRes.success) {
          setRedemptions(redemptionsRes.redemptions);
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to load rewards marketplace.');
    }
  };

  useEffect(() => {
    loadData();
  }, [isAuthenticated]);

  // Handle Redemption Request
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const handleConfirmRedeem = async () => {
    if (!selectedReward) return;
    if (!isAuthenticated) {
      openAuthModal('login');
      return;
    }

    setIsRedeeming(true);
    setErrorMsg('');
    try {
      const res = await api.rewards.redeem(selectedReward.id);
      if (res.success && res.redemption) {
        setSelectedReward(null);
        setBookingSuccess(true);
        setSuccessMsg('🎉 Booked! You will receive it within 7 days.');

        // Voice speech announcement: "Booked! You will receive it within 7 days."
        try {
          if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance('Booked! You will receive it within 7 days.');
            utterance.rate = 1.0;
            utterance.pitch = 1.0;
            window.speechSynthesis.speak(utterance);
          }
        } catch {}

        await refreshUser();
        await loadData();

        // Automatic done ho jana chahiye: auto-close success dialog
        setTimeout(() => {
          setBookingSuccess(false);
        }, 3200);
      } else {
        setErrorMsg(res.message || 'Failed to submit redemption request.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Network error during redemption request.');
    } finally {
      setIsRedeeming(false);
    }
  };

  const availablePoints = user?.pointsBalance || 0;
  const totalEarned = user?.totalPointsEarned || 0;
  const totalRedeemed = redemptions
    .filter(r => r.status === 'Approved')
    .reduce((acc, curr) => acc + curr.pointsReserved, 0);
  const pendingCount = redemptions.filter(r => r.status === 'Pending').length;

  const renderRewardIcon = (iconName: string) => {
    switch (iconName) {
      case 'FileText': return <FileText size={26} className="text-royal" />;
      case 'Compass': return <Compass size={26} className="text-royal" />;
      case 'Layers': return <Layers size={26} className="text-royal" />;
      case 'Receipt': return <Receipt size={26} className="text-royal" />;
      case 'Crown': return <Crown size={26} className="text-royal" />;
      default: return <Gift size={26} className="text-royal" />;
    }
  };

  return (
    <div className="mbx-redeem-viewport">
      {/* Top Header Navigation Bar */}
      <header className="mbx-redeem-navbar">
        <div className="mbx-redeem-nav-container">
          <div className="mbx-redeem-nav-left">
            <button
              type="button"
              className="mbx-redeem-back-btn"
              onClick={() => navigateTo('/dashboard')}
              title="Return to Dashboard"
            >
              <ArrowLeft size={16} />
              <span>Dashboard</span>
            </button>
            <div className="mbx-redeem-nav-divider"></div>
            <a href="/" className="mbx-redeem-logo" onClick={(e) => { e.preventDefault(); navigateTo('/'); }}>
              <img src="/logo/mybooksx-logo.png" alt="MyBooksX" />
              <span>MyBooksX</span>
            </a>
          </div>

          <div className="mbx-redeem-nav-right">
            {isAuthenticated && user ? (
              <div className="mbx-redeem-user-pill" onClick={() => navigateTo('/dashboard')}>
                <Zap size={14} className="text-royal" />
                <span className="mbx-points-bold">{availablePoints.toLocaleString()}</span>
                <span className="mbx-points-unit">pts available</span>
              </div>
            ) : (
              <button
                type="button"
                className="btn-primary"
                onClick={() => openAuthModal('login')}
              >
                Sign In to Redeem
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="mbx-redeem-content container">
        {/* Top Hero Section */}
        <section className="mbx-redeem-hero">
          <div className="mbx-redeem-badge">
            <Gift size={14} className="text-royal" />
            <span>MYBOOKSX REWARDS MARKETPLACE</span>
          </div>
          <h1 className="mbx-redeem-heading">My Rewards</h1>
          <p className="mbx-redeem-subtitle">
            Turn your quiz points into access to MyBooksX applications.
          </p>

          {/* 4 Essential Metrics Cards */}
          <div className="mbx-redeem-metrics-grid">
            <div className="mbx-metric-card">
              <div className="mbx-metric-icon-wrap" style={{ background: '#EEF4FF', color: '#0A58CA' }}>
                <Coins size={20} />
              </div>
              <div className="mbx-metric-info">
                <span className="mbx-metric-label">Available Points</span>
                <strong className="mbx-metric-value">{availablePoints.toLocaleString()}</strong>
              </div>
            </div>

            <div className="mbx-metric-card">
              <div className="mbx-metric-icon-wrap" style={{ background: '#F0FDF4', color: '#16A34A' }}>
                <Zap size={20} />
              </div>
              <div className="mbx-metric-info">
                <span className="mbx-metric-label">Total Points Earned</span>
                <strong className="mbx-metric-value">{totalEarned.toLocaleString()}</strong>
              </div>
            </div>

            <div className="mbx-metric-card">
              <div className="mbx-metric-icon-wrap" style={{ background: '#FAF5FF', color: '#9333EA' }}>
                <ShieldCheck size={20} />
              </div>
              <div className="mbx-metric-info">
                <span className="mbx-metric-label">Total Points Redeemed</span>
                <strong className="mbx-metric-value">{totalRedeemed.toLocaleString()}</strong>
              </div>
            </div>

            <div className="mbx-metric-card">
              <div className="mbx-metric-icon-wrap" style={{ background: '#FFFBEB', color: '#D97706' }}>
                <Clock size={20} />
              </div>
              <div className="mbx-metric-info">
                <span className="mbx-metric-label">Pending Redemptions</span>
                <strong className="mbx-metric-value">{pendingCount}</strong>
              </div>
            </div>
          </div>
        </section>

        {/* Global Notifications */}
        {errorMsg && (
          <div className="mbx-alert error">
            <AlertCircle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="mbx-alert success">
            <CheckCircle2 size={16} />
            <span>{successMsg}</span>
          </div>
        )}

        {/* REWARD CATALOGUE (5 Flagship Cards) */}
        <section className="mbx-catalog-section">
          <div className="mbx-section-header">
            <div>
              <h2 className="mbx-section-title">Application Catalogue</h2>
              <p className="mbx-section-desc">Full 30-day corporate software licenses redeemed strictly with speed points.</p>
            </div>
          </div>

          <div className="mbx-rewards-grid">
            {rewards.map((reward) => {
              const hasEnough = availablePoints >= reward.pointsCost;
              const isPending = reward.userStatus === 'pending_review';
              const isActiveSub = reward.userStatus === 'active_subscription';

              return (
                <div 
                  key={reward.id} 
                  className={`mbx-reward-card ${reward.code === 'PREMIUM_BUNDLE' ? 'featured' : ''}`}
                >
                  {reward.code === 'PREMIUM_BUNDLE' && (
                    <div className="mbx-bundle-ribbon">
                      <Crown size={12} />
                      <span>COMPLETE 4-IN-1 SUITE</span>
                    </div>
                  )}

                  <div className="mbx-reward-header">
                    <div className="mbx-reward-icon-box">
                      {renderRewardIcon(reward.iconName)}
                    </div>
                    <div className="mbx-reward-duration-badge">
                      <Clock size={12} />
                      <span>{reward.durationDays} Days Access</span>
                    </div>
                  </div>

                  <h3 className="mbx-reward-name">{reward.title}</h3>
                  <p className="mbx-reward-description">{reward.description}</p>

                  <div className="mbx-reward-cost-row">
                    <div className="mbx-cost-pill">
                      <Zap size={14} className="text-royal" />
                      <strong>{reward.pointsCost.toLocaleString()}</strong>
                      <span>points</span>
                    </div>

                    <div className="mbx-eligibility-status">
                      {isActiveSub ? (
                        <span className="status-badge active"><Check size={12} /> Active</span>
                      ) : isPending ? (
                        <span className="status-badge pending"><Clock size={12} /> Under Review</span>
                      ) : hasEnough ? (
                        <span className="status-badge eligible"><Check size={12} /> Eligible</span>
                      ) : (
                        <span className="status-badge need">Need {(reward.pointsCost - availablePoints).toLocaleString()} pts</span>
                      )}
                    </div>
                  </div>

                  <div className="mbx-reward-action">
                    <button
                      type="button"
                      className={`btn-redeem ${reward.code === 'PREMIUM_BUNDLE' ? 'btn-bundle' : ''}`}
                      disabled={!hasEnough || isPending || isActiveSub}
                      onClick={() => setSelectedReward(reward)}
                    >
                      {isActiveSub
                        ? 'Subscription Active'
                        : isPending
                        ? '✓ Booked (Within 7 Days)'
                        : hasEnough
                        ? 'Book 30-Day License'
                        : 'Insufficient Points'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* MY REDEMPTIONS HISTORY */}
        <section className="mbx-history-section">
          <div className="mbx-section-header">
            <div>
              <h2 className="mbx-section-title">My Redemptions</h2>
              <p className="mbx-section-desc">Complete audit log of all requested, approved, and fulfilled licenses.</p>
            </div>
          </div>

          {!isAuthenticated ? (
            <div className="mbx-empty-state">
              <Gift size={36} className="text-muted" />
              <h3>Sign in to view your redemptions</h3>
              <p>Your redeemed software licenses and active access credentials appear here.</p>
              <button type="button" className="btn-primary" onClick={() => openAuthModal('login')}>
                Sign In
              </button>
            </div>
          ) : redemptions.length === 0 ? (
            <div className="mbx-empty-state">
              <Gift size={36} className="text-muted" />
              <h3>No redemptions yet</h3>
              <p>Earn points by competing in daily QUEST challenges and redeem software licenses above.</p>
            </div>
          ) : (
            <div className="mbx-table-card">
              <div className="mbx-responsive-table">
                <table className="mbx-data-table">
                  <thead>
                    <tr>
                      <th>Redemption ID</th>
                      <th>Application</th>
                      <th>Points</th>
                      <th>Submission Date</th>
                      <th>Status</th>
                      <th>License / Delivery Remarks</th>
                      <th>Direct Text to Owner</th>
                    </tr>
                  </thead>
                  <tbody>
                    {redemptions.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <code className="mbx-code-badge">{item.redemptionCode || item.id}</code>
                        </td>
                        <td>
                          <strong>{item.rewardTitle}</strong>
                        </td>
                        <td>
                          <span className="mbx-pts-val">{item.pointsReserved.toLocaleString()} pts</span>
                        </td>
                        <td>
                          <span className="mbx-date-text">
                            {new Date(item.createdAt).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </span>
                        </td>
                        <td>
                          <span className={`mbx-status-pill ${item.status.toLowerCase()}`}>
                            {item.status}
                          </span>
                        </td>
                        <td>
                          {item.status === 'Approved' ? (
                            <div className="mbx-delivery-approved">
                              {item.licenseKey && (
                                <div className="mbx-license-badge">
                                  <Key size={12} />
                                  <span>{item.licenseKey}</span>
                                </div>
                              )}
                              <span className="mbx-delivery-note">{item.deliveryDetails || 'Active (30 Days)'}</span>
                            </div>
                          ) : item.status === 'Rejected' ? (
                            <span className="mbx-rejection-reason">
                              {item.rejectionReason || 'Points refunded to balance.'}
                            </span>
                          ) : (
                            <span className="mbx-pending-hint">
                              <Clock size={12} /> Admin review in progress
                            </span>
                          )}
                        </td>
                        <td>
                          <a
                            href={item.whatsappUrl || `https://wa.me/919644570828?text=${encodeURIComponent(item.voucherText || `Voucher Code: ${item.redemptionCode}\nApp: ${item.rewardTitle}\nPoints: ${item.pointsReserved}`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-outline"
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.35rem 0.65rem', fontSize: '0.78rem', borderColor: '#25D366', color: '#128C7E', textDecoration: 'none', borderRadius: '4px', whiteSpace: 'nowrap' }}
                            title="Send Voucher Directly to Owner WhatsApp (+91 9644570828)"
                          >
                            <MessageSquare size={13} />
                            <span>WhatsApp to +91 9644570828</span>
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      </main>

      {/* CONFIRMATION WORKFLOW DIALOG */}
      {selectedReward && (
        <div className="mbx-modal-backdrop" onClick={() => setSelectedReward(null)}>
          <div className="mbx-confirm-dialog" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="mbx-modal-close"
              onClick={() => setSelectedReward(null)}
              aria-label="Close"
            >
              <X size={18} />
            </button>

            <div className="mbx-dialog-header">
              <div className="mbx-dialog-icon">
                <Gift size={24} className="text-royal" />
              </div>
              <h3 className="mbx-dialog-title">Confirm Software Redemption</h3>
              <p className="mbx-dialog-sub">
                Please verify your selection before reserving promotional points.
              </p>
            </div>

            <div className="mbx-confirm-summary-box">
              <div className="mbx-confirm-row">
                <span>Selected Application:</span>
                <strong>{selectedReward.title}</strong>
              </div>
              <div className="mbx-confirm-row">
                <span>Access Duration:</span>
                <strong>30 Days Full Access</strong>
              </div>
              <div className="mbx-confirm-row">
                <span>Points Required:</span>
                <strong className="text-royal">{selectedReward.pointsCost.toLocaleString()} pts</strong>
              </div>
              <div className="mbx-confirm-row">
                <span>Your Current Balance:</span>
                <span>{availablePoints.toLocaleString()} pts</span>
              </div>
              <div className="mbx-confirm-row balance-after">
                <span>Balance After Reservation:</span>
                <strong>{(availablePoints - selectedReward.pointsCost).toLocaleString()} pts</strong>
              </div>
            </div>

            <div className="mbx-terms-notice">
              <ShieldCheck size={16} className="text-royal" />
              <span>
                Access lasts exactly 30 days from administrator approval. Points are promotional and non-transferable.
              </span>
            </div>

            <div className="mbx-dialog-actions">
              <button
                type="button"
                className="btn-cancel"
                onClick={() => setSelectedReward(null)}
                disabled={isRedeeming}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-primary btn-confirm"
                onClick={handleConfirmRedeem}
                disabled={isRedeeming}
              >
                {isRedeeming ? 'Reserving Points...' : 'Confirm & Reserve Points'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CLEAN BOOKING CONFIRMATION MODAL - NO TICKET FIELDS */}
      {bookingSuccess && (
        <div className="mbx-modal-backdrop" onClick={() => setBookingSuccess(false)}>
          <div className="mbx-receipt-dialog" style={{ maxWidth: '440px', textAlign: 'center', padding: '2.5rem 1.75rem' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ width: '68px', height: '68px', borderRadius: '50%', background: '#DEF7EC', color: '#047857', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
              <CheckCircle2 size={40} />
            </div>

            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-espresso)', marginBottom: '0.65rem' }}>
              🎉 Booked! You will receive it within 7 days.
            </h3>

            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.55, marginBottom: '1.75rem' }}>
              Your software license has been booked. You will receive your software access details within 7 days.
            </p>

            <button
              type="button"
              className="btn-primary"
              style={{ width: '100%', padding: '0.8rem', fontSize: '1rem', borderRadius: '8px', fontWeight: 700 }}
              onClick={() => setBookingSuccess(false)}
            >
              ✓ Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
