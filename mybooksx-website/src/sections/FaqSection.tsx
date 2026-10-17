import React, { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { HelpCircle, ChevronDown } from 'lucide-react';
import './FaqSection.css';

export const FaqSection: React.FC = () => {
  const { t } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
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

        <div className="faq-accordion-wrap">
          {t.faq.items.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={idx} className={`faq-item ${isOpen ? 'open' : ''}`}>
                <button
                  type="button"
                  className="faq-question-btn"
                  onClick={() => toggle(idx)}
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
      </div>
    </section>
  );
};
