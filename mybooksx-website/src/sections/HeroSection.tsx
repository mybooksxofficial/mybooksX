import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { ArrowRight, Sparkles, CheckCircle2, ShieldCheck, Zap, Phone, Clock, Bot } from 'lucide-react';
import './HeroSection.css';

interface HeroSectionProps {
  onOpenWheel: () => void;
  onOpenOjas: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenWheel, onOpenOjas }) => {
  const { t } = useLanguage();

  return (
    <section className="hero-section" id="hero">
      <div className="hero-bg-accents">
        <div className="hero-gradient-orb orb-1" />
        <div className="hero-gradient-orb orb-2" />
        <div className="hero-grid-pattern" />
      </div>

      <div className="container hero-container-clean">
        <div className="hero-badge-wrap">
          <span className="badge-royal">
            <Sparkles size={14} className="sparkle-icon" />
            {t.hero.badge}
          </span>
        </div>

        <h1 className="hero-headline-centered">
          <span className="hero-text-block">{t.hero.title1}</span>{' '}
          <span className="hero-text-gradient">{t.hero.titleHighlight}</span>
          <span className="hero-subline-block">{t.hero.title2}</span>
        </h1>

        <p className="hero-description-centered">{t.hero.subtitle}</p>

        {/* Clean Action Buttons */}
        <div className="hero-ctas-centered">
          <a href="#custom-solution" className="btn-primary hero-btn-main">
            <span>{t.hero.primaryCta}</span>
            <ArrowRight size={17} />
          </a>

          <button type="button" onClick={onOpenOjas} className="btn-accent hero-btn-ojas">
            <Bot size={16} />
            <span>Try Ojas</span>
          </button>

          <button type="button" onClick={onOpenWheel} className="btn-secondary hero-btn-wheel">
            <Sparkles size={16} />
            <span>Spin Lucky Wheel</span>
          </button>
        </div>

        {/* Real-world trust pills */}
        <div className="hero-trust-bullets-centered">
          <div className="trust-item">
            <CheckCircle2 size={16} className="trust-icon" />
            <span>Bespoke Architecture</span>
          </div>
          <div className="trust-item">
            <Clock size={16} className="trust-icon" />
            <span>24/7 Priority Support</span>
          </div>
          <div className="trust-item">
            <ShieldCheck size={16} className="trust-icon" />
            <span>Delivered in 3 Weeks</span>
          </div>
          <div className="trust-item">
            <Zap size={16} className="trust-icon" />
            <span>100% Full Custom Code</span>
          </div>
        </div>

        <div className="hero-hotline-note-centered">
          <span><Phone size={14} className="inline-icon" /> Direct Hotline: +91 9644570828 | mybooksxofficial@gmail.com</span>
        </div>
      </div>
    </section>
  );
};
