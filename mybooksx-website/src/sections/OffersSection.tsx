import React, { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { Check, Sparkles, Tag, ArrowRight, Star, ChevronDown, ChevronUp } from 'lucide-react';
import './OffersSection.css';

interface OffersSectionProps {
  onSelectPlan: (planTitle: string) => void;
}

export const OffersSection: React.FC<OffersSectionProps> = ({ onSelectPlan }) => {
  const { t } = useLanguage();
  const [isOffersMasterOpen, setIsOffersMasterOpen] = useState(false);
  const [expandedDeals, setExpandedDeals] = useState<Record<number, boolean>>({});

  const toggleExpand = (idx: number) => {
    setExpandedDeals(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const toggleOffersMaster = () => {
    setIsOffersMasterOpen(prev => !prev);
  };

  // Keep first two deals: Custom Website & Custom Android App (removes chaotic 3rd card)
  const displayDeals = t.offers.deals.slice(0, 2);

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
        </div>

        {/* Mobile-Only Master Dropdown Trigger Card for Custom Web & Custom App */}
        <div className="offers-master-control-wrap mobile-only-master-trigger">
          <button
            type="button"
            className={`offers-master-trigger-card ${isOffersMasterOpen ? 'active' : ''}`}
            onClick={toggleOffersMaster}
            aria-expanded={isOffersMasterOpen}
          >
            <div className="offers-master-left">
              <div className="offers-master-icon-pill">
                <Sparkles size={24} className="text-royal" />
              </div>
              <div className="offers-master-text-group">
                <span className="offers-master-title">
                  {isOffersMasterOpen
                    ? 'Hide Custom Web & Mobile App Packages'
                    : 'Custom App & Custom Web Packages (Click to Expand)'}
                </span>
                <span className="offers-master-subtext">
                  {isOffersMasterOpen
                    ? 'Click to collapse and save screen space'
                    : 'Custom Website from ₹14,999 & Android Mobile App from ₹24,999 • Tap to View'}
                </span>
              </div>
            </div>
            <div className="offers-master-right">
              <span className="offers-count-badge">2 Packages</span>
              <ChevronDown size={22} className={`offers-master-chevron ${isOffersMasterOpen ? 'rotated' : ''}`} />
            </div>
          </button>
        </div>

        {/* Always visible on laptop/desktop; collapsible on mobile */}
        <div className={`offers-content-wrap ${isOffersMasterOpen ? 'mobile-visible' : 'mobile-hidden'}`}>
          <div className="deals-grid two-cards-grid">
          {displayDeals.map((deal, idx) => {
            const isExpanded = !!expandedDeals[idx];

            return (
              <div
                key={idx}
                className={`deal-card ${deal.popular ? 'popular-card' : ''} interactive-card compact-deal-card`}
              >
                {deal.popular && (
                  <div className="popular-badge">
                    <Star size={12} fill="#FFFFFF" />
                    <span>MOST POPULAR</span>
                  </div>
                )}

                <div className="deal-top">
                  <span className="deal-tag">{deal.tag}</span>
                  <h3 className="deal-title">{deal.title}</h3>
                </div>

                <div className="pricing-box">
                  <div className="price-row">
                    <del className="original-price">{deal.originalPrice}</del>
                    <span className="discount-price">{deal.discountPrice}</span>
                  </div>
                  <span className="billing-note">{deal.billingNote}</span>
                </div>

                {/* Minimal Arrow Toggle Button to match Product Cards */}
                <button
                  type="button"
                  className={`deal-arrow-toggle-btn ${isExpanded ? 'active' : ''}`}
                  onClick={() => toggleExpand(idx)}
                  aria-label={isExpanded ? 'Collapse features' : 'Expand full features'}
                  title={isExpanded ? 'Collapse details' : 'Expand details'}
                >
                  {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>

                {/* Expanded Details Drawer */}
                {isExpanded && (
                  <div className="deal-expanded-drawer">
                    <p className="deal-desc">{deal.desc}</p>
                    <ul className="deal-features-list">
                      {deal.features.map((feat, fIdx) => (
                        <li key={fIdx}>
                          <Check size={16} className="check-icon" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="deal-card-footer">
                  <a
                    href="#custom-solution"
                    onClick={() => onSelectPlan(deal.title)}
                    className={`w-full ${deal.popular ? 'btn-primary' : 'btn-secondary'} deal-cta-btn`}
                  >
                    <span>{deal.cta}</span>
                    <ArrowRight size={15} />
                  </a>
                </div>
              </div>
            );
          })}
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
    </div>
  </section>
);
};
