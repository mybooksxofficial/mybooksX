import React, { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import {
  TrendingUp,
  Share2,
  Mail,
  Check,
  ArrowRight,
  Sparkles,
  Layers,
  X,
  Clock,
  ShieldCheck,
  ChevronRight,
  ChevronDown
} from 'lucide-react';
import { DIGITAL_GROWTH_SERVICES } from '../data/growthServicesData';
import type { GrowthService, GrowthPlan } from '../data/growthServicesData';
import './DigitalGrowthSection.css';

interface DigitalGrowthSectionProps {
  onSelectService: (serviceName: string) => void;
}

export const DigitalGrowthSection: React.FC<DigitalGrowthSectionProps> = ({ onSelectService }) => {
  const { language } = useLanguage();
  const [selectedServiceForModal, setSelectedServiceForModal] = useState<GrowthService | null>(null);
  const [openPreviewId, setOpenPreviewId] = useState<string | null>(null);

  const togglePreview = (id: string) => {
    setOpenPreviewId((prev) => (prev === id ? null : id));
  };

  const handleOpenModal = (svc: GrowthService) => {
    setSelectedServiceForModal(svc);
  };

  const handleCloseModal = () => {
    setSelectedServiceForModal(null);
  };

  const handleChoosePlan = (svcTitle: string, plan: GrowthPlan) => {
    const formattedSelection = `${svcTitle} - ${plan.name} (${plan.price})`;
    onSelectService(formattedSelection);
    handleCloseModal();
    const formElement = document.getElementById('custom-solution');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="digital-growth-section" id="digital-growth">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <span className="badge-royal">
            <TrendingUp size={13} />
            {language === 'hi' ? 'डिजिटल ग्रोथ सर्विसेज' : 'DIGITAL GROWTH SERVICES'}
          </span>
          <h2>
            {language === 'hi'
              ? 'सिर्फ़ सॉफ़्टवेयर ही नहीं। हम आपके बिज़नेस को आगे बढ़ाते हैं।'
              : 'More Than Software. We Help Your Business Grow.'}
          </h2>
          <p>
            {language === 'hi'
              ? 'सोशल मीडिया उपस्थिति से लेकर प्रभावी ईमेल अभियानों तक, MyBooksX आपके ग्राहकों से संबंध मज़बूत करने और डिजिटल पहचान स्थापित करने में मदद करता है।'
              : 'From managing your social media presence to building effective email campaigns, MyBooksX helps businesses strengthen customer relationships and maintain a consistent digital presence.'}
          </p>
        </div>

        {/* Beautiful Digital Growth Cards Grid */}
        <div className="growth-cards-wrapper">
          <div className="growth-cards-grid">
          {DIGITAL_GROWTH_SERVICES.map((svc) => {
            const isSocial = svc.id === 'social-media';
            const title = language === 'hi' ? svc.titleHi : svc.title;
            const desc = language === 'hi' ? svc.descriptionHi : svc.description;
            const cat = language === 'hi' ? svc.categoryLabelHi : svc.categoryLabel;
            const startPrice = language === 'hi' ? svc.startingPriceHi : svc.startingPrice;
            const isPreviewOpen = openPreviewId === svc.id;

            return (
              <div key={svc.id} className="growth-card interactive-card">
                <div className="growth-card-header">
                  <div className="growth-icon-pill">
                    {isSocial ? <Share2 size={24} className="text-royal" /> : <Mail size={24} className="text-royal" />}
                  </div>
                  <div>
                    <span className="growth-category-tag">{cat}</span>
                    <h3 className="growth-card-title">{title}</h3>
                  </div>
                </div>

                <p className="growth-card-desc">{desc}</p>

                {/* Collapsible Interactive Preview Mockup */}
                <div className="growth-preview-collapsible">
                  <button
                    type="button"
                    className={`growth-preview-toggle-btn ${isPreviewOpen ? 'active' : ''}`}
                    onClick={() => togglePreview(svc.id)}
                    aria-expanded={isPreviewOpen}
                  >
                    <span className="toggle-btn-label">
                      {isPreviewOpen
                        ? (language === 'hi' ? 'रणनीति पूर्वावलोकन छुपाएं' : 'Hide Strategy Preview')
                        : (language === 'hi' ? 'रणनीति पूर्वावलोकन देखें' : 'View Sample Strategy Demo')}
                    </span>
                    <ChevronDown size={15} className={`toggle-chevron ${isPreviewOpen ? 'rotated' : ''}`} />
                  </button>

                  {isPreviewOpen && (
                    <div className="growth-preview-mockup animate-fade-in">
                      <div className="mockup-header-bar">
                        <span className="mockup-status-dot" />
                        <span className="mockup-badge-text">{svc.previewDetails.badge}</span>
                      </div>

                      {isSocial ? (
                        /* Social Content Calendar Preview */
                        <div className="social-calendar-preview">
                          <div className="cal-week-row">
                            <div className="cal-cell active">
                              <span className="day-name">MON</span>
                              <span className="post-type-tag">CAROUSEL</span>
                              <span className="post-topic">Product Spotlight</span>
                            </div>
                            <div className="cal-cell">
                              <span className="day-name">WED</span>
                              <span className="post-type-tag story">UPDATE</span>
                              <span className="post-topic">Client Story</span>
                            </div>
                            <div className="cal-cell active">
                              <span className="day-name">FRI</span>
                              <span className="post-type-tag info">POLL</span>
                              <span className="post-topic">Feature Review</span>
                            </div>
                          </div>
                          <div className="preview-metrics-strip">
                            {svc.previewDetails.sampleMetrics.map((m, i) => (
                              <div key={i} className="metric-col">
                                <strong>{m.value}</strong>
                                <span>{m.label}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        /* Email Campaign Mockup Preview */
                        <div className="email-campaign-preview">
                          <div className="email-preview-envelope">
                            <div className="email-row-subject">
                              <span className="subject-prefix">SUB:</span>
                              <span className="subject-line">Special Festive Offer Inside • Complete Suite Upgrade</span>
                            </div>
                            <div className="email-meta-strip">
                              <span className="audience-pill">Audience: Active Clients</span>
                              <span className="template-pill">Bespoke Design</span>
                            </div>
                          </div>
                          <div className="preview-metrics-strip">
                            {svc.previewDetails.sampleMetrics.map((m, i) => (
                              <div key={i} className="metric-col">
                                <strong>{m.value}</strong>
                                <span>{m.label}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <span className="illustrative-disclaimer">{svc.previewDetails.disclaimer}</span>
                    </div>
                  )}
                </div>

                {/* Core Deliverables List */}
                <div className="growth-deliverables-box">
                  <span className="deliverables-heading">
                    <Layers size={14} className="text-royal inline-icon" />
                    {language === 'hi' ? 'मुख्य सेवा बिंदु:' : 'Core Deliverables:'}
                  </span>
                  <ul className="growth-deliverables-list">
                    {svc.plans[1].features.slice(0, 3).map((feat, fIdx) => (
                      <li key={fIdx}>
                        <Check size={15} className="check-icon" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Card Bottom: Starting Price & Primary CTA */}
                <div className="growth-card-footer">
                  <div className="price-tag-wrap">
                    <span className="indicative-label">{language === 'hi' ? 'प्रस्तावित शुल्क' : 'Proposed Plans'}</span>
                    <strong className="growth-price-text">{startPrice}</strong>
                  </div>

                  <button
                    type="button"
                    className="btn-primary growth-cta-btn"
                    onClick={() => handleOpenModal(svc)}
                    aria-label={`Explore plans for ${title}`}
                  >
                    <span>{isSocial ? (language === 'hi' ? 'सोशल मीडिया प्लान देखें' : 'Explore Social Media Plans') : (language === 'hi' ? 'ईमेल मार्केटिंग प्लान देखें' : 'Explore Email Plans')}</span>
                    <ArrowRight size={15} />
                  </button>
                </div>
              </div>
            );
          })}
          </div>
        </div>
      </div>

      {/* Service Details & Pricing Modal */}
      {selectedServiceForModal && (
        <div className="growth-modal-overlay" onClick={handleCloseModal}>
          <div className="growth-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="growth-modal-header">
              <div>
                <span className="badge-royal">
                  <Sparkles size={12} />
                  {selectedServiceForModal.categoryLabel}
                </span>
                <h3>{language === 'hi' ? selectedServiceForModal.titleHi : selectedServiceForModal.title}</h3>
                <p className="modal-subtext">
                  {language === 'hi' ? selectedServiceForModal.descriptionHi : selectedServiceForModal.description}
                </p>
              </div>
              <button
                type="button"
                className="modal-close-circle"
                onClick={handleCloseModal}
                aria-label="Close Modal"
              >
                <X size={20} />
              </button>
            </div>

            {/* Platforms Supported Note */}
            <div className="platforms-supported-callout">
              <span className="callout-label">{language === 'hi' ? 'सपोर्टेड प्लेटफ़ॉर्म्स / टूल्स:' : 'Supported Platforms & Tools:'}</span>
              <strong>{selectedServiceForModal.platformsSupported}</strong>
              <p className="disclaimer-tiny">
                {language === 'hi'
                  ? 'नोट: विज्ञापन बजट (Ad Spend) और तीसरे पक्ष के सॉफ़्टवेयर टूल्स के शुल्क अलग रहते हैं। कोई अवास्तविक फॉलोअर्स या कन्वर्शन की गारंटी नहीं दी जाती।'
                  : 'Notice: Third-party subscription fees and direct advertising budgets are separate. We focus on consistent branding & best deliverability.'}
              </p>
            </div>

            {/* 3 Packages Grid */}
            <div className="packages-comparison-grid">
              {selectedServiceForModal.plans.map((pkg) => (
                <div key={pkg.id} className="package-tier-box">
                  <div className="pkg-top">
                    <h4>{language === 'hi' ? pkg.nameHi : pkg.name}</h4>
                    <span className="pkg-channels">{language === 'hi' ? pkg.platformsOrCampaignsHi : pkg.platformsOrCampaigns}</span>
                    <div className="pkg-price-pill">
                      <strong>{pkg.price}</strong>
                      <small>{language === 'hi' ? pkg.billingHi : pkg.billing}</small>
                    </div>
                  </div>

                  <ul className="pkg-features-list">
                    {(language === 'hi' ? pkg.featuresHi : pkg.features).map((f, i) => (
                      <li key={i}>
                        <Check size={14} className="check-icon" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <p className="pkg-deliverable-note">
                    {language === 'hi' ? pkg.deliverablesNoteHi : pkg.deliverablesNote}
                  </p>

                  <button
                    type="button"
                    className="btn-accent w-full select-plan-btn"
                    onClick={() => handleChoosePlan(selectedServiceForModal.title, pkg)}
                  >
                    <span>{language === 'hi' ? 'यह प्लान चुनें' : 'Choose This Plan'}</span>
                    <ChevronRight size={15} />
                  </button>
                </div>
              ))}
            </div>

            {/* Modal Bottom Note */}
            <div className="modal-footer-clarity">
              <div className="clarity-item">
                <Clock size={15} className="text-royal inline-icon" />
                <span>Onboarding within 3 business days after brief</span>
              </div>
              <div className="clarity-item">
                <ShieldCheck size={15} className="text-royal inline-icon" />
                <span>Dedicated account manager & monthly reports</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
