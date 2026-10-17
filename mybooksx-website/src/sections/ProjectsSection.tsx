import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { Layers, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import './ProjectsSection.css';

export const ProjectsSection: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="projects-section" id="projects">
      <div className="container">
        <div className="section-header">
          <span className="badge-royal">
            <Layers size={13} />
            {t.projects.badge}
          </span>
          <h2>{t.projects.title}</h2>
          <p>{t.projects.subtitle}</p>
          <span className="demo-disclaimer-pill">{t.projects.demoNote}</span>
        </div>

        <div className="projects-grid">
          {t.projects.items.map((proj, idx) => (
            <div key={idx} className="project-card interactive-card">
              <div className="project-header">
                <span className="project-tag">{proj.tag}</span>
                <a href="#custom-solution" className="project-arrow-btn" aria-label="View Details">
                  <ArrowUpRight size={18} />
                </a>
              </div>

              <h3 className="project-title">{proj.title}</h3>
              <p className="project-desc">{proj.desc}</p>

              <div className="project-metrics-box">
                <CheckCircle2 size={15} className="text-royal" />
                <span>{proj.metrics}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
