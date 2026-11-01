import React, { useState, useEffect } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { useAuth } from '../context/AuthContext.tsx';
import { navigateTo } from '../utils/navigation.ts';
import { Menu, ArrowRight, Zap, User, Gift } from 'lucide-react';
import './Navbar.css';

interface NavbarProps {
  onToggleSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const { language, setLanguage, t } = useLanguage();
  const {
    user,
    isAuthenticated,
    openAuthModal
  } = useAuth();

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`navbar-wrapper ${scrolled ? 'scrolled' : ''}`}>
      <nav className="container main-nav">
        {/* Brand with Circular Logo and Primary Sidebar Hamburger Button */}
        <div className="nav-left">
          <button
            type="button"
            className="sidebar-toggle-btn"
            onClick={onToggleSidebar}
            aria-label="Toggle Navigation Sidebar"
            title="Open Navigation Menu & QUEST"
          >
            <Menu size={20} />
          </button>

          <a href="/" className="nav-logo-link" aria-label="MyBooksX Home" onClick={(e) => { e.preventDefault(); navigateTo('/'); }}>
            <div className="circular-logo-container">
              <img 
                src="/logo/mybooksx-logo.png" 
                alt="MyBooksX" 
                className="circular-logo-img" 
              />
            </div>
            <span className="brand-wordmark">MyBooksX</span>
          </a>
        </div>

        {/* Minimal Clean Links for Desktop */}
        <div className="desktop-links">
          <a href="/#products" className="nav-link" onClick={() => navigateTo('/')}>{t.nav.products}</a>
          <a href="/#digital-growth" className="nav-link" onClick={() => navigateTo('/')}>Digital Growth</a>
          <a href="/#why-choose-us" className="nav-link" onClick={() => navigateTo('/')}>Why Choose Us</a>
          <a href="/#reviews" className="nav-link" onClick={() => navigateTo('/')}>Client Reviews</a>
          <a href="/#faq" className="nav-link" onClick={() => navigateTo('/')}>{t.nav.faq}</a>
        </div>

        {/* Clean Right Actions */}
        <div className="nav-actions">
          {/* Direct Redeem Button: Instantly opens /redeem on desktop & mobile */}
          <button
            type="button"
            className="nav-redeem-btn"
            onClick={() => navigateTo('/redeem')}
            title="Open Rewards Marketplace"
          >
            <Gift size={14} className="text-royal" />
            <span>Redeem</span>
          </button>

          {/* User Account / Points Pill (when logged in) */}
          {isAuthenticated && user ? (
            <button
              type="button"
              className="nav-user-pill"
              onClick={() => navigateTo('/dashboard')}
              title="Open My Dashboard"
            >
              <div className="nav-user-points">
                <Zap size={13} className="text-royal" />
                <span>{user.pointsBalance.toLocaleString()} pts</span>
              </div>
              <div className="nav-user-avatar">
                {user.fullName.charAt(0).toUpperCase()}
              </div>
            </button>
          ) : (
            /* Sign In button */
            <button
              type="button"
              className="nav-signin-btn"
              onClick={() => openAuthModal('login')}
            >
              <User size={15} />
              <span>Sign In</span>
            </button>
          )}

          {/* Subtle Language Pill */}
          <div className="lang-switcher">
            <button
              type="button"
              className={`lang-btn ${language === 'en' ? 'active' : ''}`}
              onClick={() => setLanguage('en')}
            >
              EN
            </button>
            <span className="lang-sep">|</span>
            <button
              type="button"
              className={`lang-btn ${language === 'hi' ? 'active' : ''}`}
              onClick={() => setLanguage('hi')}
            >
              हि
            </button>
          </div>

          {/* Focused CTA */}
          <a href="/#custom-solution" className="btn-primary nav-cta desktop-only" onClick={() => navigateTo('/')}>
            <span>{t.nav.startProject}</span>
            <ArrowRight size={14} />
          </a>

          {/* Mobile Right Quick Toggle Button */}
          <button
            type="button"
            className="mobile-toggle-btn mobile-only"
            onClick={onToggleSidebar}
            aria-label="Open Navigation Menu"
            title="Open Navigation Menu & QUEST"
          >
            <Menu size={20} />
          </button>
        </div>
      </nav>
    </header>
  );
};
