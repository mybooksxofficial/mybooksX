import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Lock,
  ShieldCheck,
  LogOut,
  Clock,
  Phone,
  MessageSquare,
  Trash2,
  Search,
  Filter,
  AlertCircle,
  UserCheck,
  Eye,
  EyeOff,
  RefreshCw,
  History,
  Smartphone,
  Laptop,
  CheckCircle,
  ShieldAlert,
  Cloud,
  Crown,
  HelpCircle,
  Plus,
  Check,
  Ban,
  Trophy,
  Zap
} from 'lucide-react';
import { bookingService } from '../services/bookingService';
import type { BookingRecord, LoginLogRecord } from '../services/bookingService';
import { api } from '../services/apiClient.ts';
import type { RedemptionRecord } from '../server/rewardsService.ts';
import './OwnerPanelModal.css';

interface OwnerPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OwnerPanelModal: React.FC<OwnerPanelModalProps> = ({ isOpen, onClose }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('mybooksx_owner_auth') === 'true';
  });

  const [ownerId, setOwnerId] = useState('');
  const [policyMessage, setPolicyMessage] = useState<string | null>(null);
  const [attemptPolicy, setAttemptPolicy] = useState<'strict_once' | 'unlimited'>(() => {
    return (localStorage.getItem('mbx_quiz_access_policy') as any) || 'strict_once';
  });

  const handleUpdateAttemptPolicy = async (newPolicy: 'strict_once' | 'unlimited') => {
    setAttemptPolicy(newPolicy);
    try {
      localStorage.setItem('mbx_quiz_access_policy', newPolicy);
    } catch {}
    try {
      await api.admin.updateQuizSchedule({ allowUnlimitedAttempts: newPolicy === 'unlimited' });
    } catch {}
    setPolicyMessage(newPolicy === 'strict_once' ? '🔒 Policy set: Strict 1-Time Access Only (1 attempt/day)' : '⚡ Policy set: Unlimited Replays (Test Mode)');
    setTimeout(() => setPolicyMessage(null), 3500);
  };
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  
  // Tabs: 'leaderboard', 'quiz_schedule', 'bookings', 'redemptions', 'questions', 'logins'
  const [activeTab, setActiveTab] = useState<'leaderboard' | 'quiz_schedule' | 'bookings' | 'redemptions' | 'questions' | 'logins'>('leaderboard');
  
  // Quiz Dynamic Timing & Schedule State
  const [quizSchedule, setQuizSchedule] = useState<{
    mode: 'always_live' | 'scheduled';
    unlockTimeIst: string;
    allowUnlimitedAttempts: boolean;
    isLiveNow: boolean;
    nextUnlockIso?: string;
    remainingSeconds: number;
    currentIstTime?: string;
  }>({
    mode: 'always_live',
    unlockTimeIst: '14:00',
    allowUnlimitedAttempts: false,
    isLiveNow: true,
    remainingSeconds: 0
  });
  const [scheduleLoading, setScheduleLoading] = useState(false);
  const [scheduleMessage, setScheduleMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [loginLogs, setLoginLogs] = useState<LoginLogRecord[]>([]);
  const [adminRedemptions, setAdminRedemptions] = useState<RedemptionRecord[]>([]);
  const [adminQuestions, setAdminQuestions] = useState<any[]>([]);
  const [adminLeaderboard, setAdminLeaderboard] = useState<any[]>([]);
  const [leaderboardSummary, setLeaderboardSummary] = useState<any>(null);
  const [leaderboardSearch, setLeaderboardSearch] = useState('');
  const [copiedVoucherId, setCopiedVoucherId] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncedTime, setLastSyncedTime] = useState<string>('');

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'All' | 'New' | 'Contacted' | 'Closed'>('All');

  // Question form state
  const [showAddQuestion, setShowAddQuestion] = useState(false);
  const [newQuestionText, setNewQuestionText] = useState('');
  const [newCategory, setNewCategory] = useState('Technology');
  const [newDifficulty, setNewDifficulty] = useState('Medium');
  const [newOptions, setNewOptions] = useState(['', '', '', '']);
  const [newCorrectIdx, setNewCorrectIdx] = useState(0);
  const [newExplanation, setNewExplanation] = useState('');

  const loadAdminLeaderboard = async () => {
    try {
      const res = await api.admin.getLeaderboard();
      if (res.success && res.users) {
        setAdminLeaderboard(res.users);
        setLeaderboardSummary(res.summary);
      }
    } catch (e) {
      console.warn('Failed to load leaderboard', e);
    }
  };

  const loadAdminRedemptions = async () => {
    try {
      const res = await api.admin.getRedemptions();
      if (res.success && res.redemptions) {
        setAdminRedemptions(res.redemptions);
      }
    } catch (e) {
      console.warn('Failed to load redemptions', e);
    }
  };

  const loadAdminQuestions = async () => {
    try {
      const res = await api.admin.getQuestions();
      if (res.success && res.questions) {
        setAdminQuestions(res.questions);
      }
    } catch (e) {
      console.warn('Failed to load questions', e);
    }
  };

  const loadQuizSchedule = async () => {
    try {
      setScheduleLoading(true);
      const res = await api.quiz.getSchedule();
      if (res.success && res.schedule) {
        setQuizSchedule(res.schedule);
      }
    } catch (e) {
      console.warn('Failed to load quiz schedule', e);
    } finally {
      setScheduleLoading(false);
    }
  };

  const handleSaveQuizSchedule = async (
    newMode?: 'always_live' | 'scheduled',
    newTime?: string,
    newUnlimited?: boolean
  ) => {
    try {
      setScheduleLoading(true);
      setScheduleMessage(null);
      const payload = {
        mode: newMode !== undefined ? newMode : quizSchedule.mode,
        unlockTimeIst: newTime !== undefined ? newTime : quizSchedule.unlockTimeIst,
        allowUnlimitedAttempts: newUnlimited !== undefined ? newUnlimited : quizSchedule.allowUnlimitedAttempts
      };
      const res = await api.admin.updateQuizSchedule(payload);
      if (res.success && res.schedule) {
        setQuizSchedule(res.schedule);
        setScheduleMessage({
          type: 'success',
          text: `Schedule saved! Status: ${res.schedule.isLiveNow ? '🟢 LIVE NOW' : `⏰ Scheduled for ${res.schedule.unlockTimeIst} IST`}`
        });
      }
    } catch (err: any) {
      setScheduleMessage({ type: 'error', text: err?.message || 'Failed to update schedule.' });
    } finally {
      setScheduleLoading(false);
    }
  };

  const handleResetQuizAttempts = async () => {
    if (!window.confirm("Are you sure you want to reset all completed quiz attempts for today? This allows you and all players to replay today's Quest immediately!")) {
      return;
    }
    try {
      setScheduleLoading(true);
      setScheduleMessage(null);
      const res = await api.admin.resetQuizAttempts();
      if (res.success) {
        setScheduleMessage({
          type: 'success',
          text: res.message || "Today's completed sessions cleared! Anyone can replay Quest immediately."
        });
      }
    } catch (err: any) {
      setScheduleMessage({ type: 'error', text: err?.message || 'Failed to reset attempts.' });
    } finally {
      setScheduleLoading(false);
    }
  };

  const handleApproveRedemption = async (redemptionId: string) => {
    const notes = window.prompt('Enter activation notes / deployment instructions for the client:', 'Approved by system administrator. Access granted for 30 days.');
    if (notes === null) return;

    try {
      const res = await api.admin.approveRedemption(redemptionId, notes);
      if (res.success) {
        alert(`Redemption Approved! Generated License Key: ${res.licenseKey}`);
        await loadAdminRedemptions();
      } else {
        alert(`Error: ${res.message}`);
      }
    } catch (err: any) {
      alert(`Error approving redemption: ${err.message}`);
    }
  };

  const handleRejectRedemption = async (redemptionId: string) => {
    const reason = window.prompt('Enter rejection reason (reserved points will be immediately refunded to user):', 'Duplicate request or verification required.');
    if (!reason) return;

    try {
      const res = await api.admin.rejectRedemption(redemptionId, reason);
      if (res.success) {
        alert('Redemption rejected and points refunded to user.');
        await loadAdminRedemptions();
      } else {
        alert(`Error: ${res.message}`);
      }
    } catch (err: any) {
      alert(`Error rejecting redemption: ${err.message}`);
    }
  };

  const handleCreateQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText.trim() || newOptions.some(o => !o.trim())) {
      alert('Please fill all fields and all 4 options.');
      return;
    }

    try {
      const res = await api.admin.addQuestion({
        question: newQuestionText,
        category: newCategory,
        difficulty: newDifficulty,
        options: newOptions,
        correctIndex: Number(newCorrectIdx),
        explanation: newExplanation
      });

      if (res.success) {
        alert('Question added successfully!');
        setNewQuestionText('');
        setNewOptions(['', '', '', '']);
        setNewExplanation('');
        setShowAddQuestion(false);
        await loadAdminQuestions();
      } else {
        alert(`Error: ${res.message}`);
      }
    } catch (err: any) {
      alert(`Error adding question: ${err.message}`);
    }
  };

  const handleDeleteQuestion = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this question?')) return;
    try {
      const res = await api.admin.deleteQuestion(id);
      if (res.success) {
        await loadAdminQuestions();
      }
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  // Load and auto-sync with shared cloud database
  useEffect(() => {
    if (isOpen && isAuthenticated) {
      // 1. Initial fast local cache load
      setBookings(bookingService.getAllBookings());
      setLoginLogs(bookingService.getLoginLogs());

      // 2. Fetch live data from backend
      loadAdminLeaderboard();
      loadAdminRedemptions();
      loadAdminQuestions();
      loadQuizSchedule();

      // 3. Fetch live cross-device data from cloud
      const syncCloudData = async () => {
        setIsSyncing(true);
        try {
          const cloudBookings = await bookingService.syncWithCloud();
          setBookings(cloudBookings);
          const cloudLogs = await bookingService.syncLoginLogs();
          setLoginLogs(cloudLogs);
          setLastSyncedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        } catch (err) {
          console.warn('Sync failed', err);
        } finally {
          setIsSyncing(false);
        }
      };

      syncCloudData();

      // 3. Poll cloud every 12 seconds so bookings from other phones appear automatically
      const timer = setInterval(syncCloudData, 12000);
      return () => clearInterval(timer);
    }
  }, [isOpen, isAuthenticated]);

  if (!isOpen) return null;

  const handleManualSync = async () => {
    setIsSyncing(true);
    try {
      const b = await bookingService.syncWithCloud();
      setBookings(b);
      const l = await bookingService.syncLoginLogs();
      setLoginLogs(l);
      setLastSyncedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    } finally {
      setIsSyncing(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = ownerId.trim().toLowerCase();
    const cleanPass = password.trim();

    // Accepted Owner / Admin IDs
    const validIds = [
      'admin',
      'admin@mybooksx.com',
      'mybooksx_admin',
      'owner',
      'ojas',
      'mybooksx'
    ];

    // Accepted passwords (both the master tough key and simple convenient mobile passwords)
    const validPasswords = [
      'MBX#Ojas9644!Key',
      'ojas9644',
      'Ojas9644',
      'admin9644',
      'admin123',
      'mybooksx123',
      'mbx9644'
    ];

    if (validIds.includes(cleanId) && validPasswords.includes(cleanPass)) {
      setIsAuthenticated(true);
      sessionStorage.setItem('mybooksx_owner_auth', 'true');
      sessionStorage.setItem('mybooksx_owner_key', 'deepmehta@mybooks');
      setLoginError('');
      
      // Record successful login audit log (synced to cloud)
      bookingService.recordLogin(cleanId, 'Authorized');
      
      setBookings(bookingService.getAllBookings());
      setLoginLogs(bookingService.getLoginLogs());
      handleManualSync();
    } else {
      // Record failed login audit log
      bookingService.recordLogin(cleanId || 'unknown_user', 'Failed');
      setLoginError('Incorrect Master ID or Password. Access denied.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('mybooksx_owner_auth');
    setOwnerId('');
    setPassword('');
  };

  const handleStatusChange = (id: string, newStatus: BookingRecord['status']) => {
    const updated = bookingService.updateStatus(id, newStatus);
    setBookings(updated);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this booking record?')) {
      const updated = bookingService.deleteBooking(id);
      setBookings(updated);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'All' || b.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const countNew = bookings.filter((b) => b.status === 'New').length;
  const countContacted = bookings.filter((b) => b.status === 'Contacted').length;

  return (
    <div className="owner-webpage-container">
      {/* Full Webpage Header Bar */}
      <header className="owner-webpage-navbar">
        <div className="owner-nav-left">
          <button type="button" className="owner-back-web-btn" onClick={onClose} title="Return to Website">
            <ArrowLeft size={18} />
            <span>Back to Website</span>
          </button>

          <div className="owner-brand-divider" />

          <div className="owner-nav-brand">
            <div className="circular-logo-container">
              <img src="/logo/mybooksx-logo.png" alt="MyBooksX" className="circular-logo-img" />
            </div>
            <div>
              <h2 className="owner-webpage-title">MyBooksX Executive Studio</h2>
              <span className="owner-webpage-sub">Owner Portal & Management Webpage</span>
            </div>
          </div>
        </div>

        <div className="owner-nav-right">
          {isAuthenticated ? (
            <div className="owner-nav-actions">
              <button
                type="button"
                className={`owner-cloud-sync-btn ${isSyncing ? 'spinning' : ''}`}
                onClick={handleManualSync}
                title="Sync bookings across devices"
              >
                <RefreshCw size={14} className={isSyncing ? 'spin-icon' : ''} />
                <span>{isSyncing ? 'Syncing...' : 'Sync Cloud'}</span>
              </button>

              <button type="button" className="owner-signout-btn" onClick={handleLogout}>
                <LogOut size={16} />
                <span>Log Out</span>
              </button>
            </div>
          ) : (
            <div className="owner-security-badge">
              <ShieldCheck size={16} className="text-royal" />
              <span>Restricted Access</span>
            </div>
          )}
        </div>
      </header>

      {/* Main Webpage Body */}
      <main className="owner-webpage-main">
        {!isAuthenticated ? (
          /* AUTHENTIC DEDICATED LOGIN WEBPAGE */
          <div className="owner-login-card-container">
            <div className="owner-auth-card">
              <div className="auth-card-icon-wrap">
                <Lock size={32} className="text-royal" />
              </div>

              <h3>Owner Portal Login</h3>
              <p>Enter your confidential master credentials to access the client bookings and project inquiries.</p>

              {loginError && (
                <div className="login-error-alert">
                  <AlertCircle size={16} />
                  <span>{loginError}</span>
                </div>
              )}

              <form onSubmit={handleLogin} className="owner-auth-form">
                <div className="form-field">
                  <label htmlFor="ownerId">Owner ID / Username</label>
                  <input
                    type="text"
                    id="ownerId"
                    placeholder="Enter Owner ID"
                    value={ownerId}
                    onChange={(e) => setOwnerId(e.target.value)}
                    required
                    autoComplete="username"
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="ownerPassword">Master Password</label>
                  <div className="password-input-wrapper">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="ownerPassword"
                      placeholder="Enter Master Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      className="toggle-password-visibility-btn"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <button type="submit" className="btn-primary w-full owner-auth-submit-btn">
                  <span>Sign In to Management Portal</span>
                  <ShieldCheck size={17} />
                </button>
              </form>

              <div className="auth-footer-note">
                <UserCheck size={14} className="text-royal inline-icon" />
                <span>Protected area. Client bookings and phone contacts are securely managed here.</span>
              </div>
            </div>
          </div>
        ) : (
          /* FULL WEBPAGE DASHBOARD */
          <div className="container owner-dashboard-container">
            {/* Dashboard Welcome Header */}
            <div className="owner-dash-heading-row">
              <div>
                <h2>Executive Management Dashboard</h2>
                <p className="dash-subtext">
                  Real-time cross-device consultation leads synced live across all client phones & laptops.
                  {lastSyncedTime && <span className="sync-pill-tag"><Cloud size={12} /> Live Cloud Synced at {lastSyncedTime}</span>}
                </p>
              </div>

              <div className="owner-quick-stats">
                <div className="stat-pill">
                  <span className="stat-lbl">Total Bookings</span>
                  <strong>{bookings.length}</strong>
                </div>
                <div className="stat-pill highlight-gold">
                  <span className="stat-lbl">New Uncontacted</span>
                  <strong>{countNew}</strong>
                </div>
                <div className="stat-pill highlight-green">
                  <span className="stat-lbl">Contacted</span>
                  <strong>{countContacted}</strong>
                </div>
              </div>
            </div>

            {/* TAB SELECTOR: Client Bookings vs Leaderboard & Points vs Rewards vs Questions */}
            <div className="owner-tabs-row">
              <button
                type="button"
                className={`owner-tab-nav-btn ${activeTab === 'leaderboard' ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab('leaderboard');
                  loadAdminLeaderboard();
                }}
              >
                <Trophy size={15} />
                <span>Leaderboard & Points</span>
                <span className="tab-pill-badge" style={{ background: '#EFF6FF', color: '#1D4ED8' }}>
                  {adminLeaderboard.length} Players
                </span>
              </button>

              <button
                type="button"
                className={`owner-tab-nav-btn ${activeTab === 'quiz_schedule' ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab('quiz_schedule');
                  loadQuizSchedule();
                }}
              >
                <Clock size={15} />
                <span>⚡ Quiz Timing & Launch</span>
                <span className="tab-pill-badge" style={{ background: quizSchedule.isLiveNow ? '#ECFDF5' : '#FEF3C7', color: quizSchedule.isLiveNow ? '#065F46' : '#92400E' }}>
                  {quizSchedule.isLiveNow ? '🟢 Live Now' : `${quizSchedule.unlockTimeIst} IST`}
                </span>
              </button>

              <button
                type="button"
                className={`owner-tab-nav-btn ${activeTab === 'bookings' ? 'active' : ''}`}
                onClick={() => setActiveTab('bookings')}
              >
                <span>Client Bookings & Leads</span>
                <span className="tab-pill-badge">{bookings.length}</span>
              </button>

              <button
                type="button"
                className={`owner-tab-nav-btn ${activeTab === 'redemptions' ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab('redemptions');
                  loadAdminRedemptions();
                }}
              >
                <Crown size={15} />
                <span>Software Redemptions</span>
                <span className="tab-pill-badge" style={{ background: '#FEF3C7', color: '#92400E' }}>
                  {adminRedemptions.filter(r => r.status === 'Pending').length > 0 ? `🚨 ${adminRedemptions.filter(r => r.status === 'Pending').length} New Bookings` : '0 Pending'}
                </span>
              </button>

              <button
                type="button"
                className={`owner-tab-nav-btn ${activeTab === 'questions' ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab('questions');
                  loadAdminQuestions();
                }}
              >
                <HelpCircle size={15} />
                <span>Quiz Question Bank</span>
                <span className="tab-pill-badge">{adminQuestions.length}</span>
              </button>

              <button
                type="button"
                className={`owner-tab-nav-btn ${activeTab === 'logins' ? 'active' : ''}`}
                onClick={() => setActiveTab('logins')}
              >
                <History size={15} />
                <span>Login Audit</span>
                <span className="tab-pill-badge">{loginLogs.length}</span>
              </button>
            </div>

            {activeTab === 'leaderboard' ? (
              /* TAB 0: LIVE LEADERBOARD & USER POINTS DIRECTORY */
              <div className="owner-dash-body">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <div>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Trophy size={18} className="text-royal" />
                      <span>Live Leaderboard & Player Points Directory</span>
                    </h3>
                    <p className="dash-subtext">Real-time view of all registered players, their current points balance, rank, and redemption history.</p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      className="owner-cloud-sync-btn"
                      onClick={loadAdminLeaderboard}
                    >
                      <RefreshCw size={14} />
                      <span>Refresh Standings</span>
                    </button>
                    <a
                      href={`https://wa.me/919644570828?text=${encodeURIComponent(
                        `📊 *MYBOOKSX LEADERBOARD SUMMARY*\nTotal Players: ${leaderboardSummary?.totalUsers || adminLeaderboard.length}\nCirculating Points: ${(leaderboardSummary?.totalPointsCirculating || 0).toLocaleString()} pts\nTop Scorer: ${leaderboardSummary?.topScorerName || 'N/A'} (${(leaderboardSummary?.topScore || 0).toLocaleString()} pts)\nDate: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-outline"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.45rem 0.75rem', fontSize: '0.82rem', borderColor: '#25D366', color: '#128C7E', textDecoration: 'none', borderRadius: 'var(--radius-sm)' }}
                      title="Send Leaderboard Summary to Owner WhatsApp (+91 9644570828)"
                    >
                      <MessageSquare size={14} />
                      <span>Text Summary to +91 9644570828</span>
                    </a>
                  </div>
                </div>

                {policyMessage && (
                  <div style={{ background: '#ECFDF5', border: '1px solid #10B981', color: '#065F46', padding: '0.65rem 1rem', borderRadius: '8px', marginBottom: '1rem', fontWeight: 600, fontSize: '0.86rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle size={16} />
                    <span>{policyMessage}</span>
                  </div>
                )}
                {/* Daily Quiz Attempt Access Control & Lock Selector */}
                <div style={{
                  background: '#F8FAFC',
                  border: '1.5px solid #CBD5E1',
                  borderRadius: '12px',
                  padding: '1rem 1.25rem',
                  marginBottom: '1.25rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1rem'
                }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '0.98rem', color: '#0F172A' }}>
                      <Lock size={17} className="text-royal" />
                      <span>Daily Quiz Attempt & Lock Policy</span>
                      <span style={{
                        fontSize: '0.75rem',
                        padding: '0.15rem 0.55rem',
                        borderRadius: '999px',
                        background: attemptPolicy === 'strict_once' ? '#DCFCE7' : '#FEF3C7',
                        color: attemptPolicy === 'strict_once' ? '#166534' : '#92400E',
                        fontWeight: 700
                      }}>
                        {attemptPolicy === 'strict_once' ? '🔒 1-Time Access Only' : '⚡ Unlimited Replays'}
                      </span>
                    </div>
                    <p style={{ margin: '0.35rem 0 0', fontSize: '0.84rem', color: '#64748B', lineHeight: 1.45 }}>
                      {attemptPolicy === 'strict_once'
                        ? 'Users can only access and play the 15-minute QUEST once per day. Their attempt is locked until tomorrow.'
                        : 'Testing & Practice Mode: Users can play repeatedly with unlimited replays.'}
                    </p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <select
                      value={attemptPolicy}
                      onChange={(e) => handleUpdateAttemptPolicy(e.target.value as any)}
                      style={{
                        padding: '0.55rem 0.9rem',
                        borderRadius: '8px',
                        border: '1.5px solid #94A3B8',
                        fontWeight: 600,
                        fontSize: '0.88rem',
                        background: '#FFFFFF',
                        color: '#0F172A',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="strict_once">🔒 Strict 1-Time Access (1 attempt/day)</option>
                      <option value="unlimited">⚡ Unlimited Replays (Test Mode)</option>
                    </select>

                    <button
                      type="button"
                      onClick={handleResetQuizAttempts}
                      disabled={scheduleLoading}
                      style={{
                        background: '#DC2626',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '0.55rem 0.95rem',
                        fontWeight: 600,
                        fontSize: '0.84rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem'
                      }}
                      title="Clear all daily player attempt locks immediately"
                    >
                      <RefreshCw size={14} className={scheduleLoading ? 'spin' : ''} />
                      <span>Reset All Daily Locks</span>
                    </button>
                  </div>
                </div>

                {/* Summary Metrics Banner */}
                {leaderboardSummary && (
                  <div className="owner-kpi-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
                    <div className="owner-kpi-card" style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
                      <span style={{ fontSize: '0.78rem', color: '#1E40AF', fontWeight: 600, textTransform: 'uppercase' }}>Total Players</span>
                      <strong style={{ display: 'block', fontSize: '1.5rem', color: '#1E3A8A', marginTop: '0.25rem' }}>{leaderboardSummary.totalUsers}</strong>
                    </div>
                    <div className="owner-kpi-card" style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
                      <span style={{ fontSize: '0.78rem', color: '#166534', fontWeight: 600, textTransform: 'uppercase' }}>Available Points in Wallets</span>
                      <strong style={{ display: 'block', fontSize: '1.5rem', color: '#14532D', marginTop: '0.25rem' }}>{leaderboardSummary.totalPointsCirculating?.toLocaleString()} pts</strong>
                    </div>
                    <div className="owner-kpi-card" style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
                      <span style={{ fontSize: '0.78rem', color: '#92400E', fontWeight: 600, textTransform: 'uppercase' }}>Points Reserved (Redeeming)</span>
                      <strong style={{ display: 'block', fontSize: '1.5rem', color: '#78350F', marginTop: '0.25rem' }}>{leaderboardSummary.totalPointsReserved?.toLocaleString()} pts</strong>
                    </div>
                    <div className="owner-kpi-card" style={{ background: '#FAF5FF', border: '1px solid #E9D5FF', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
                      <span style={{ fontSize: '0.78rem', color: '#6B21A8', fontWeight: 600, textTransform: 'uppercase' }}>🏆 Leading Player</span>
                      <strong style={{ display: 'block', fontSize: '1.15rem', color: '#581C87', marginTop: '0.25rem' }}>{leaderboardSummary.topScorerName} ({leaderboardSummary.topScore?.toLocaleString()} pts)</strong>
                    </div>
                  </div>
                )}

                {/* Filter and Search */}
                <div style={{ marginBottom: '1rem' }}>
                  <input
                    type="text"
                    className="owner-search-input"
                    placeholder="Search player by name, email, or user ID..."
                    value={leaderboardSearch}
                    onChange={e => setLeaderboardSearch(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem 0.9rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}
                  />
                </div>

                {/* Users Table */}
                <div className="mbx-responsive-table" style={{ overflowX: 'auto', background: '#FFFFFF', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                    <thead>
                      <tr style={{ background: 'var(--bg-sand-tint)', borderBottom: '1px solid var(--border-light)' }}>
                        <th style={{ padding: '0.75rem 1rem' }}>Player Details</th>
                        <th style={{ padding: '0.75rem 1rem' }}>Available Points (Balance)</th>
                        <th style={{ padding: '0.75rem 1rem' }}>Reserved</th>
                        <th style={{ padding: '0.75rem 1rem' }}>Lifetime Earned</th>
                        <th style={{ padding: '0.75rem 1rem' }}>Quests Completed</th>
                        <th style={{ padding: '0.75rem 1rem' }}>Redemptions</th>
                        <th style={{ padding: '0.75rem 1rem' }}>Text to Owner</th>
                      </tr>
                    </thead>
                    <tbody>
                      {adminLeaderboard.length === 0 ? (
                        <tr>
                          <td colSpan={7} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                            No player records found. Users will appear here as soon as they register or play QUEST.
                          </td>
                        </tr>
                      ) : (
                        adminLeaderboard
                          .filter(u => {
                            if (!leaderboardSearch.trim()) return true;
                            const q = leaderboardSearch.toLowerCase();
                            return u.fullName.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || (u.phone && u.phone.includes(q)) || u.userId.toLowerCase().includes(q);
                          })
                          .map(u => {
                            const playerText = `👤 *MYBOOKSX PLAYER DOSSIER*\nRank: #${u.rank}\nName: ${u.fullName}\nMobile: ${u.phone || "N/A"}\nEmail: ${u.email}\nAvailable Points: ${u.pointsBalance.toLocaleString()} pts\nReserved Points: ${u.pointsReserved.toLocaleString()} pts\nLifetime Earned: ${u.lifetimePoints.toLocaleString()} pts\nQuests Completed: ${u.quizzesPlayed}\nRedemptions: ${u.redemptionsCount}\nHotline: +91 9644570828`;
                            const waUrl = `https://wa.me/919644570828?text=${encodeURIComponent(playerText)}`;

                            return (
                              <tr key={u.userId} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                                <td style={{ padding: '0.75rem 1rem' }}>
                                  <div style={{ fontWeight: 700, fontSize: '0.96rem', color: 'var(--text-primary)' }}>{u.fullName}</div>
                                  {u.phone ? (
                                    <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#059669', display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.15rem' }}>
                                      <Phone size={12} />
                                      <span>{u.phone}</span>
                                    </div>
                                  ) : (
                                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{u.email}</div>
                                  )}
                                  <div style={{ display: 'flex', gap: '0.35rem', marginTop: '0.25rem' }}>
                                    <span style={{ fontSize: '0.68rem', padding: '0.1rem 0.45rem', borderRadius: '4px', background: u.authProvider === 'phone' ? '#ECFDF5' : '#EFF6FF', color: u.authProvider === 'phone' ? '#065F46' : '#1D4ED8', fontWeight: 600 }}>
                                      {u.authProvider === 'phone' ? '📱 Mobile Verified' : 'Email Account'}
                                    </span>
                                    {u.isVerified && (
                                      <span style={{ fontSize: '0.68rem', padding: '0.1rem 0.45rem', borderRadius: '4px', background: '#DCFCE7', color: '#15803D', fontWeight: 600 }}>
                                        ✓ Active
                                      </span>
                                    )}
                                  </div>
                                </td>
                                <td style={{ padding: '0.75rem 1rem' }}>
                                  <strong style={{ fontSize: '1.05rem', color: 'var(--royal-blue-deep)' }}>
                                    {u.pointsBalance.toLocaleString()} pts
                                  </strong>
                                </td>
                                <td style={{ padding: '0.75rem 1rem', color: u.pointsReserved > 0 ? '#D97706' : 'var(--text-muted)' }}>
                                  {u.pointsReserved.toLocaleString()} pts
                                </td>
                                <td style={{ padding: '0.75rem 1rem', color: 'var(--text-secondary)' }}>
                                  {u.lifetimePoints.toLocaleString()} pts
                                </td>
                                <td style={{ padding: '0.75rem 1rem' }}>
                                  <span style={{ fontWeight: 600 }}>{u.quizzesPlayed}</span> ({u.totalCorrect} correct)
                                </td>
                                <td style={{ padding: '0.75rem 1rem' }}>
                                  <span style={{ fontWeight: 600, color: u.redemptionsCount > 0 ? 'var(--royal-blue)' : 'var(--text-muted)' }}>
                                    {u.redemptionsCount}
                                  </span>
                                </td>
                                <td style={{ padding: '0.75rem 1rem' }}>
                                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                                    {u.phone && (
                                      <a
                                        href={`tel:${u.phone.replace(/\s+/g, '')}`}
                                        className="btn-outline"
                                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', padding: '0.35rem 0.55rem', fontSize: '0.74rem', borderColor: '#3B82F6', color: '#1D4ED8', textDecoration: 'none', borderRadius: '4px' }}
                                        title={`Call ${u.fullName} directly`}
                                      >
                                        <Phone size={12} />
                                        <span>Call</span>
                                      </a>
                                    )}
                                    <a
                                      href={waUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="btn-outline"
                                      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.35rem 0.55rem', fontSize: '0.74rem', borderColor: '#25D366', color: '#128C7E', textDecoration: 'none', borderRadius: '4px' }}
                                      title="Send this player's points dossier directly to Founder's WhatsApp (+91 9644570828)"
                                    >
                                      <MessageSquare size={12} />
                                      <span>Send to Hotline</span>
                                    </a>
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : activeTab === 'quiz_schedule' ? (
              /* TAB 0.5: QUEST TIMING & LAUNCH SCHEDULE CONTROL */
              <div className="owner-dash-body">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                      <Clock size={20} className="text-royal" />
                      <span>QUEST Timing & Launch Schedule Control</span>
                    </h3>
                    <p className="dash-subtext" style={{ marginTop: '0.25rem' }}>
                      Set the daily 15-minute mathematical competition live at any time, configure scheduled hours (IST), or reset attempts.
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <button type="button" className="owner-cloud-sync-btn" onClick={loadQuizSchedule} disabled={scheduleLoading}>
                      <RefreshCw size={14} className={scheduleLoading ? 'spin-icon' : ''} />
                      <span>Refresh Status</span>
                    </button>
                  </div>
                </div>

                {scheduleMessage && (
                  <div className={`mbx-auth-alert ${scheduleMessage.type}`} style={{ marginBottom: '1.25rem', padding: '0.75rem 1rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {scheduleMessage.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                    <span>{scheduleMessage.text}</span>
                  </div>
                )}

                {/* Status Card */}
                <div style={{
                  background: quizSchedule.isLiveNow ? 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)' : 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
                  border: `1px solid ${quizSchedule.isLiveNow ? '#10B981' : '#F59E0B'}`,
                  borderRadius: '12px',
                  padding: '1.25rem 1.5rem',
                  marginBottom: '1.5rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1rem'
                }}>
                  <div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: quizSchedule.isLiveNow ? '#065F46' : '#92400E' }}>
                      CURRENT ACCESS STATUS
                    </div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: quizSchedule.isLiveNow ? '#047857' : '#B45309', marginTop: '0.25rem' }}>
                      {quizSchedule.isLiveNow ? '⚡ QUEST IS UNLOCKED & LIVE RIGHT NOW' : `⏰ SCHEDULED TO UNLOCK AT ${quizSchedule.unlockTimeIst} IST`}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#4B5563', marginTop: '0.25rem' }}>
                      Current Server Time: <strong>{quizSchedule.currentIstTime || 'Detecting...'}</strong> • Access Mode: <strong>{quizSchedule.mode === 'always_live' ? 'Always Live (24/7)' : `Scheduled for ${quizSchedule.unlockTimeIst} IST`}</strong>
                    </div>
                  </div>
                  <div>
                    <span style={{ display: 'inline-block', padding: '0.5rem 1rem', borderRadius: '999px', fontWeight: 700, fontSize: '0.85rem', background: quizSchedule.isLiveNow ? '#10B981' : '#F59E0B', color: '#FFFFFF' }}>
                      {quizSchedule.isLiveNow ? 'LIVE & ACCESSIBLE' : 'SCHEDULE ACTIVE'}
                    </span>
                  </div>
                </div>

                {/* Controls Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
                  
                  {/* CARD 1: Instant Unlock */}
                  <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <Zap size={20} className="text-royal" />
                      <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700 }}>⚡ Make Quiz Live Right Now</h4>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: '#6B7280', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                      Immediately removes the countdown lock and allows any user to take the 20-question mathematical challenge at any minute.
                    </p>
                    <button
                      type="button"
                      className="btn-primary"
                      style={{ width: '100%', padding: '0.75rem', fontWeight: 700, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
                      onClick={() => handleSaveQuizSchedule('always_live')}
                      disabled={scheduleLoading || quizSchedule.mode === 'always_live'}
                    >
                      <Zap size={16} />
                      <span>{quizSchedule.mode === 'always_live' ? '✓ Currently Live 24/7' : '⚡ Unlock QUEST Right Now'}</span>
                    </button>
                  </div>

                  {/* CARD 2: Scheduled Daily Hour */}
                  <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <Clock size={20} className="text-royal" />
                      <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700 }}>⏰ Set Scheduled Daily Time (IST)</h4>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: '#6B7280', lineHeight: 1.5, marginBottom: '1rem' }}>
                      Specify the exact hour and minute in Indian Standard Time (IST) when the daily competition unlocks.
                    </p>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '1.25rem' }}>
                      <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#374151' }}>Daily Unlock Time:</label>
                      <input
                        type="time"
                        value={quizSchedule.unlockTimeIst}
                        onChange={(e) => setQuizSchedule(prev => ({ ...prev, unlockTimeIst: e.target.value }))}
                        style={{ padding: '0.45rem 0.65rem', border: '1px solid #D1D5DB', borderRadius: '6px', fontSize: '0.95rem', fontWeight: 600 }}
                      />
                    </div>
                    <button
                      type="button"
                      className="btn-secondary"
                      style={{ width: '100%', padding: '0.75rem', fontWeight: 700, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
                      onClick={() => handleSaveQuizSchedule('scheduled', quizSchedule.unlockTimeIst)}
                      disabled={scheduleLoading}
                    >
                      <Clock size={16} />
                      <span>Save Scheduled Time ({quizSchedule.unlockTimeIst} IST)</span>
                    </button>
                  </div>

                </div>

                {/* Section 2: Replays & Attempt Management */}
                <div style={{ background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '1.25rem 1.5rem' }}>
                  <h4 style={{ margin: '0 0 0.5rem', fontSize: '1.05rem', fontWeight: 700 }}>🧪 Testing & Immediate Replay Controls</h4>
                  <p style={{ fontSize: '0.85rem', color: '#6B7280', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                    Control attempt limits so you can test questions repeatedly and replay without waiting for tomorrow.
                  </p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', userSelect: 'none' }}>
                      <input
                        type="checkbox"
                        checked={quizSchedule.allowUnlimitedAttempts}
                        onChange={(e) => {
                          const val = e.target.checked;
                          setQuizSchedule(prev => ({ ...prev, allowUnlimitedAttempts: val }));
                          handleSaveQuizSchedule(undefined, undefined, val);
                        }}
                        style={{ width: '18px', height: '18px', accentColor: '#1D4ED8' }}
                      />
                      <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#1F2937' }}>
                        Allow Unlimited Attempts Today (Test & Practice Mode)
                      </span>
                    </label>

                    <button
                      type="button"
                      style={{ background: '#DC2626', color: '#FFFFFF', border: 'none', padding: '0.65rem 1.25rem', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                      onClick={handleResetQuizAttempts}
                      disabled={scheduleLoading}
                    >
                      <RefreshCw size={15} />
                      <span>Reset Today's Attempts (Allow Instant Replay)</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : activeTab === 'bookings' ? (
              /* TAB 1: CLIENT BOOKINGS */
              <>
                {/* Filter and Search Bar */}
                <div className="owner-dash-toolbar">
                  <div className="dash-search-box">
                    <Search size={18} className="search-icon" />
                    <input
                      type="text"
                      placeholder="Search by client name, phone number, service..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  <div className="dash-filter-box">
                    <Filter size={16} className="filter-icon" />
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value as any)}
                      className="dash-filter-dropdown"
                    >
                      <option value="All">All Bookings ({bookings.length})</option>
                      <option value="New">🟡 New ({countNew})</option>
                      <option value="Contacted">🟢 Contacted ({countContacted})</option>
                      <option value="Closed">⚪ Closed</option>
                    </select>
                  </div>
                </div>

                {/* Bookings Display */}
                {filteredBookings.length === 0 ? (
                  <div className="owner-empty-state">
                    <Clock size={48} className="text-muted" />
                    <h3>No Bookings Yet</h3>
                    <p>
                      {searchQuery || filterStatus !== 'All'
                        ? 'No bookings match your current search or filter criteria.'
                        : 'When clients book a consultation from ANY phone or computer, their details will automatically show up here in real time via live cloud sync.'}
                    </p>
                    <button type="button" className="btn-secondary sync-empty-btn" onClick={handleManualSync}>
                      <RefreshCw size={14} className={isSyncing ? 'spin-icon' : ''} />
                      <span>{isSyncing ? 'Checking Cloud...' : 'Refresh from Cloud'}</span>
                    </button>
                  </div>
                ) : (
                  <div className="owner-bookings-grid">
                    {filteredBookings.map((b) => (
                      <div key={b.id} className={`owner-booking-card status-${b.status.toLowerCase()}`}>
                        <div className="card-top-header">
                          <div className="client-meta-wrap">
                            <span className="booking-id-tag">{b.id}</span>
                            <h3 className="client-full-name">{b.name}</h3>
                            {b.businessType && <span className="client-biz-type">{b.businessType}</span>}
                          </div>

                          <div className="card-status-controls">
                            <select
                              value={b.status}
                              onChange={(e) => handleStatusChange(b.id, e.target.value as any)}
                              className={`status-pill-select status-${b.status.toLowerCase()}`}
                            >
                              <option value="New">🟡 New</option>
                              <option value="Contacted">🟢 Contacted</option>
                              <option value="Closed">⚪ Closed</option>
                            </select>

                            <button
                              type="button"
                              className="delete-booking-icon-btn"
                              onClick={() => handleDelete(b.id)}
                              title="Delete Booking"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>

                        <div className="booking-service-callout">
                          <strong>Requested Service:</strong>
                          <span>{b.service}</span>
                          {b.promoCode && <span className="promo-voucher-tag">Promo: {b.promoCode}</span>}
                        </div>

                        {b.details && (
                          <div className="booking-notes-box">
                            <strong>Project Notes:</strong>
                            <p>{b.details}</p>
                          </div>
                        )}

                        <div className="card-action-bar">
                          <span className="booking-timestamp">
                            <Clock size={13} className="inline-icon" /> {b.createdAt}
                          </span>

                          <div className="client-reach-buttons">
                            <a
                              href={`https://wa.me/${b.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                                `Hello ${b.name}! Thank you for your inquiry on MyBooksX for "${b.service}". When is a good time for a brief discussion?`
                              )}`}
                              target="_blank"
                              rel="noreferrer"
                              className="reach-btn-whatsapp"
                              title="Chat on WhatsApp"
                            >
                              <MessageSquare size={15} />
                              <span>WhatsApp</span>
                            </a>

                            <a href={`tel:${b.phone}`} className="reach-btn-call" title="Call Client">
                              <Phone size={15} />
                              <span>{b.phone}</span>
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : activeTab === 'logins' ? (
              /* TAB 2: WHO HAS LOGGED IN (ACCESS AUDIT LOGS) */
              <div className="login-logs-audit-container">
                <div className="audit-header-banner">
                  <div className="audit-icon-wrap">
                    <History size={24} className="text-royal" />
                  </div>
                  <div>
                    <h3>Owner Portal Access & Login History</h3>
                    <p>Live security audit log showing who logged into the portal, from what device, and at what time.</p>
                  </div>
                </div>

                {loginLogs.length === 0 ? (
                  <div className="owner-empty-state">
                    <History size={40} className="text-muted" />
                    <h3>No Login Records Yet</h3>
                    <p>Whenever you or an administrator signs in, the session details and device type will be recorded here.</p>
                  </div>
                ) : (
                  <div className="audit-logs-list">
                    {loginLogs.map((log) => (
                      <div key={log.id} className={`audit-log-item status-${log.status.toLowerCase()}`}>
                        <div className="audit-log-left">
                          <div className="audit-device-icon">
                            {log.device.includes('Mobile') ? <Smartphone size={18} /> : <Laptop size={18} />}
                          </div>
                          <div className="audit-meta">
                            <div className="audit-user-row">
                              <strong className="audit-username">{log.user}</strong>
                              <span className={`audit-status-badge ${log.status.toLowerCase()}`}>
                                {log.status === 'Authorized' ? (
                                  <>
                                    <CheckCircle size={12} /> Authorized Login
                                  </>
                                ) : (
                                  <>
                                    <ShieldAlert size={12} /> Failed Login Attempt
                                  </>
                                )}
                              </span>
                            </div>
                            <span className="audit-device-text">{log.device}</span>
                          </div>
                        </div>

                        <div className="audit-log-right">
                          <span className="audit-timestamp">
                            <Clock size={13} className="inline-icon" /> {log.timestamp}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : activeTab === 'redemptions' ? (
              /* TAB 3: SOFTWARE REDEMPTION APPROVALS */
              <div className="owner-dash-body">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <div>
                    <div>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Crown size={20} className="text-royal" />
                      <span>Software Reward Redemptions</span>
                      {adminRedemptions.filter(r => r.status === 'Pending').length > 0 && (
                        <span style={{ fontSize: '0.78rem', background: '#FEE2E2', color: '#991B1B', border: '1px solid #FCA5A5', padding: '0.2rem 0.6rem', borderRadius: '999px', fontWeight: 700 }}>
                          🚨 {adminRedemptions.filter(r => r.status === 'Pending').length} New Orders Waiting
                        </span>
                      )}
                    </h3>
                  </div>
                    <p className="dash-subtext">Review user redemption requests, approve 30-day licenses, or refund points upon rejection.</p>
                  </div>
                  <button
                    type="button"
                    className="owner-cloud-sync-btn"
                    onClick={loadAdminRedemptions}
                  >
                    <RefreshCw size={14} />
                    <span>Refresh Requests</span>
                  </button>
                </div>

                {adminRedemptions.length === 0 ? (
                  <div className="empty-bookings-state">
                    <Crown size={40} className="text-muted" />
                    <h3>No Redemption Requests</h3>
                    <p>When verified users redeem software applications using their quiz points, their requests appear here.</p>
                  </div>
                ) : (
                  <div className="bookings-grid">
                    {adminRedemptions.map(r => (
                      <div key={r.id} className="booking-card">
                        <div className="booking-card-top">
                          <div>
                            <span className="booking-source-pill">REF: {r.redemptionCode}</span>
                            <h4 className="booking-client-name">{r.userName}</h4>
                            <span className="booking-service-badge" style={{ marginTop: '0.25rem' }}>
                              {r.rewardTitle}
                            </span>
                          </div>
                          <span
                            className="status-badge"
                            style={{
                              background: r.status === 'Approved' ? '#DEF7EC' : r.status === 'Pending' ? '#FEF3C7' : '#FDF2F2',
                              color: r.status === 'Approved' ? '#03543F' : r.status === 'Pending' ? '#92400E' : '#9B1C1C'
                            }}
                          >
                            {r.status}
                          </span>
                        </div>

                        <div className="booking-details-box" style={{ margin: '0.85rem 0' }}>
                          <div><strong>Email:</strong> {r.userEmail}</div>
                          {r.userPhone && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#059669', fontWeight: 600, marginTop: '0.2rem' }}>
                              <Phone size={13} />
                              <span>{r.userPhone}</span>
                            </div>
                          )}
                          <div><strong>Points Reserved:</strong> {r.pointsReserved.toLocaleString()} pts</div>
                          <div><strong>Submitted:</strong> {new Date(r.createdAt).toLocaleString()}</div>
                          {r.licenseKey && <div><strong>License Key:</strong> <code>{r.licenseKey}</code></div>}
                          {r.deliveryDetails && <div><strong>Delivery:</strong> {r.deliveryDetails}</div>}
                          {r.rejectionReason && <div style={{ color: '#9B1C1C' }}><strong>Reason:</strong> {r.rejectionReason}</div>}
                        </div>

                        {/* Direct Client Reach-Out Buttons */}
                        {r.userPhone && (
                          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', margin: '0.65rem 0' }}>
                            <a
                              href={`https://wa.me/${r.userPhone.replace(/\D/g, '').slice(-10)}?text=${encodeURIComponent(
                                `Hello ${r.userName}, thank you for redeeming ${r.rewardTitle} on MyBooksX! Your booking order is registered. We are preparing your corporate access license. Hotline: +91 9644570828`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn-primary"
                              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.4rem 0.75rem', fontSize: '0.8rem', background: '#25D366', color: '#FFFFFF', borderColor: '#25D366', textDecoration: 'none', borderRadius: '6px', fontWeight: 600 }}
                            >
                              <MessageSquare size={13} />
                              <span>WhatsApp Client ({r.userPhone})</span>
                            </a>
                            <a
                              href={`tel:${r.userPhone.replace(/\D/g, '').slice(-10)}`}
                              className="btn-outline"
                              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.4rem 0.75rem', fontSize: '0.8rem', borderRadius: '6px' }}
                            >
                              <Phone size={13} />
                              <span>Call Client</span>
                            </a>
                          </div>
                        )}
                        {/* Direct Text Transmission to Owner Hotline */}
                        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', margin: '0.65rem 0' }}>
                          <a
                            href={r.whatsappUrl || `https://wa.me/919644570828?text=${encodeURIComponent(r.voucherText || `Voucher: ${r.redemptionCode}\nApp: ${r.rewardTitle}\nPoints: ${r.pointsReserved}`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-outline"
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.35rem 0.65rem', fontSize: '0.78rem', borderColor: '#25D366', color: '#128C7E', textDecoration: 'none', borderRadius: '4px' }}
                            title="Send Voucher Directly to Founder's WhatsApp (+91 9644570828)"
                          >
                            <MessageSquare size={13} />
                            <span>WhatsApp to +91 9644570828</span>
                          </a>

                          <button
                            type="button"
                            className="btn-outline"
                            style={{ padding: '0.35rem 0.65rem', fontSize: '0.78rem', borderRadius: '4px' }}
                            onClick={() => {
                              navigator.clipboard.writeText(r.voucherText || `Voucher: ${r.redemptionCode}\nApp: ${r.rewardTitle}\nPoints: ${r.pointsReserved}`);
                              setCopiedVoucherId(r.id);
                              setTimeout(() => setCopiedVoucherId(null), 2000);
                            }}
                          >
                            {copiedVoucherId === r.id ? '✓ Text Copied' : '📋 Copy Text'}
                          </button>
                        </div>

                        {r.status === 'Pending' && (
                          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                            <button
                              type="button"
                              className="btn-primary"
                              style={{ flex: 1, padding: '0.5rem', fontSize: '0.84rem' }}
                              onClick={() => handleApproveRedemption(r.id)}
                            >
                              <Check size={14} />
                              <span>Approve (Issue License)</span>
                            </button>
                            <button
                              type="button"
                              className="btn-outline"
                              style={{ padding: '0.5rem 0.85rem', color: '#9B1C1C', borderColor: '#F8B4B4', fontSize: '0.84rem' }}
                              onClick={() => handleRejectRedemption(r.id)}
                            >
                              <Ban size={14} />
                              <span>Reject & Refund</span>
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              /* TAB 4: QUIZ QUESTIONS MANAGEMENT */
              <div className="owner-dash-body">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <div>
                    <h3>Quiz Question Management</h3>
                    <p className="dash-subtext">Add, inspect, and remove questions from the live MyBooksX question bank.</p>
                  </div>
                  <button
                    type="button"
                    className="btn-primary"
                    style={{ padding: '0.5rem 1rem' }}
                    onClick={() => setShowAddQuestion(!showAddQuestion)}
                  >
                    <Plus size={15} />
                    <span>{showAddQuestion ? 'Close Form' : 'Add New Question'}</span>
                  </button>
                </div>

                {showAddQuestion && (
                  <form
                    onSubmit={handleCreateQuestion}
                    style={{ background: 'var(--bg-page)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', marginBottom: '1.5rem' }}
                  >
                    <h4 style={{ marginBottom: '1rem' }}>Create New Arena Question</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>Question Text</label>
                        <input
                          type="text"
                          className="mbx-input-field"
                          placeholder="e.g. What is 25% of 800?"
                          value={newQuestionText}
                          onChange={e => setNewQuestionText(e.target.value)}
                          required
                        />
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>Category</label>
                          <select
                            className="mbx-input-field"
                            value={newCategory}
                            onChange={e => setNewCategory(e.target.value)}
                          >
                            <option value="Technology">Technology</option>
                            <option value="Mathematics">Mathematics</option>
                            <option value="General Knowledge">General Knowledge</option>
                            <option value="Geography">Geography</option>
                            <option value="Business">Business</option>
                          </select>
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>Difficulty</label>
                          <select
                            className="mbx-input-field"
                            value={newDifficulty}
                            onChange={e => setNewDifficulty(e.target.value)}
                          >
                            <option value="Easy">Easy</option>
                            <option value="Medium">Medium</option>
                            <option value="Hard">Hard</option>
                          </select>
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                        {newOptions.map((opt, idx) => (
                          <div key={idx}>
                            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                              Option {String.fromCharCode(65 + idx)}
                            </label>
                            <input
                              type="text"
                              className="mbx-input-field"
                              placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                              value={opt}
                              onChange={e => {
                                const updated = [...newOptions];
                                updated[idx] = e.target.value;
                                setNewOptions(updated);
                              }}
                              required
                            />
                          </div>
                        ))}
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '0.75rem' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>Correct Answer</label>
                          <select
                            className="mbx-input-field"
                            value={newCorrectIdx}
                            onChange={e => setNewCorrectIdx(Number(e.target.value))}
                          >
                            <option value={0}>Option A</option>
                            <option value={1}>Option B</option>
                            <option value={2}>Option C</option>
                            <option value={3}>Option D</option>
                          </select>
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>Explanation (Optional)</label>
                          <input
                            type="text"
                            className="mbx-input-field"
                            placeholder="Brief explanation shown after answering"
                            value={newExplanation}
                            onChange={e => setNewExplanation(e.target.value)}
                          />
                        </div>
                      </div>

                      <button type="submit" className="btn-primary" style={{ marginTop: '0.5rem' }}>
                        <Plus size={15} />
                        <span>Save Question to Bank</span>
                      </button>
                    </div>
                  </form>
                )}

                <div className="bookings-grid">
                  {adminQuestions.map(q => {
                    const opts = JSON.parse(q.options_json || '[]');
                    return (
                      <div key={q.id} className="booking-card">
                        <div className="booking-card-top">
                          <div>
                            <span className="booking-source-pill">{q.category} • {q.difficulty}</span>
                            <h4 style={{ fontSize: '0.98rem', margin: '0.4rem 0' }}>{q.question}</h4>
                          </div>
                          <button
                            type="button"
                            className="trash-btn"
                            title="Delete question"
                            onClick={() => handleDeleteQuestion(q.id)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.35rem', fontSize: '0.82rem', margin: '0.6rem 0' }}>
                          {opts.map((opt: string, i: number) => (
                            <div
                              key={i}
                              style={{
                                padding: '0.3rem 0.5rem',
                                borderRadius: '4px',
                                background: i === q.correct_index ? '#DEF7EC' : 'var(--bg-page)',
                                fontWeight: i === q.correct_index ? 700 : 400,
                                color: i === q.correct_index ? '#03543F' : 'inherit'
                              }}
                            >
                              {String.fromCharCode(65 + i)}: {opt} {i === q.correct_index && '✓'}
                            </div>
                          ))}
                        </div>

                        {q.explanation && (
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                            💡 {q.explanation}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};
