import React from 'react';
import { ShieldCheck, Zap, Code2, Headphones, Lock, CheckCircle2 } from 'lucide-react';
import { InteractiveCard } from '../components/InteractiveCard';
import './WhyChooseUsSection.css';

export const WhyChooseUsSection: React.FC = () => {
  const points = [
    {
      icon: <ShieldCheck size={28} className="why-icon text-royal" />,
      title: "100% Code & Data Ownership",
      desc: "No vendor lock-in or recurring hostage pricing. We deliver full production source code, database architectures, and keys directly to your organization."
    },
    {
      icon: <Zap size={28} className="why-icon text-royal" />,
      title: "Rapid 3-Week Custom Delivery",
      desc: "Engineered from scratch to production within 21 days with clean sprints, interactive demos every 5 days, and zero slow agency bureaucracy."
    },
    {
      icon: <Headphones size={28} className="why-icon text-royal" />,
      title: "24/7 Dedicated Indian & Global Support",
      desc: "Direct access to lead software engineers on WhatsApp and call — no endless ticket queues or frustrating call centers."
    },
    {
      icon: <Code2 size={28} className="why-icon text-royal" />,
      title: "Tailored Specifically For Your Workflow",
      desc: "We build exactly what your business operations require — whether billing, inventory sync, WhatsApp invoicing, or bilingual AI automation."
    },
    {
      icon: <Lock size={28} className="why-icon text-royal" />,
      title: "Lightweight High-Speed Mobile App",
      desc: "Optimized native builds with fast loading, offline-first billing & order sync, and zero app crashes even on affordable mobile devices."
    },
    {
      icon: <CheckCircle2 size={28} className="why-icon text-royal" />,
      title: "End-to-End Cloud & App Deployment",
      desc: "Complete end-to-end launch handled by our team, including custom mobile app publishing, custom domain setup, SSL certificates, and cloud provisioning."
    }
  ];

  return (
    <section className="why-choose-us-section" id="why-choose-us">
      <div className="container">
        <div className="section-header">
          <span className="badge-royal">
            <ShieldCheck size={13} />
            ENGINEERING EXCELLENCE
          </span>
          <h2>Why Businesses Choose MyBooksX</h2>
          <p>
            Unlike generic template providers, we engineer mission-critical, custom software ecosystems built for reliability, speed, and real revenue growth.
          </p>
        </div>

        <div className="why-grid">
          {points.map((pt, idx) => (
            <InteractiveCard
              key={idx}
              className="why-card interactive-card"
              maxTilt={5}
              spotlightColor="rgba(10, 88, 202, 0.14)"
            >
              <div className="why-icon-wrap">{pt.icon}</div>
              <h3 className="why-title">{pt.title}</h3>
              <p className="why-desc">{pt.desc}</p>
            </InteractiveCard>
          ))}
        </div>
      </div>
    </section>
  );
};
