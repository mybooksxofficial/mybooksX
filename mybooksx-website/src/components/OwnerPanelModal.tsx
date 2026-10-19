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
  Cloud
} from 'lucide-react';
import { bookingService } from '../services/bookingService';
import type { BookingRecord, LoginLogRecord } from '../services/bookingService';
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
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  
  // Tabs: 'bookings' or 'logins'
  const [activeTab, setActiveTab] = useState<'bookings' | 'logins'>('bookings');
  
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [loginLogs, setLoginLogs] = useState<LoginLogRecord[]>([]);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncedTime, setLastSyncedTime] = useState<string>('');

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'All' | 'New' | 'Contacted' | 'Closed'>('All');

  // Load and auto-sync with shared cloud database
  useEffect(() => {
    if (isOpen && isAuthenticated) {
      // 1. Initial fast local cache load
      setBookings(bookingService.getAllBookings());
      setLoginLogs(bookingService.getLoginLogs());

      // 2. Fetch live cross-device data from cloud
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

            {/* TAB SELECTOR: Client Bookings vs Login Activity */}
            <div className="owner-tabs-row">
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
                className={`owner-tab-nav-btn ${activeTab === 'logins' ? 'active' : ''}`}
                onClick={() => setActiveTab('logins')}
              >
                <History size={15} />
                <span>Who Logged In (Access Audit)</span>
                <span className="tab-pill-badge">{loginLogs.length}</span>
              </button>
            </div>

            {activeTab === 'bookings' ? (
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
            ) : (
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
            )}
          </div>
        )}
      </main>
    </div>
  );
};
