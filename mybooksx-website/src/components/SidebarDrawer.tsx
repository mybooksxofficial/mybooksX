import React from 'react';
import { X, Sparkles, Utensils, HeartHandshake, Bot, Dumbbell, ShieldCheck, Phone, Mail, ArrowRight } from 'lucide-react';
import './SidebarDrawer.css';

interface SidebarDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenWheel: () => void;
  onOpenOjas: () => void;
  onSelectProduct: (name: string) => void;
  onOpenOwner?: () => void;
}

export const SidebarDrawer: React.FC<SidebarDrawerProps> = ({
  isOpen,
  onClose,
  onOpenWheel,
  onOpenOjas,
  onSelectProduct,
  onOpenOwner
}) => {
  if (!isOpen) return null;

  return (
    <div className="sidebar-overlay" onClick={onClose}>
      <aside className="sidebar-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <div className="circular-logo-container">
              <img src="/logo/mybooksx-logo.png" alt="MyBooksX" className="circular-logo-img" />
            </div>
            <div>
              <h3 className="sidebar-title">MyBooksX Studio</h3>
              <span className="sidebar-subtitle">Digital Product Ecosystem</span>
            </div>
          </div>
          <button type="button" className="sidebar-close-btn" onClick={onClose} aria-label="Close Sidebar">
            <X size={20} />
          </button>
        </div>

        {/* Quick Ojas AI Intelligence Copilot Card */}
        <div className="sidebar-wheel-card" style={{ borderColor: 'var(--royal-blue)', background: 'linear-gradient(135deg, var(--royal-blue-light), #FFFFFF)' }}>
          <div className="wheel-badge-icon" style={{ background: '#0B132B' }}>
            <img src="/logo/ojas-ai-logo.jpg" alt="Ojas AI" style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
          </div>
          <div className="wheel-text-block">
            <strong>Chat with Ojas</strong>
            <p>24/7 Intelligent answers for pricing, process & custom solutions.</p>
          </div>
          <button
            type="button"
            className="btn-primary sidebar-spin-btn"
            onClick={() => {
              onClose();
              onOpenOjas();
            }}
          >
            Try Ojas
          </button>
        </div>

        {/* Quick Lucky Wheel Trigger Banner */}
        <div className="sidebar-wheel-card">
          <div className="wheel-badge-icon">
            <Sparkles size={18} className="text-royal" />
          </div>
          <div className="wheel-text-block">
            <strong>Festive Discount Wheel</strong>
            <p>Spin once to reveal up to 12% OFF or ₹1,000 cash discount.</p>
          </div>
          <button
            type="button"
            className="btn-accent sidebar-spin-btn"
            onClick={() => {
              onClose();
              onOpenWheel();
            }}
          >
            Spin Now
          </button>
        </div>

        {/* Mobile & Desktop Page Navigation Links */}
        <div className="sidebar-section">
          <span className="sidebar-section-label">PAGE NAVIGATION</span>
          <div className="sidebar-nav-links">
            <a href="#products" onClick={onClose} className="sidebar-nav-link">
              <span>Flagship Products</span>
              <ArrowRight size={13} className="nav-arrow-hint" />
            </a>
            <a href="#digital-growth" onClick={onClose} className="sidebar-nav-link">
              <span>Digital Growth Services</span>
              <ArrowRight size={13} className="nav-arrow-hint" />
            </a>
            <a href="#why-choose-us" onClick={onClose} className="sidebar-nav-link">
              <span>Why Choose Us</span>
              <ArrowRight size={13} className="nav-arrow-hint" />
            </a>
            <a href="#reviews" onClick={onClose} className="sidebar-nav-link">
              <span>Client Verified Reviews</span>
              <ArrowRight size={13} className="nav-arrow-hint" />
            </a>
            <a href="#custom-solution" onClick={onClose} className="sidebar-nav-link">
              <span>Book Custom Project</span>
              <ArrowRight size={13} className="nav-arrow-hint" />
            </a>
            <a href="#faq" onClick={onClose} className="sidebar-nav-link">
              <span>Frequently Asked Questions</span>
              <ArrowRight size={13} className="nav-arrow-hint" />
            </a>
          </div>
        </div>

        {/* Flagship Products Quick Access */}
        <div className="sidebar-section">
          <span className="sidebar-section-label">FLAGSHIP SOFTWARE</span>
          <div className="sidebar-product-list">
            <div
              className="sidebar-product-item"
              onClick={() => {
                onClose();
                onSelectProduct('Resto-X Dining Suite');
              }}
            >
              <div className="prod-icon-box"><Utensils size={18} /></div>
              <div className="prod-info">
                <strong>Resto-X</strong>
                <span>Restaurant POS & Table QR</span>
              </div>
              <span className="prod-price-pill">₹4,999/yr</span>
            </div>

            <div
              className="sidebar-product-item"
              onClick={() => {
                onClose();
                onSelectProduct('Ojas AI Intelligence');
              }}
            >
              <div className="prod-icon-box"><Bot size={18} /></div>
              <div className="prod-info">
                <strong>Ojas AI</strong>
                <span>Bilingual Customer Bot & OCR</span>
              </div>
              <span className="prod-price-pill">₹999/yr</span>
            </div>

            <div
              className="sidebar-product-item"
              onClick={() => {
                onClose();
                onSelectProduct('Event-X Wedding Suite');
              }}
            >
              <div className="prod-icon-box"><HeartHandshake size={18} /></div>
              <div className="prod-info">
                <strong>Event-X</strong>
                <span>Royal Wedding & Guest App</span>
              </div>
              <span className="prod-price-pill">₹2,999</span>
            </div>

            <div
              className="sidebar-product-item"
              onClick={() => {
                onClose();
                onSelectProduct('Fitness-X Gym Manager');
              }}
            >
              <div className="prod-icon-box"><Dumbbell size={18} /></div>
              <div className="prod-info">
                <strong>Fitness-X</strong>
                <span>Gym, Attendance & Fees</span>
              </div>
              <span className="prod-price-pill">₹999/yr</span>
            </div>
          </div>
        </div>

        {/* 24/7 Support Block */}
        <div className="sidebar-support-box">
          <div className="support-badge">
            <ShieldCheck size={16} className="text-royal" />
            <span>24/7 Direct Engineering Support</span>
          </div>
          <p>Get immediate responses from senior software architects.</p>
          <div className="support-contacts">
            <a href="tel:+919644570828" className="support-link">
              <Phone size={14} /> +91 9644570828
            </a>
            <a href="mailto:mybooksxofficial@gmail.com" className="support-link">
              <Mail size={14} /> mybooksxofficial@gmail.com
            </a>
          </div>
        </div>

        {/* Quick CTA & Owner Link */}
        <div className="sidebar-footer">
          <a
            href="#custom-solution"
            onClick={onClose}
            className="btn-primary w-full sidebar-cta"
          >
            <span>Book Custom Project</span>
            <ArrowRight size={15} />
          </a>

          <button
            type="button"
            onClick={() => {
              onClose();
              if (onOpenOwner) onOpenOwner();
            }}
            className="sidebar-owner-btn"
          >
            🔐 Owner / Admin Portal
          </button>
        </div>
      </aside>
    </div>
  );
};
