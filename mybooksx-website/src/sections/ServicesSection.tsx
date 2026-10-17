import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { Code2, Globe2, Smartphone, Cpu, HeartHandshake, Layers, ArrowRight } from 'lucide-react';
import './ServicesSection.css';

export const ServicesSection: React.FC = () => {
  const { t } = useLanguage();

  const icons = [
    <Code2 size={26} className="service-icon" />,
    <Globe2 size={26} className="service-icon" />,
    <Smartphone size={26} className="service-icon" />,
    <Cpu size={26} className="service-icon" />,
    <HeartHandshake size={26} className="service-icon" />,
    <Layers size={26} className="service-icon" />,
  ];

  return (
    <section className="services-section" id="services">
      <div className="container">
        <div className="section-header">
          <span className="badge-royal">{t.services.badge}</span>
          <h2>{t.services.title}</h2>
          <p>{t.services.subtitle}</p>
        </div>

        <div className="services-grid">
          {t.services.items.map((svc, i) => (
            <div key={svc.id} className="service-card interactive-card">
              <div className="service-icon-wrap">{icons[i]}</div>
              <h3 className="service-title">{svc.title}</h3>
              <p className="service-desc">{svc.desc}</p>

              <div className="service-features-list">
                {svc.features.map((feat, fIdx) => (
                  <span key={fIdx} className="feature-pill">
                    {feat}
                  </span>
                ))}
              </div>

              <a href="#custom-solution" className="service-link">
                <span>Start Discovery</span>
                <ArrowRight size={14} />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
