import React, { useState } from 'react';
import { Check, Sparkles, Utensils, HeartHandshake, Bot, Dumbbell, ArrowRight, ChevronDown, ChevronUp, Plus } from 'lucide-react';
import { InteractiveCard } from '../components/InteractiveCard';
import './ProductsSection.css';

interface ProductsSectionProps {
  onSelectProduct: (productName: string) => void;
}

export const ProductsSection: React.FC<ProductsSectionProps> = ({ onSelectProduct }) => {
  const [billingCycle, setBillingCycle] = useState<'yearly' | 'permanent'>('yearly');
  const [restoWithOjas, setRestoWithOjas] = useState(false);
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});
  const [mobileOpenAppId, setMobileOpenAppId] = useState<string | null>('resto-x');

  const toggleExpand = (id: string) => {
    setExpandedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleMobileAccordion = (id: string) => {
    setMobileOpenAppId((prev) => (prev === id ? null : id));
  };

  const productsConfig = [
    {
      id: 'resto-x',
      tag: 'DINING & HOSPITALITY',
      name: 'Resto-X',
      icon: <Utensils size={24} className="product-icon text-royal" />,
      desc: 'Complete restaurant POS with table QR ordering, kitchen display (KOT), inventory, and GST invoicing.',
      yearlyPrice: restoWithOjas ? 5999 : 4999,
      permanentPrice: restoWithOjas ? 27499 : 24999,
      yearlyOriginal: restoWithOjas ? '₹9,999' : '₹9,000',
      permanentOriginal: restoWithOjas ? '₹35,000' : '₹32,000',
      initialFeatures: [
        'Table QR digital ordering & billing',
        'Kitchen Order Ticket (KOT) sync'
      ],
      deepFeatures: [
        'Raw material inventory tracking & recipe management',
        'WhatsApp digital invoice dispatch to customer phones',
        'Complimentary Android Waiter/Billing App included',
        'Real-time daily sales & tax summary dashboard'
      ],
      hasOjasAddon: true,
      popular: true,
    },
    {
      id: 'ojas-ai',
      tag: 'INTELLIGENT AI AGENT',
      name: 'Ojas AI',
      icon: <Bot size={24} className="product-icon text-royal" />,
      desc: 'Next-gen bilingual 24/7 business AI assistant that speaks Hindi & English, handles client leads, and extracts invoice data.',
      yearlyPrice: 999,
      permanentPrice: 1999,
      yearlyOriginal: '₹4,999',
      permanentOriginal: '₹9,999',
      initialFeatures: [
        'Bilingual Hindi & English conversational AI',
        'Automated WhatsApp lead reply bot'
      ],
      deepFeatures: [
        'Paper invoice & receipt OCR data reader',
        'Trained on your private business catalog & pricing',
        'Seamless webhook integration with your database/CRM',
        'Escalation alerts directly to founder WhatsApp'
      ],
      popular: true,
    },
    {
      id: 'event-x',
      tag: 'ROYAL WEDDING & EVENT',
      name: 'Event-X (Wedding Suite)',
      icon: <HeartHandshake size={24} className="product-icon text-royal" />,
      desc: 'Royal wedding companion app for guest RSVP, photo sharing vault, ceremony itinerary, and GPS venue maps.',
      yearlyPrice: null,
      permanentPrice: 2999,
      permanentOriginal: '₹8,999',
      initialFeatures: [
        'Bespoke couple story & ceremony countdown',
        'Interactive RSVP & guest check-in'
      ],
      deepFeatures: [
        'Live guest photo upload feed & high-res gallery',
        'Digital invitation cards & venue GPS map',
        'Push notifications for ceremony timings',
        'Full Event Lifetime Access for all guests'
      ],
      popular: false,
    },
    {
      id: 'fitness-x',
      tag: 'GYM & WELLNESS SUITE',
      name: 'Fitness-X',
      icon: <Dumbbell size={24} className="product-icon text-royal" />,
      desc: 'Modern gym & fitness management app with member check-in, automated WhatsApp renewal alerts, and trainer scheduling.',
      yearlyPrice: 999,
      permanentPrice: 2999,
      yearlyOriginal: '₹4,500',
      permanentOriginal: '₹8,999',
      initialFeatures: [
        'Member attendance & QR scanner',
        'Automated WhatsApp renewal reminders'
      ],
      deepFeatures: [
        'Trainer schedule & diet plans manager',
        'UPI subscription integration & instant receipts',
        'Member mobile portal for workout tracking',
        'Cloud administrative control dashboard'
      ],
      popular: false,
    }
  ];

  return (
    <section className="products-section" id="products">
      <div className="container">
        <div className="section-header">
          <span className="badge-royal">
            <Sparkles size={13} />
            FLAGSHIP PRODUCT SUITE
          </span>
          <h2>Ready-To-Deploy Software Products</h2>
          <p>
            Choose between flexible Yearly Subscriptions or 100% Lifetime Permanent Ownership. Click any card to expand more details.
          </p>

          {/* Pricing Model Slider Switcher */}
          <div className="billing-slider-container">
            <button
              type="button"
              className={`billing-toggle-option ${billingCycle === 'yearly' ? 'active' : ''}`}
              onClick={() => setBillingCycle('yearly')}
            >
              <span>Yearly License</span>
            </button>
            <button
              type="button"
              className={`billing-toggle-option ${billingCycle === 'permanent' ? 'active' : ''}`}
              onClick={() => setBillingCycle('permanent')}
            >
              <span>Permanent Lifetime</span>
              <span className="save-badge">Best Value</span>
            </button>
          </div>
        </div>

        {/* Desktop 4-Card Grid (Hidden on Mobile) */}
        <div className="products-grid desktop-only-grid">
          {productsConfig.map((prod) => {
            const isPermanentOnly = prod.yearlyPrice === null;
            const isExpanded = !!expandedCards[prod.id];

            const currentPrice = isPermanentOnly
              ? prod.permanentPrice
              : billingCycle === 'yearly'
              ? prod.yearlyPrice
              : prod.permanentPrice;

            const originalPrice = isPermanentOnly
              ? prod.permanentOriginal
              : billingCycle === 'yearly'
              ? prod.yearlyOriginal
              : prod.permanentOriginal;

            const priceSuffix = isPermanentOnly
              ? ' permanent'
              : billingCycle === 'yearly'
              ? '/yr'
              : ' lifetime';

            return (
              <InteractiveCard
                key={prod.id}
                className={`product-card ${prod.popular ? 'featured-product' : ''} interactive-card`}
                maxTilt={6}
                spotlightColor={prod.popular ? 'rgba(10, 88, 202, 0.16)' : 'rgba(255, 219, 187, 0.28)'}
              >
                {prod.popular && (
                  <div className="product-featured-tag">
                    <Sparkles size={12} fill="#FFFFFF" />
                    <span>POPULAR</span>
                  </div>
                )}

                <div className="product-card-body">
                  <div className="product-card-top">
                    <div className="product-icon-wrap">{prod.icon}</div>
                    <span className="product-tag">{prod.tag}</span>
                    <h3 className="product-name">{prod.name}</h3>
                  </div>

                  {/* Resto-X Ojas AI Add-on Toggle */}
                  {prod.hasOjasAddon ? (
                    <div className="ojas-addon-box">
                      <label className="ojas-toggle-label">
                        <input
                          type="checkbox"
                          checked={restoWithOjas}
                          onChange={(e) => setRestoWithOjas(e.target.checked)}
                        />
                        <div className="ojas-toggle-text">
                          <span className="toggle-title">
                            <Plus size={13} className="text-royal inline-icon" /> Integrate Ojas AI Bot
                          </span>
                          <span className="toggle-sub">
                            {billingCycle === 'yearly' ? '+₹999/yr (Total ₹5,999/yr)' : '+₹2,500 Permanent (Total ₹27,499)'}
                          </span>
                        </div>
                      </label>
                    </div>
                  ) : (
                    <div className="ojas-addon-box-placeholder" aria-hidden="true" />
                  )}

                  {/* Pricing Box */}
                  <div className="product-pricing-box">
                    <div className="price-line">
                      <del className="product-original">{originalPrice}</del>
                      <span className="product-sale">₹{currentPrice?.toLocaleString()}</span>
                      <span className="price-suffix">{priceSuffix}</span>
                    </div>
                    <span className="billing-type-label">
                      {isPermanentOnly
                        ? 'Full Lifetime Event Access'
                        : billingCycle === 'yearly'
                        ? 'Includes 1 Full Year Cloud & Updates'
                        : '100% Source Code & Database Ownership'}
                    </span>
                  </div>

                  <p className="product-desc">{prod.desc}</p>

                  {/* Core Features */}
                  <ul className="product-features-list">
                    {prod.initialFeatures.map((feat, idx) => (
                      <li key={idx}>
                        <Check size={16} className="feature-check-icon text-royal" />
                        <span>{feat}</span>
                      </li>
                    ))}
                    {isExpanded &&
                      prod.deepFeatures.map((feat, idx) => (
                        <li key={`deep-${idx}`} className="deep-feature-item">
                          <Check size={16} className="feature-check-icon text-royal" />
                          <span>{feat}</span>
                        </li>
                      ))}
                  </ul>

                  {/* Expand / Collapse Button */}
                  <button
                    type="button"
                    className="toggle-features-btn"
                    onClick={() => toggleExpand(prod.id)}
                  >
                    <span>{isExpanded ? 'Show Less Details' : 'View Full Technical Features'}</span>
                    {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>
                </div>

                {/* Primary CTA */}
                <button
                  type="button"
                  className="btn-primary product-cta-btn"
                  onClick={() =>
                    onSelectProduct(
                      `${prod.name} (${billingCycle === 'yearly' && !isPermanentOnly ? 'Yearly' : 'Permanent'}: ₹${currentPrice?.toLocaleString()})`
                    )
                  }
                >
                  <span>Select & Book Software</span>
                  <ArrowRight size={15} />
                </button>
              </InteractiveCard>
            );
          })}
        </div>

        {/* Mobile Dropdown Accordion List (Active only on Phone) */}
        <div className="products-accordion-mobile mobile-only-accordion">
          {productsConfig.map((prod) => {
            const isPermanentOnly = prod.yearlyPrice === null;
            const isOpen = mobileOpenAppId === prod.id;

            const currentPrice = isPermanentOnly
              ? prod.permanentPrice
              : billingCycle === 'yearly'
              ? prod.yearlyPrice
              : prod.permanentPrice;

            const originalPrice = isPermanentOnly
              ? prod.permanentOriginal
              : billingCycle === 'yearly'
              ? prod.yearlyOriginal
              : prod.permanentOriginal;

            const priceSuffix = isPermanentOnly
              ? ' permanent'
              : billingCycle === 'yearly'
              ? '/yr'
              : ' lifetime';

            return (
              <div key={prod.id} className={`prod-accordion-item ${isOpen ? 'open' : ''}`}>
                <button
                  type="button"
                  className="prod-accordion-trigger"
                  onClick={() => toggleMobileAccordion(prod.id)}
                  aria-expanded={isOpen}
                >
                  <div className="prod-trigger-left">
                    <div className="prod-icon-circle">{prod.icon}</div>
                    <div className="prod-trigger-title-wrap">
                      <div className="prod-tag-badge">{prod.tag}</div>
                      <h3 className="prod-trigger-title">{prod.name}</h3>
                    </div>
                  </div>

                  <div className="prod-trigger-right">
                    <div className="prod-trigger-price-badge">
                      <del className="prod-mobile-del">{originalPrice}</del>
                      <strong>₹{currentPrice?.toLocaleString()}</strong>
                      <small>{priceSuffix}</small>
                    </div>
                    <ChevronDown size={18} className={`prod-chevron ${isOpen ? 'rotated' : ''}`} />
                  </div>
                </button>

                {isOpen && (
                  <div className="prod-accordion-panel">
                    <p className="prod-mobile-desc">{prod.desc}</p>

                    {/* Resto-X Ojas AI Addon */}
                    {prod.hasOjasAddon && (
                      <div className="ojas-addon-box mobile-addon-box">
                        <label className="ojas-toggle-label">
                          <input
                            type="checkbox"
                            checked={restoWithOjas}
                            onChange={(e) => setRestoWithOjas(e.target.checked)}
                          />
                          <div className="ojas-toggle-text">
                            <span className="toggle-title">
                              <Plus size={13} className="text-royal inline-icon" /> Integrate Ojas AI Bot
                            </span>
                            <span className="toggle-sub">
                              {billingCycle === 'yearly' ? '+₹999/yr' : '+₹2,500 Permanent'}
                            </span>
                          </div>
                        </label>
                      </div>
                    )}

                    {/* All Features */}
                    <div className="prod-mobile-features-label">Included Features:</div>
                    <ul className="prod-mobile-features-list">
                      {prod.initialFeatures.concat(prod.deepFeatures).map((feat, idx) => (
                        <li key={idx}>
                          <Check size={14} className="text-royal flex-shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Booking CTA Button */}
                    <button
                      type="button"
                      className="btn-primary w-full prod-mobile-book-btn"
                      onClick={() =>
                        onSelectProduct(
                          `${prod.name} (${billingCycle === 'yearly' && !isPermanentOnly ? 'Yearly' : 'Permanent'}: ₹${currentPrice?.toLocaleString()})`
                        )
                      }
                    >
                      <span>Book {prod.name}</span>
                      <ArrowRight size={15} />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
