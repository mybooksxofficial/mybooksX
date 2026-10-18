import React, { useState, useEffect } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { Menu, ArrowRight } from 'lucide-react';
import './Navbar.css';

interface NavbarProps {
  onToggleSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const { language, setLanguage, t } = useLanguage();
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
        {/* Brand with Circular Logo */}
        <div className="nav-left">
          <button 
            type="button" 
            className="sidebar-toggle-btn desktop-only-btn"
            onClick={onToggleSidebar}
            title="Explore Products & Quick Menu"
            aria-label="Open Sidebar"
          >
            <Menu size={20} />
          </button>

          <a href="#" className="nav-logo-link" aria-label="MyBooksX Home">
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
          <a href="#products" className="nav-link">{t.nav.products}</a>
          <a href="#digital-growth" className="nav-link">Digital Growth</a>
          <a href="#why-choose-us" className="nav-link">Why Choose Us</a>
          <a href="#reviews" className="nav-link">Client Reviews</a>
          <a href="#faq" className="nav-link">{t.nav.faq}</a>
        </div>

        {/* Clean Right Actions */}
        <div className="nav-actions">
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

          {/* Single Focused CTA */}
          <a href="#custom-solution" className="btn-primary nav-cta">
            <span>{t.nav.startProject}</span>
            <ArrowRight size={14} />
          </a>

          {/* Mobile Single Unified Drawer Hamburger */}
          <button
            type="button"
            className="mobile-toggle-btn"
            onClick={onToggleSidebar}
            aria-label="Open Navigation Menu"
          >
            <Menu size={22} />
          </button>
        </div>
      </nav>
    </header>
  );
};
