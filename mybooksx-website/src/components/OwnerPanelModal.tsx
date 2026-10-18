import React, { useState, useEffect } from 'react';
import { ArrowLeft, Lock, ShieldCheck, LogOut, Clock, Phone, MessageSquare, Trash2, Search, Filter, AlertCircle, UserCheck, Eye, EyeOff } from 'lucide-react';
import { bookingService } from '../services/bookingService';
import type { BookingRecord } from '../services/bookingService';
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
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'All' | 'New' | 'Contacted' | 'Closed'>('All');

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      setBookings(bookingService.getAllBookings());
    }
  }, [isOpen, isAuthenticated]);

  if (!isOpen) return null;

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
      setBookings(bookingService.getAllBookings());
    } else {
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
            <button type="button" className="owner-signout-btn" onClick={handleLogout}>
              <LogOut size={16} />
              <span>Log Out</span>
            </button>
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
                <h2>Client Inquiries & Bookings</h2>
                <p>Real-time list of client consultation requests submitted through the website.</p>
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
                    : 'When clients book a consultation or project on the website, their details will immediately appear on this page without fake dummy data.'}
                </p>
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
          </div>
        )}
      </main>
    </div>
  );
};
