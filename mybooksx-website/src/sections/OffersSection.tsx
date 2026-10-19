import React, { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { Check, Sparkles, Tag, ArrowRight, Star, ChevronDown, ChevronUp } from 'lucide-react';
import './OffersSection.css';

interface OffersSectionProps {
  onSelectPlan: (planTitle: string) => void;
}

export const OffersSection: React.FC<OffersSectionProps> = ({ onSelectPlan }) => {
  const { t } = useLanguage();
  const [billingCycle, setBillingCycle] = useState<'yearly' | 'lifetime'>('yearly');
  const [withOjas, setWithOjas] = useState<Record<string, boolean>>({
    website: true,
    app: true
  });
  const [expandedDeals, setExpandedDeals] = useState<Record<number, boolean>>({});

  const toggleExpand = (idx: number) => {
    setExpandedDeals(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const toggleOjas = (key: 'website' | 'app') => {
    setWithOjas(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <section className="offers-section" id="pricing">
      <div className="container">
        <div className="section-header">
          <span className="badge-royal">
            <Tag size={13} />
            {t.offers.badge}
          </span>
          <h2>{t.offers.title}</h2>
          <p>{t.offers.subtitle}</p>

          {/* Luxury Billing Mode Switcher: Yearly vs Lifetime */}
          <div className="billing-cycle-toggle-wrapper">
            <button
              type="button"
              className={`billing-cycle-btn ${billingCycle === 'yearly' ? 'active' : ''}`}
              onClick={() => setBillingCycle('yearly')}
            >
              <span>Yearly License</span>
              <span className="billing-save-pill">From ₹5,999/yr</span>
            </button>
            <button
              type="button"
              className={`billing-cycle-btn ${billingCycle === 'lifetime' ? 'active' : ''}`}
              onClick={() => setBillingCycle('lifetime')}
            >
              <span>100% Lifetime Ownership</span>
              <span className="billing-save-pill">Permanent Code</span>
            </button>
          </div>
        </div>

        {/* Clean, spacious side-by-side Deals Grid */}
        <div className="deals-grid two-cards-grid">
          {/* Card 1: Custom Website */}
          {(() => {
            const hasOjas = withOjas.website;
            const price = billingCycle === 'yearly'
              ? (hasOjas ? '₹6,999' : '₹5,999')
              : '₹24,999';
            const originalPrice = billingCycle === 'yearly' ? '₹30,000' : '₹38,000';
            const billingNote = billingCycle === 'yearly'
              ? (hasOjas ? 'per year (includes ₹1,000 Ojas AI Copilot add-on)' : 'per year • domain setup & maintenance')
              : 'permanent ownership • 100% full source code';
            const selectionString = billingCycle === 'yearly'
              ? (hasOjas ? 'Customized Website + Ojas AI - Yearly (₹6,999/yr)' : 'Customized Website Development - Yearly (₹5,999/yr)')
              : 'Customized Website Development - Lifetime (₹24,999)';
            const isExpanded = !!expandedDeals[0];

            return (
              <div className="deal-card popular-card interactive-card compact-deal-card">
                <div className="popular-badge">
                  <Star size={12} fill="#FFFFFF" />
                  <span>MOST POPULAR • HIGH ROI</span>
                </div>

                <div className="deal-top">
                  <span className="deal-tag">BESPOKE WEB</span>
                  <h3 className="deal-title">Customized Website Development</h3>
                </div>

                <div className="pricing-box">
                  <div className="price-row">
                    <del className="original-price">{originalPrice}</del>
                    <span className="discount-price">{price}</span>
                    {billingCycle === 'yearly' && <span className="price-period">/year</span>}
                  </div>
                  <span className="billing-note">{billingNote}</span>
                </div>

                {/* +₹1,000 with Ojas AI Checkbox Pill (Yearly Mode) */}
                {billingCycle === 'yearly' && (
                  <div
                    className={`ojas-addon-toggle-card ${hasOjas ? 'selected' : ''}`}
                    onClick={() => toggleOjas('website')}
                    role="button"
                    tabIndex={0}
                  >
                    <input
                      type="checkbox"
                      checked={hasOjas}
                      onChange={() => {}}
                      className="ojas-addon-checkbox"
                    />
                    <div className="ojas-addon-text">
                      <strong>Include Ojas AI Copilot (+₹1,000/yr)</strong>
                      <span>24/7 bilingual leads handler, WhatsApp chat & OCR scanner</span>
                    </div>
                  </div>
                )}

                {/* Minimal Arrow Toggle Button */}
                <button
                  type="button"
                  className={`deal-arrow-toggle-btn ${isExpanded ? 'active' : ''}`}
                  onClick={() => toggleExpand(0)}
                  aria-label={isExpanded ? 'Collapse features' : 'Expand full features'}
                >
                  {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>

                {/* Expanded Details Drawer */}
                {isExpanded && (
                  <div className="deal-expanded-drawer">
                    <p className="deal-desc">
                      Full bespoke luxury responsive website engineered for your exact branding, search engine rankings, and high conversion.
                    </p>
                    <ul className="deal-features-list">
                      <li><Check size={16} className="check-icon" /><span>Unique bespoke luxury design (Neutral Elegance theme)</span></li>
                      <li><Check size={16} className="check-icon" /><span>Dynamic multilingual engine (English & Hindi)</span></li>
                      <li><Check size={16} className="check-icon" /><span>Mobile-first ultra-responsive performance & Google SEO ready</span></li>
                      <li><Check size={16} className="check-icon" /><span>Direct WhatsApp & Email lead transmission</span></li>
                      <li><Check size={16} className="check-icon" /><span>{billingCycle === 'yearly' ? 'Annual cloud maintenance & uptime monitoring' : '100% full source code ownership delivered'}</span></li>
                    </ul>
                  </div>
                )}

                <div className="deal-card-footer">
                  <a
                    href="#custom-solution"
                    onClick={() => onSelectPlan(selectionString)}
                    className="w-full btn-primary deal-cta-btn"
                  >
                    <span>Claim Website ({price}{billingCycle === 'yearly' ? '/yr' : ''})</span>
                    <ArrowRight size={15} />
                  </a>
                </div>
              </div>
            );
          })()}

          {/* Card 2: Custom Android App */}
          {(() => {
            const hasOjas = withOjas.app;
            const price = billingCycle === 'yearly'
              ? (hasOjas ? '₹7,999' : '₹6,999')
              : '₹29,999';
            const originalPrice = billingCycle === 'yearly' ? '₹50,000' : '₹65,000';
            const billingNote = billingCycle === 'yearly'
              ? (hasOjas ? 'per year (includes ₹1,000 Ojas AI Copilot add-on)' : 'per year • Play Store release & cloud sync')
              : 'permanent ownership • 100% full source code & Play Store';
            const selectionString = billingCycle === 'yearly'
              ? (hasOjas ? 'Customized Android App + Ojas AI - Yearly (₹7,999/yr)' : 'Customized Android App - Yearly (₹6,999/yr)')
              : 'Customized Android App Development - Lifetime (₹29,999)';
            const isExpanded = !!expandedDeals[1];

            return (
              <div className="deal-card popular-card interactive-card compact-deal-card">
                <div className="popular-badge">
                  <Star size={12} fill="#FFFFFF" />
                  <span>FLAGSHIP ENTERPRISE</span>
                </div>

                <div className="deal-top">
                  <span className="deal-tag">NATIVE APP</span>
                  <h3 className="deal-title">Customized Android App Development</h3>
                </div>

                <div className="pricing-box">
                  <div className="price-row">
                    <del className="original-price">{originalPrice}</del>
                    <span className="discount-price">{price}</span>
                    {billingCycle === 'yearly' && <span className="price-period">/year</span>}
                  </div>
                  <span className="billing-note">{billingNote}</span>
                </div>

                {/* +₹1,000 with Ojas AI Checkbox Pill (Yearly Mode) */}
                {billingCycle === 'yearly' && (
                  <div
                    className={`ojas-addon-toggle-card ${hasOjas ? 'selected' : ''}`}
                    onClick={() => toggleOjas('app')}
                    role="button"
                    tabIndex={0}
                  >
                    <input
                      type="checkbox"
                      checked={hasOjas}
                      onChange={() => {}}
                      className="ojas-addon-checkbox"
                    />
                    <div className="ojas-addon-text">
                      <strong>Include Ojas AI Copilot (+₹1,000/yr)</strong>
                      <span>In-app intelligent user assistant & voice response</span>
                    </div>
                  </div>
                )}

                {/* Minimal Arrow Toggle Button */}
                <button
                  type="button"
                  className={`deal-arrow-toggle-btn ${isExpanded ? 'active' : ''}`}
                  onClick={() => toggleExpand(1)}
                  aria-label={isExpanded ? 'Collapse features' : 'Expand full features'}
                >
                  {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>

                {/* Expanded Details Drawer */}
                {isExpanded && (
                  <div className="deal-expanded-drawer">
                    <p className="deal-desc">
                      Native-grade Android mobile application customized to your inventory, dispatch, field staff, or customer ordering flow.
                    </p>
                    <ul className="deal-features-list">
                      <li><Check size={16} className="check-icon" /><span>Custom-built Mobile App & Play Store publishing</span></li>
                      <li><Check size={16} className="check-icon" /><span>Real-time cloud database synchronization</span></li>
                      <li><Check size={16} className="check-icon" /><span>Push alerts, user authentication & OTP login</span></li>
                      <li><Check size={16} className="check-icon" /><span>Payment gateway integration (UPI, QR, Cards)</span></li>
                      <li><Check size={16} className="check-icon" /><span>{billingCycle === 'yearly' ? 'Complete annual maintenance & security patch updates' : '100% full source code ownership delivered'}</span></li>
                    </ul>
                  </div>
                )}

                <div className="deal-card-footer">
                  <a
                    href="#custom-solution"
                    onClick={() => onSelectPlan(selectionString)}
                    className="w-full btn-primary deal-cta-btn"
                  >
                    <span>Claim Android App ({price}{billingCycle === 'yearly' ? '/yr' : ''})</span>
                    <ArrowRight size={15} />
                  </a>
                </div>
              </div>
            );
          })()}
        </div>

        {/* Maintenance highlight banner */}
        <div className="yearly-maintenance-highlight">
          <div className="maintenance-icon-box">
            <Sparkles size={26} className="text-royal" />
          </div>
          <div className="maintenance-text">
            <h4>Mobile Application Yearly Maintenance Discount</h4>
            <p>
              We believe in long-term relationships without extortionate renewal fees. Our full yearly mobile app maintenance package has been cut from <del>₹8,000</del> to just <strong>₹5,999/year</strong>, covering cloud databases, security audits, and continuous performance updates.
            </p>
          </div>
          <a href="#custom-solution" className="btn-accent maintenance-cta-btn">
            Lock in ₹5,999/yr Rate
          </a>
        </div>
      </div>
    </section>
  );
};
