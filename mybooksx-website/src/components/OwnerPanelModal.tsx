import React, { useState, useEffect } from 'react';
import { X, Lock, Key, ShieldCheck, LogOut, Clock, Phone, MessageSquare, Trash2, Search, Filter, AlertCircle } from 'lucide-react';
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

    // Default Owner Credentials
    if ((cleanId === 'admin@mybooksx.com' || cleanId === 'owner' || cleanId === 'admin') && cleanPass === 'admin') {
      setIsAuthenticated(true);
      sessionStorage.setItem('mybooksx_owner_auth', 'true');
      setLoginError('');
      setBookings(bookingService.getAllBookings());
    } else {
      setLoginError('Invalid Owner ID or Password. Please check the credentials displayed below.');
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
    <div className="owner-modal-overlay" onClick={onClose}>
      <div className="owner-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="owner-modal-header">
          <div className="owner-header-left">
            <div className="owner-badge-icon">
              <ShieldCheck size={22} className="text-royal" />
            </div>
            <div>
              <h3>MyBooksX Owner Panel</h3>
              <span className="owner-subline">Administrative Control & Client Bookings</span>
            </div>
          </div>
          <div className="owner-header-right">
            {isAuthenticated && (
              <button type="button" className="owner-logout-btn" onClick={handleLogout} title="Log Out">
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            )}
            <button type="button" className="owner-close-btn" onClick={onClose} aria-label="Close Owner Panel">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        {!isAuthenticated ? (
          /* LOGIN SCREEN */
          <div className="owner-login-view">
            <div className="login-security-tag">
              <Lock size={14} />
              <span>Restricted Management Portal</span>
            </div>

            <h4 className="login-heading">Owner Login</h4>
            <p className="login-subtext">
              Sign in with your master credentials to view, manage, and contact all clients who booked via the website.
            </p>

            {/* Display ID & Password as requested */}
            <div className="credentials-display-box">
              <div className="cred-header">
                <Key size={14} className="text-royal" />
                <strong>Default Owner Credentials</strong>
              </div>
              <div className="cred-row">
                <span>Owner ID:</span>
                <code>admin@mybooksx.com</code>
              </div>
              <div className="cred-row">
                <span>Password:</span>
                <code>admin</code>
              </div>
            </div>

            {loginError && (
              <div className="login-error-alert">
                <AlertCircle size={15} />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="owner-login-form">
              <div className="form-field">
                <label htmlFor="ownerId">Owner ID / Username</label>
                <input
                  type="text"
                  id="ownerId"
                  placeholder="e.g. admin@mybooksx.com or admin"
                  value={ownerId}
                  onChange={(e) => setOwnerId(e.target.value)}
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="ownerPassword">Password</label>
                <input
                  type="password"
                  id="ownerPassword"
                  placeholder="Enter Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn-primary w-full owner-submit-btn">
                <span>Access Bookings Dashboard</span>
                <ShieldCheck size={16} />
              </button>
            </form>

            <span className="owner-note-hint">
              Note: Normal website visitors book projects directly without encountering any login screens.
            </span>
          </div>
        ) : (
          /* DASHBOARD SCREEN */
          <div className="owner-dashboard-view">
            {/* Quick Metrics Bar */}
            <div className="owner-metrics-bar">
              <div className="metric-chip">
                <span>Total Bookings</span>
                <strong>{bookings.length}</strong>
              </div>
              <div className="metric-chip highlight-new">
                <span>New Bookings</span>
                <strong>{countNew}</strong>
              </div>
              <div className="metric-chip">
                <span>Contacted</span>
                <strong>{countContacted}</strong>
              </div>
            </div>

            {/* Controls Bar: Search & Status Filter */}
            <div className="owner-controls-bar">
              <div className="owner-search-wrap">
                <Search size={16} className="search-icon" />
                <input
                  type="text"
                  placeholder="Search by client name, phone, or service..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="owner-filter-wrap">
                <Filter size={15} className="filter-icon" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                  className="owner-filter-select"
                >
                  <option value="All">All Statuses ({bookings.length})</option>
                  <option value="New">New Only ({countNew})</option>
                  <option value="Contacted">Contacted ({countContacted})</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
            </div>

            {/* Bookings List */}
            {filteredBookings.length === 0 ? (
              <div className="empty-bookings-box">
                <Clock size={36} className="text-muted" />
                <h4>No Bookings Found</h4>
                <p>New inquiries and project bookings from the website will appear here in real-time.</p>
              </div>
            ) : (
              <div className="bookings-cards-list">
                {filteredBookings.map((b) => (
                  <div key={b.id} className={`booking-record-card status-${b.status.toLowerCase()}`}>
                    <div className="booking-card-top">
                      <div className="booking-client-info">
                        <span className="booking-id-pill">{b.id}</span>
                        <h4 className="booking-client-name">{b.name}</h4>
                        {b.businessType && <span className="booking-business-type">{b.businessType}</span>}
                      </div>

                      <div className="booking-status-actions">
                        <select
                          value={b.status}
                          onChange={(e) => handleStatusChange(b.id, e.target.value as any)}
                          className={`status-dropdown-pill status-${b.status.toLowerCase()}`}
                        >
                          <option value="New">🟡 New</option>
                          <option value="Contacted">🟢 Contacted</option>
                          <option value="Closed">⚪ Closed</option>
                        </select>

                        <button
                          type="button"
                          className="booking-delete-btn"
                          onClick={() => handleDelete(b.id)}
                          title="Delete booking"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>

                    <div className="booking-service-badge">
                      <strong>Requested Service:</strong> {b.service}
                      {b.promoCode && <span className="promo-badge-tag">Promo: {b.promoCode}</span>}
                    </div>

                    {b.details && (
                      <p className="booking-details-text">
                        <strong>Project Notes:</strong> {b.details}
                      </p>
                    )}

                    <div className="booking-card-footer">
                      <span className="booking-time-stamp">
                        <Clock size={13} className="inline-icon" /> {b.createdAt}
                      </span>

                      <div className="booking-contact-actions">
                        <a
                          href={`https://wa.me/${b.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                            `Hello ${b.name}! Thank you for your booking on MyBooksX for "${b.service}". How can we help you get started?`
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                          className="btn-whatsapp-quick"
                          title="Open WhatsApp chat with client"
                        >
                          <MessageSquare size={14} />
                          <span>WhatsApp Client</span>
                        </a>

                        <a href={`tel:${b.phone}`} className="btn-call-quick" title="Call Client">
                          <Phone size={14} />
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
      </div>
    </div>
  );
};
