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

  const toggleExpand = (id: string) => {
    setExpandedCards((prev) => ({ ...prev, [id]: !prev[id] }));
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

        {/* Products Grid with Expand/Collapse Feature */}
        <div className="products-grid">
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
                        ? 'Annual license with priority support'
                        : 'One-time payment • Complete source code'}
                    </span>
                  </div>

                  {/* Minimal Expand Arrow Toggle */}
                  <button
                    type="button"
                    className={`expand-card-toggle-arrow-btn ${isExpanded ? 'active' : ''}`}
                    onClick={() => toggleExpand(prod.id)}
                    aria-label={isExpanded ? 'Collapse features' : 'Expand full features'}
                    title={isExpanded ? 'Collapse details' : 'Expand details'}
                  >
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </button>

                  {/* Full Details & Features revealed ONLY on arrow click */}
                  {isExpanded && (
                    <div className="expanded-details-drawer">
                      <p className="product-desc expanded-feature-anim">{prod.desc}</p>
                      <ul className="product-features-list expanded-feature-anim">
                        {prod.initialFeatures.map((feat, fIdx) => (
                          <li key={fIdx}>
                            <Check size={16} className="check-icon" />
                            <span>{feat}</span>
                          </li>
                        ))}
                        {prod.deepFeatures.map((feat, fIdx) => (
                          <li key={`deep-${fIdx}`}>
                            <Check size={16} className="check-icon" />
                            <span>{feat}</span>
                          </li>
                        ))}
                        {prod.hasOjasAddon && restoWithOjas && (
                          <li className="addon-feature-item">
                            <Check size={16} className="check-icon" />
                            <strong>Includes Ojas AI Customer WhatsApp Bot</strong>
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="product-card-footer">
                  <button
                    type="button"
                    onClick={() => {
                      onSelectProduct(`${prod.name} (${billingCycle}: ₹${currentPrice})`);
                      const target = document.getElementById('custom-solution');
                      if (target) target.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className={`w-full ${prod.popular ? 'btn-primary' : 'btn-secondary'} product-cta-btn`}
                  >
                    <span>Select {prod.name} (₹{currentPrice})</span>
                    <ArrowRight size={15} />
                  </button>
                </div>
              </InteractiveCard>
            );
          })}
        </div>
      </div>
    </section>
  );
};
