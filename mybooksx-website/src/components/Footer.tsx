import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { Phone, Mail, MapPin, ArrowUp, Sparkles } from 'lucide-react';
import './Footer.css';

interface FooterProps {
  onOpenOwner?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenOwner }) => {
  const { t } = useLanguage();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="site-footer">
      <div className="container footer-content-wrap">
        {/* Top Col 1: Brand & Circular Logo */}
        <div className="footer-brand-col">
          <div className="footer-brand-row">
            <div className="circular-logo-container">
              <img 
                src="/logo/mybooksx-logo.png" 
                alt="MyBooksX" 
                className="circular-logo-img" 
              />
            </div>
            <span className="footer-brand-title">MyBooksX</span>
          </div>

          <p className="footer-tagline">{t.footer.tagline}</p>

          <div className="footer-badge-pill">
            <Sparkles size={13} className="text-royal" />
            <span>Digital Engineering & Products Studio</span>
          </div>
        </div>

        {/* Col 2: Products & Flagship Suites */}
        <div className="footer-links-col">
          <h4 className="footer-col-title">Flagship Products & Deals</h4>
          <ul className="footer-link-list">
            <li>
              <a href="#products">Resto-X Restaurant POS (₹4,999/yr)</a>
            </li>
            <li>
              <a href="#products">Event-X Wedding Suite (₹2,999)</a>
            </li>
            <li>
              <a href="#products">Fitness-X Gym Manager (₹999/yr)</a>
            </li>
            <li>
              <a href="#products">Ojas AI Business Copilot (₹999/yr)</a>
            </li>
            <li>
              <a href="#pricing">Custom Website (₹5,999/yr or ₹24,999)</a>
            </li>
            <li>
              <a href="#pricing">Custom Android App (₹6,999/yr or ₹29,999)</a>
            </li>
          </ul>
        </div>

        {/* Col 3: Direct Official Contact Channels */}
        <div className="footer-links-col">
          <h4 className="footer-col-title">Direct Inquiries</h4>
          <div className="footer-contact-details">
            <a href="tel:+919644570828" className="footer-contact-row">
              <Phone size={17} className="text-royal" />
              <span>+91 9644570828</span>
            </a>
            <a href="mailto:mybooksxofficial@gmail.com" className="footer-contact-row">
              <Mail size={17} className="text-royal" />
              <span>mybooksxofficial@gmail.com</span>
            </a>
            <div className="footer-contact-row static">
              <MapPin size={17} className="text-royal" />
              <span>{t.footer.address}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom-bar">
        <div className="container bottom-bar-inner">
          <p className="copyright-text">
            © {new Date().getFullYear()} MyBooksX Studio. {t.footer.rights}
          </p>

          <div className="footer-bottom-actions">
            <button
              type="button"
              onClick={onOpenOwner}
              className="owner-portal-trigger-link"
              title="Restricted Administrative Login"
            >
              <span>🔐 Owner Portal</span>
            </button>

            <button
              type="button"
              onClick={scrollToTop}
              className="scroll-top-btn"
              aria-label="Scroll to top"
            >
              <span>Back to Top</span>
              <ArrowUp size={16} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
