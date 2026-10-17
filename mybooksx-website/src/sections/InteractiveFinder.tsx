import React, { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { Sparkles, Clock, CheckCircle2, ArrowRight } from 'lucide-react';
import './InteractiveFinder.css';

interface InteractiveFinderProps {
  onSelectSolution: (solutionName: string) => void;
}

export const InteractiveFinder: React.FC<InteractiveFinderProps> = ({ onSelectSolution }) => {
  const { t } = useLanguage();
  const [selectedTab, setSelectedTab] = useState('resto');

  const defaultKey = t.interactiveFinder.tabs[0]?.id || 'resto';
  const activeRec = t.interactiveFinder.recs[selectedTab] || t.interactiveFinder.recs[defaultKey];

  return (
    <section className="interactive-finder-section" id="interactive-finder">
      <div className="container">
        <div className="section-header">
          <span className="badge-royal">
            <Sparkles size={13} />
            {t.interactiveFinder.badge}
          </span>
          <h2>{t.interactiveFinder.title}</h2>
          <p>{t.interactiveFinder.subtitle}</p>
        </div>

        {/* Tab Buttons */}
        <div className="finder-tabs-row">
          {t.interactiveFinder.tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`finder-tab-btn ${selectedTab === tab.id ? 'active' : ''}`}
              onClick={() => setSelectedTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Blueprint Result Card */}
        <div className="blueprint-card card-elegant">
          <div className="blueprint-top">
            <div>
              <span className="blueprint-badge">RECOMMENDED ARCHITECTURE BLUEPRINT</span>
              <h3 className="blueprint-title">{activeRec.title}</h3>
            </div>
            <div className="timeline-badge">
              <Clock size={16} />
              <span>{activeRec.timeline}</span>
            </div>
          </div>

          <p className="blueprint-desc">{activeRec.description}</p>

          <div className="blueprint-details-grid">
            <div className="detail-box">
              <span className="box-label">OPTIMAL FIT FOR:</span>
              <p>{activeRec.bestFor}</p>
            </div>

            <div className="detail-box">
              <span className="box-label">ENGINEERED DELIVERABLES:</span>
              <ul className="deliverables-list">
                {activeRec.deliverables.map((item, idx) => (
                  <li key={idx}>
                    <CheckCircle2 size={16} className="text-royal" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="blueprint-footer">
            <a
              href="#custom-solution"
              onClick={() => onSelectSolution(activeRec.title)}
              className="btn-primary"
            >
              <span>Build This Custom Solution</span>
              <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
