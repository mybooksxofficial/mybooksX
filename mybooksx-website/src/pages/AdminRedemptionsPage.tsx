/**
 * Dedicated Admin Redemption Management Panel (/admin/redemptions)
 * Protected portal for approving, rejecting, and tracking all software licenses and points deductions.
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import type { RedemptionRecord } from '../server/rewardsService.ts';
import { navigateTo } from '../utils/navigation.ts';
import {
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Search,
  ArrowLeft,
  Key,
  AlertCircle,
  RefreshCw,
  Mail,
  Lock,
  X
} from 'lucide-react';
import './AdminRedemptionsPage.css';

export const AdminRedemptionsPage: React.FC = () => {
  const { user } = useAuth();

  // Admin Authorization State
  const [adminKey, setAdminKey] = useState<string>(() => {
    return sessionStorage.getItem('mybooksx_owner_key') || '';
  });
  const [adminKeyInput, setAdminKeyInput] = useState('');
  const [isAuthorized, setIsAuthorized] = useState<boolean>(() => {
    return user?.role === 'admin' || !!sessionStorage.getItem('mybooksx_owner_key');
  });

  const [redemptions, setRedemptions] = useState<RedemptionRecord[]>([]);
  const [filterStatus, setFilterStatus] = useState<'All' | 'Pending' | 'Approved' | 'Rejected'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Action Dialogs State
  const [approvingItem, setApprovingItem] = useState<RedemptionRecord | null>(null);
  const [deliveryNotesInput, setDeliveryNotesInput] = useState('');
  
  const [rejectingItem, setRejectingItem] = useState<RedemptionRecord | null>(null);
  const [rejectionReasonInput, setRejectionReasonInput] = useState('');
  
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch Redemptions
  const fetchRedemptions = async (key = adminKey) => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const headers: Record<string, string> = {};
      if (key) headers['x-admin-key'] = key;

      const res = await fetch(`/api/admin/redemptions?status=${filterStatus}`, {
        headers,
        credentials: 'include'
      });
      const data = await res.json();

      if (res.status === 403) {
        setIsAuthorized(false);
        setErrorMsg('Admin key required or expired. Please authorize.');
        return;
      }

      if (data.success) {
        setRedemptions(data.redemptions || []);
        setIsAuthorized(true);
      } else {
        setErrorMsg(data.message || 'Failed to fetch redemption records.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Network error fetching admin records.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthorized) {
      fetchRedemptions();
    }
  }, [filterStatus, isAuthorized]);

  // Handle Admin Key Authorization
  const handleAuthorize = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminKeyInput.trim()) return;
    const cleanKey = adminKeyInput.trim();
    sessionStorage.setItem('mybooksx_owner_key', cleanKey);
    setAdminKey(cleanKey);
    setIsAuthorized(true);
    fetchRedemptions(cleanKey);
  };

  // Handle Approve Action
  const handleConfirmApprove = async () => {
    if (!approvingItem) return;
    setIsProcessing(true);
    setErrorMsg('');
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (adminKey) headers['x-admin-key'] = adminKey;

      const res = await fetch('/api/admin/redemptions/approve', {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify({
          redemptionId: approvingItem.id,
          deliveryNotes: deliveryNotesInput.trim()
        })
      });
      const data = await res.json();

      if (data.success) {
        setSuccessMsg(`Redemption ${approvingItem.redemptionCode} successfully approved. License key generated.`);
        setApprovingItem(null);
        setDeliveryNotesInput('');
        fetchRedemptions();
      } else {
        setErrorMsg(data.message || 'Approval failed.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error executing approval.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle Reject Action
  const handleConfirmReject = async () => {
    if (!rejectingItem) return;
    if (!rejectionReasonInput.trim()) {
      setErrorMsg('A rejection reason is required to notify the user and restore points.');
      return;
    }

    setIsProcessing(true);
    setErrorMsg('');
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (adminKey) headers['x-admin-key'] = adminKey;

      const res = await fetch('/api/admin/redemptions/reject', {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify({
          redemptionId: rejectingItem.id,
          reason: rejectionReasonInput.trim()
        })
      });
      const data = await res.json();

      if (data.success) {
        setSuccessMsg(`Redemption ${rejectingItem.redemptionCode} rejected. Reserved points refunded to user balance.`);
        setRejectingItem(null);
        setRejectionReasonInput('');
        fetchRedemptions();
      } else {
        setErrorMsg(data.message || 'Rejection failed.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error executing rejection.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Filter & Search Logic
  const filteredList = redemptions.filter((item) => {
    const q = searchQuery.toLowerCase();
    const matchSearch =
      item.userName.toLowerCase().includes(q) ||
      item.userEmail.toLowerCase().includes(q) ||
      item.redemptionCode.toLowerCase().includes(q) ||
      item.rewardTitle.toLowerCase().includes(q);
    return matchSearch;
  });

  // Calculate Stat Counts
  const totalCount = redemptions.length;
  const pendingCount = redemptions.filter(r => r.status === 'Pending').length;
  const approvedCount = redemptions.filter(r => r.status === 'Approved').length;
  const rejectedCount = redemptions.filter(r => r.status === 'Rejected').length;
  const pointsReservedTotal = redemptions
    .filter(r => r.status === 'Pending')
    .reduce((acc, curr) => acc + curr.pointsReserved, 0);

  // If Not Authorized: Render Secure Admin Key Gate
  if (!isAuthorized) {
    return (
      <div className="mbx-admin-viewport">
        <div className="mbx-admin-auth-card">
          <div className="mbx-admin-auth-icon">
            <Lock size={32} className="text-royal" />
          </div>
          <h2>Admin Authorization Gate</h2>
          <p>This endpoint is restricted to authenticated MyBooksX system administrators.</p>

          {errorMsg && (
            <div className="mbx-alert error">
              <AlertCircle size={15} />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleAuthorize} className="mbx-admin-auth-form">
            <div className="input-group">
              <label>Administrator Key / Access Password</label>
              <input
                type="password"
                placeholder="Enter admin key..."
                required
                autoFocus
                value={adminKeyInput}
                onChange={e => setAdminKeyInput(e.target.value)}
              />
            </div>
            <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
              Authorize & Access Panel
            </button>
          </form>

          <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
            <button
              type="button"
              className="btn-link"
              onClick={() => navigateTo('/dashboard')}
            >
              Return to User Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mbx-admin-viewport">
      {/* Admin Top Navigation */}
      <header className="mbx-admin-nav">
        <div className="mbx-admin-nav-container">
          <div className="mbx-admin-nav-left">
            <button
              type="button"
              className="mbx-admin-back-btn"
              onClick={() => navigateTo('/dashboard')}
            >
              <ArrowLeft size={16} />
              <span>Dashboard</span>
            </button>
            <div className="nav-divider"></div>
            <div className="mbx-admin-brand">
              <img src="/logo/mybooksx-logo.png" alt="MyBooksX" />
              <span>Admin Redemptions Portal</span>
            </div>
          </div>

          <div className="mbx-admin-nav-right">
            <button
              type="button"
              className="btn-refresh"
              onClick={() => fetchRedemptions()}
              disabled={isLoading}
              title="Refresh Records"
            >
              <RefreshCw size={14} className={isLoading ? 'spin' : ''} />
              <span>Refresh</span>
            </button>
            <button
              type="button"
              className="btn-logout-admin"
              onClick={() => {
                sessionStorage.removeItem('mybooksx_owner_key');
                setIsAuthorized(false);
              }}
            >
              Exit Admin
            </button>
          </div>
        </div>
      </header>

      <main className="mbx-admin-content container">
        {/* Top Header Summary */}
        <section className="mbx-admin-hero">
          <div className="mbx-admin-tag">
            <ShieldCheck size={14} className="text-royal" />
            <span>ENTERPRISE REWARD FULFILLMENT</span>
          </div>
          <h1>Software Redemption Requests</h1>
          <p>Verify user identity, validate reserved points, issue 30-day license keys, or release refunds.</p>

          {/* Stat Overview Cards */}
          <div className="mbx-admin-stats-grid">
            <div className="admin-stat-card">
              <span className="stat-label">Pending Requests</span>
              <strong className="stat-value text-warning">{pendingCount}</strong>
              <span className="stat-sub">{pointsReservedTotal.toLocaleString()} points reserved</span>
            </div>
            <div className="admin-stat-card">
              <span className="stat-label">Approved Licenses</span>
              <strong className="stat-value text-success">{approvedCount}</strong>
              <span className="stat-sub">Active subscriptions issued</span>
            </div>
            <div className="admin-stat-card">
              <span className="stat-label">Rejected Requests</span>
              <strong className="stat-value text-danger">{rejectedCount}</strong>
              <span className="stat-sub">Points restored to users</span>
            </div>
            <div className="admin-stat-card">
              <span className="stat-label">Total Submissions</span>
              <strong className="stat-value">{totalCount}</strong>
              <span className="stat-sub">Lifetime audit ledger</span>
            </div>
          </div>
        </section>

        {/* Global Alerts */}
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

        {/* Filters and Search Bar */}
        <div className="mbx-admin-controls-card">
          <div className="mbx-status-tabs">
            {(['All', 'Pending', 'Approved', 'Rejected'] as const).map(tab => (
              <button
                key={tab}
                type="button"
                className={`tab-btn ${filterStatus === tab ? 'active' : ''}`}
                onClick={() => setFilterStatus(tab)}
              >
                {tab}
                <span className="tab-count">
                  {tab === 'All'
                    ? totalCount
                    : tab === 'Pending'
                    ? pendingCount
                    : tab === 'Approved'
                    ? approvedCount
                    : rejectedCount}
                </span>
              </button>
            ))}
          </div>

          <div className="mbx-admin-search-wrapper">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search by User, Email, Receipt Code, or App..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                className="clear-search-btn"
                onClick={() => setSearchQuery('')}
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Redemptions Table */}
        <div className="mbx-admin-table-card">
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Redemption ID</th>
                  <th>User Details</th>
                  <th>Application</th>
                  <th>Points</th>
                  <th>Submission Date</th>
                  <th>Status</th>
                  <th>Actions / Audit Details</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '3rem' }}>
                      <RefreshCw size={24} className="spin text-royal" />
                      <p style={{ marginTop: '0.75rem', color: 'var(--text-muted)' }}>Loading records...</p>
                    </td>
                  </tr>
                ) : filteredList.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '3rem' }}>
                      <ShieldAlert size={28} className="text-muted" />
                      <p style={{ marginTop: '0.5rem', color: 'var(--text-secondary)' }}>
                        No redemption requests matching the criteria.
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredList.map((item) => (
                    <tr key={item.id} className={item.status === 'Pending' ? 'row-pending' : ''}>
                      <td>
                        <code className="receipt-code">{item.redemptionCode}</code>
                        <div className="id-sub">{item.id}</div>
                      </td>

                      <td>
                        <div className="user-details-block">
                          <strong>{item.userName}</strong>
                          <span className="user-email">
                            <Mail size={12} /> {item.userEmail}
                          </span>
                        </div>
                      </td>

                      <td>
                        <strong>{item.rewardTitle}</strong>
                        <div className="app-sub">30-day software access</div>
                      </td>

                      <td>
                        <span className="pts-reserved-badge">
                          {item.pointsReserved.toLocaleString()} pts
                        </span>
                      </td>

                      <td>
                        <span className="timestamp">
                          {new Date(item.createdAt).toLocaleString('en-IN', {
                            dateStyle: 'medium',
                            timeStyle: 'short'
                          })}
                        </span>
                      </td>

                      <td>
                        <span className={`status-pill ${item.status.toLowerCase()}`}>
                          {item.status}
                        </span>
                      </td>

                      <td>
                        {item.status === 'Pending' ? (
                          <div className="action-btns-row">
                            <button
                              type="button"
                              className="btn-admin-approve"
                              onClick={() => {
                                setApprovingItem(item);
                                setDeliveryNotesInput(`Approved for ${item.userName} via admin portal.`);
                              }}
                            >
                              Approve
                            </button>
                            <button
                              type="button"
                              className="btn-admin-reject"
                              onClick={() => {
                                setRejectingItem(item);
                                setRejectionReasonInput('');
                              }}
                            >
                              Reject
                            </button>
                          </div>
                        ) : item.status === 'Approved' ? (
                          <div className="audit-detail-block">
                            {item.licenseKey && (
                              <div className="license-pill">
                                <Key size={11} />
                                <code>{item.licenseKey}</code>
                              </div>
                            )}
                            <span className="audit-note">{item.adminNotes || 'License issued.'}</span>
                          </div>
                        ) : (
                          <div className="audit-detail-block">
                            <span className="rejection-text">{item.rejectionReason}</span>
                            <span className="refund-badge">Points Refunded</span>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* APPROVE ACTION DIALOG */}
      {approvingItem && (
        <div className="mbx-modal-backdrop" onClick={() => setApprovingItem(null)}>
          <div className="mbx-action-dialog" onClick={e => e.stopPropagation()}>
            <button
              type="button"
              className="dialog-close"
              onClick={() => setApprovingItem(null)}
            >
              <X size={18} />
            </button>

            <div className="dialog-header">
              <CheckCircle2 size={32} className="text-success" />
              <h3>Approve Software License</h3>
              <p>
                Confirm approval for <strong>{approvingItem.userName}</strong> ({approvingItem.redemptionCode}).
              </p>
            </div>

            <div className="dialog-details-box">
              <div className="detail-row">
                <span>Application:</span>
                <strong>{approvingItem.rewardTitle}</strong>
              </div>
              <div className="detail-row">
                <span>Points to Deduct:</span>
                <strong className="text-royal">{approvingItem.pointsReserved.toLocaleString()} pts</strong>
              </div>
              <div className="detail-row">
                <span>Access Duration:</span>
                <strong>30 Calendar Days</strong>
              </div>
            </div>

            <div className="dialog-input-group">
              <label>Delivery / Admin Remarks</label>
              <textarea
                rows={3}
                className="dialog-textarea"
                placeholder="Add optional notes for the user or fulfillment credentials..."
                value={deliveryNotesInput}
                onChange={e => setDeliveryNotesInput(e.target.value)}
              />
            </div>

            <div className="dialog-actions">
              <button
                type="button"
                className="btn-cancel"
                onClick={() => setApprovingItem(null)}
                disabled={isProcessing}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-primary btn-confirm-approve"
                onClick={handleConfirmApprove}
                disabled={isProcessing}
              >
                {isProcessing ? 'Issuing License...' : 'Confirm Approval & Issue License'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REJECT ACTION DIALOG */}
      {rejectingItem && (
        <div className="mbx-modal-backdrop" onClick={() => setRejectingItem(null)}>
          <div className="mbx-action-dialog" onClick={e => e.stopPropagation()}>
            <button
              type="button"
              className="dialog-close"
              onClick={() => setRejectingItem(null)}
            >
              <X size={18} />
            </button>

            <div className="dialog-header">
              <XCircle size={32} className="text-danger" />
              <h3>Reject Software Redemption</h3>
              <p>
                Releasing reserved points back to <strong>{rejectingItem.userName}</strong>.
              </p>
            </div>

            <div className="dialog-details-box">
              <div className="detail-row">
                <span>Application:</span>
                <strong>{rejectingItem.rewardTitle}</strong>
              </div>
              <div className="detail-row">
                <span>Points to Refund:</span>
                <strong className="text-success">+{rejectingItem.pointsReserved.toLocaleString()} pts</strong>
              </div>
            </div>

            <div className="dialog-input-group">
              <label>
                Rejection Reason <span style={{ color: '#DC2626' }}>*</span>
              </label>
              <textarea
                rows={3}
                className="dialog-textarea"
                placeholder="Reason for rejection (e.g. Ineligible account, duplicate claim, policy guidelines)..."
                required
                value={rejectionReasonInput}
                onChange={e => setRejectionReasonInput(e.target.value)}
              />
            </div>

            <div className="dialog-actions">
              <button
                type="button"
                className="btn-cancel"
                onClick={() => setRejectingItem(null)}
                disabled={isProcessing}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-danger btn-confirm-reject"
                onClick={handleConfirmReject}
                disabled={isProcessing || !rejectionReasonInput.trim()}
              >
                {isProcessing ? 'Processing Refund...' : 'Confirm Rejection & Refund Points'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
