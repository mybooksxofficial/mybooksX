import React, { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { HelpCircle, ChevronDown, MessageCircleQuestion } from 'lucide-react';
import './FaqSection.css';

export const FaqSection: React.FC = () => {
  const { t } = useLanguage();
  // Master dropdown state: collapsed by default so page stays compact
  const [isAllFaqVisible, setIsAllFaqVisible] = useState<boolean>(false);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleSingle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  const toggleMaster = () => {
    setIsAllFaqVisible((prev) => !prev);
  };

  return (
    <section className="faq-section" id="faq">
      <div className="container">
        <div className="section-header">
          <span className="badge-royal">
            <HelpCircle size={13} />
            {t.faq.badge}
          </span>
          <h2>{t.faq.title}</h2>
          <p>{t.faq.subtitle}</p>
        </div>

        {/* Master FAQ Dropdown Trigger Button */}
        <div className="faq-master-control-wrap">
          <button
            type="button"
            className={`faq-master-trigger-card ${isAllFaqVisible ? 'active' : ''}`}
            onClick={toggleMaster}
            aria-expanded={isAllFaqVisible}
          >
            <div className="faq-master-icon-pill">
              <MessageCircleQuestion size={24} className="text-royal" />
            </div>
            <div className="faq-master-text-group">
              <span className="faq-master-title">
                {isAllFaqVisible ? 'Hide Frequently Asked Questions' : 'Frequently Asked Questions (Click to Expand)'}
              </span>
              <span className="faq-master-subtext">
                {isAllFaqVisible ? 'Click to collapse and save page space' : `Tap here to view all ${t.faq.items.length} questions & answers`}
              </span>
            </div>
            <div className="faq-master-chevron-wrap">
              <span className="faq-items-count-badge">{t.faq.items.length} Questions</span>
              <ChevronDown size={22} className={`faq-master-chevron ${isAllFaqVisible ? 'rotated' : ''}`} />
            </div>
          </button>
        </div>

        {/* All FAQ items revealed when master dropdown is clicked */}
        {isAllFaqVisible && (
          <div className="faq-accordion-wrap animate-fade-in">
            {t.faq.items.map((item, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div key={idx} className={`faq-item ${isOpen ? 'open' : ''}`}>
                  <button
                    type="button"
                    className="faq-question-btn"
                    onClick={() => toggleSingle(idx)}
                    aria-expanded={isOpen}
                  >
                    <span className="faq-question-text">{item.q}</span>
                    <ChevronDown
                      size={20}
                      className={`faq-arrow-icon ${isOpen ? 'rotated' : ''}`}
                    />
                  </button>
                  {isOpen && (
                    <div className="faq-answer-panel">
                      <p>{item.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

