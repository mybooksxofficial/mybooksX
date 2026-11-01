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
  Printer, 
  Key,
  MessageSquare,
  Phone
} from 'lucide-react';
import './RedeemPage.css';

export const RedeemPage: React.FC = () => {
  const { user, isAuthenticated, openAuthModal, refreshUser } = useAuth();

  const [rewards, setRewards] = useState<RewardItem[]>([]);
  const [redemptions, setRedemptions] = useState<RedemptionRecord[]>([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg] = useState('');
  const [copiedReceipt, setCopiedReceipt] = useState(false);

  // Confirmation Dialog State
  const [selectedReward, setSelectedReward] = useState<RewardItem | null>(null);
  const [isRedeeming, setIsRedeeming] = useState(false);

  // Success Confirmation Receipt Modal State
  const [confirmedReceipt, setConfirmedReceipt] = useState<RedemptionRecord | null>(null);

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
        setConfirmedReceipt(res.redemption);
        setSelectedReward(null);

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
      } else {
        setErrorMsg(res.message || 'Failed to submit redemption request.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Network error during redemption request.');
    } finally {
      setIsRedeeming(false);
    }
  };

  // Metrics calculation
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
                        ? 'Pending Admin Review'
                        : hasEnough
                        ? 'Redeem 30-Day License'
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

      {/* REDEMPTION CONFIRMATION RECEIPT MODAL */}
      {confirmedReceipt && (
        <div className="mbx-modal-backdrop" onClick={() => setConfirmedReceipt(null)}>
          <div className="mbx-receipt-dialog" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="mbx-modal-close"
              onClick={() => setConfirmedReceipt(null)}
              aria-label="Close"
            >
              <X size={18} />
            </button>

            <div className="mbx-receipt-header">
              <div className="mbx-receipt-stamp">
                <CheckCircle2 size={32} className="text-success" />
              </div>
              <h3>🎉 Booked! You will receive it within 7 days.</h3>
              <p>Your software license booking is confirmed. Your login details and license keys will be delivered within 7 days.</p>
            </div>

            <div className="mbx-receipt-ticket">
              <div className="ticket-field">
                <span className="label">Receipt Number</span>
                <span className="value code">{confirmedReceipt.redemptionCode}</span>
              </div>
              <div className="ticket-field">
                <span className="label">User Name</span>
                <span className="value">{confirmedReceipt.userName}</span>
              </div>
              <div className="ticket-field">
                <span className="label">User Email</span>
                <span className="value">{confirmedReceipt.userEmail}</span>
              </div>
              <div className="ticket-field">
                <span className="label">Application</span>
                <span className="value">{confirmedReceipt.rewardTitle}</span>
              </div>
              <div className="ticket-field">
                <span className="label">Points Reserved</span>
                <span className="value highlight">{confirmedReceipt.pointsReserved.toLocaleString()} pts</span>
              </div>
              <div className="ticket-field">
                <span className="label">Access Validity</span>
                <span className="value">30 Calendar Days (Post Approval)</span>
              </div>
              <div className="ticket-field">
                <span className="label">Request Timestamp</span>
                <span className="value">{new Date(confirmedReceipt.createdAt).toLocaleString()}</span>
              </div>
              <div className="ticket-field">
                <span className="label">Status</span>
                <span className="value status-pending">Pending Admin Review</span>
              </div>
            </div>

            {/* Direct Phone Transmission to Owner (+91 9644570828) */}
            <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 'var(--radius-sm)', padding: '0.85rem 1rem', margin: '1rem 0', textAlign: 'left' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem', color: '#166534', fontWeight: 600, fontSize: '0.88rem' }}>
                <MessageSquare size={16} />
                <span>Send Voucher Directly to Owner Phone (+91 9644570828)</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: '#14532D', margin: '0 0 0.75rem', lineHeight: 1.45 }}>
                Your voucher has been generated and formatted as text. Tap below to send this voucher text directly to Founder Deep Mehta on WhatsApp or SMS:
              </p>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <a
                  href={confirmedReceipt.whatsappUrl || `https://wa.me/919644570828?text=${encodeURIComponent(confirmedReceipt.voucherText || `Voucher: ${confirmedReceipt.redemptionCode}\nApp: ${confirmedReceipt.rewardTitle}\nPoints: ${confirmedReceipt.pointsReserved}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', padding: '0.5rem 0.85rem', background: '#25D366', color: '#FFFFFF', borderColor: '#25D366', fontSize: '0.84rem', textDecoration: 'none', borderRadius: 'var(--radius-sm)' }}
                >
                  <MessageSquare size={15} />
                  <span>Send via WhatsApp (+91 9644570828)</span>
                </a>
                <a
                  href={confirmedReceipt.smsUrl || `sms:+919644570828?body=${encodeURIComponent(confirmedReceipt.voucherText || `Voucher: ${confirmedReceipt.redemptionCode}`)}`}
                  className="btn-outline"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', padding: '0.5rem 0.85rem', fontSize: '0.84rem', borderRadius: 'var(--radius-sm)' }}
                >
                  <Phone size={15} />
                  <span>Send SMS to +91 9644570828</span>
                </a>
                <button
                  type="button"
                  className="btn-outline"
                  style={{ padding: '0.5rem 0.85rem', fontSize: '0.84rem', borderRadius: 'var(--radius-sm)' }}
                  onClick={() => {
                    navigator.clipboard.writeText(confirmedReceipt.voucherText || `Voucher: ${confirmedReceipt.redemptionCode}\nApp: ${confirmedReceipt.rewardTitle}`);
                    setCopiedReceipt(true);
                    setTimeout(() => setCopiedReceipt(false), 2000);
                  }}
                >
                  {copiedReceipt ? '✓ Text Copied' : '📋 Copy Text'}
                </button>
              </div>
            </div>

            <div className="mbx-receipt-footer">
              <span className="legal-note">
                This is a software rewards redemption confirmation, not a financial tax invoice.
              </span>
              <div className="receipt-actions">
                <button
                  type="button"
                  className="btn-print"
                  onClick={() => window.print()}
                >
                  <Printer size={15} />
                  <span>Print Receipt</span>
                </button>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => setConfirmedReceipt(null)}
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
