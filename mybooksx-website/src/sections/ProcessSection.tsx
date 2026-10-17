import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { GitCommit } from 'lucide-react';
import './ProcessSection.css';

export const ProcessSection: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="process-section" id="process">
      <div className="container">
        <div className="section-header">
          <span className="badge-royal">
            <GitCommit size={13} />
            {t.process.badge}
          </span>
          <h2>{t.process.title}</h2>
          <p>{t.process.subtitle}</p>
        </div>

        <div className="process-timeline">
          {t.process.steps.map((step, idx) => (
            <div key={idx} className="timeline-step-card interactive-card">
              <div className="step-num-pill">{step.num}</div>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-desc">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
