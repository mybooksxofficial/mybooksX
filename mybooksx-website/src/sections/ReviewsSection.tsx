import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { Star, CheckCircle, Quote, ShieldCheck, Clock } from 'lucide-react';
import { InteractiveCard } from '../components/InteractiveCard';
import './ReviewsSection.css';

export const ReviewsSection: React.FC = () => {
  const { language } = useLanguage();

  const reviews = [
    {
      name: 'Pankaj Patidar',
      role: language === 'hi' ? 'रिटेल बिज़नेस ओनर' : 'Retail Business Owner',
      rating: 5,
      deliveryTime: language === 'hi' ? '3 हफ़्तों में डिलीवर' : 'Delivered in 3 Weeks',
      text: language === 'hi'
        ? 'सॉफ़्टवेयर काफ़ी बढ़िया है और सिर्फ़ 3 हफ़्ते में पूरी तरह कस्टमाइज़ होकर मिल गया! हमारे बिज़नेस के हिसाब से पूरा इन्वेंटरी और बिलिंग सिस्टम स्मूद सेट हो गया।'
        : 'The software application is outstanding and was delivered fully customized in just 3 weeks! Our complete billing and inventory management was tailored exactly to our business workflow.',
      supportNote: language === 'hi' ? '24/7 प्राथमिकता सहायता शामिल' : '24/7 Priority Support Included',
      tag: language === 'hi' ? 'कस्टम बिज़नेस ऐप्लिकेशन' : 'Custom Business Application'
    },
    {
      name: 'Nayan Panchal',
      role: language === 'hi' ? 'मैन्युफैक्चरिंग व ऑपरेशन्स हेड' : 'Manufacturing & Operations Lead',
      rating: 5,
      deliveryTime: language === 'hi' ? '24/7 लाइव सपोर्ट' : '24/7 Live Support',
      text: language === 'hi'
        ? 'हमने अपनी फील्ड टीम के लिए कस्टम मोबाइल ऐप्लिकेशन तैयार करवाया। 3 हफ़्तों में लाइव डिप्लॉय हो गया और बिना किसी रुकावट के चल रहा है। 24/7 सपोर्ट बेहद तेज़ और विश्वसनीय है!'
        : 'We commissioned a custom mobile application for our field operational team. It was built and launched live in 3 weeks. Their 24/7 technical assistance and response time are truly phenomenal!',
      supportNote: language === 'hi' ? 'त्वरित WhatsApp सहायता' : 'Instant WhatsApp Assistance',
      tag: language === 'hi' ? 'कस्टम मोबाइल ऐप्लिकेशन' : 'Custom Mobile Application'
    },
    {
      name: 'Harshit Choudhary',
      role: language === 'hi' ? 'स्टार्टअप फ़ाउंडर' : 'Startup Founder & Operations Head',
      rating: 5,
      deliveryTime: language === 'hi' ? '3 हफ़्तों में रैपिड लॉन्च' : 'Rapid 3-Week Launch',
      text: language === 'hi'
        ? 'बेस्पोक वेब प्लेटफ़ॉर्म और क्लाइंट पोर्टल दोनों बनवाए। कोड क्वालिटी बेहद साफ़ है और बिना किसी रेडीमेड टेम्पलेट के हमारी ज़रूरत के अनुसार तैयार किया गया।'
        : 'Engineered both our bespoke web platform and enterprise client portal with them. The architecture is ultra-clean, highly responsive, and built without generic templates.',
      supportNote: language === 'hi' ? 'सीधा लीड आर्किटेक्ट एक्सेस' : 'Direct Lead Architect Access',
      tag: language === 'hi' ? 'कस्टम वेब व ERP सुइट' : 'Custom Web & ERP Suite'
    }
  ];

  return (
    <section className="reviews-section" id="reviews">
      <div className="container">
        <div className="section-header">
          <span className="badge-royal">
            <Quote size={13} />
            {language === 'hi' ? 'सत्यापित ग्राहक समीक्षाएँ' : 'CLIENT VERIFIED REVIEWS'}
          </span>
          <h2>
            {language === 'hi'
              ? 'बिज़नेस ओनर्स और फ़ाउंडर्स का भरोसा'
              : 'Trusted By Business Owners & Founders'}
          </h2>
          <p>
            {language === 'hi'
              ? 'उन बढ़ते भारतीय और अंतरराष्ट्रीय व्यवसायों की वास्तविक प्रतिक्रिया जिन्होंने MyBooksX के साथ अपने कस्टम सॉफ़्टवेयर तैयार करवाए।'
              : 'Real feedback from growing Indian & international businesses who engineered their custom software with MyBooksX.'}
          </p>
        </div>

        {/* 3 Review Cards Grid */}
        <div className="reviews-grid">
          {reviews.map((rev, idx) => (
            <InteractiveCard
              key={idx}
              className="review-card interactive-card"
              maxTilt={5}
              spotlightColor="rgba(255, 170, 0, 0.15)"
            >
              <div className="review-card-top">
                <span className="review-tag">{rev.tag}</span>
                <div className="stars-row">
                  {[...Array(rev.rating)].map((_, sIdx) => (
                    <Star key={sIdx} size={16} fill="#F59E0B" color="#F59E0B" />
                  ))}
                </div>
              </div>

              <p className="review-quote">"{rev.text}"</p>

              <div className="review-footer">
                <div className="author-details">
                  <div className="author-avatar-initial">
                    {rev.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="author-name">{rev.name}</h4>
                    <span className="author-role">{rev.role}</span>
                  </div>
                </div>

                <div className="review-meta-pills">
                  <span className="delivery-pill">
                    <Clock size={12} className="inline-icon" /> {rev.deliveryTime}
                  </span>
                  <span className="support-pill">
                    <CheckCircle size={12} className="inline-icon text-royal" /> {rev.supportNote}
                  </span>
                </div>
              </div>
            </InteractiveCard>
          ))}
        </div>

        {/* 24/7 Support Banner */}
        <div className="support-highlight-strip">
          <div className="support-icon-circle">
            <ShieldCheck size={28} className="text-royal" />
          </div>
          <div className="support-strip-text">
            <h4>
              {language === 'hi'
                ? '24/7 समर्पित तकनीकी सहायता व त्वरित 3 हफ़्ते डिलीवरी'
                : '24/7 Dedicated Support & Fast 3-Week Turnaround'}
            </h4>
            <p>
              {language === 'hi'
                ? 'बिना किसी कॉल सेंटर देरी के हमारी इंजीनियरिंग लीडरशिप से सीधी बातचीत। 99.9% अपटाइम के साथ आपका सिस्टम हमेशा सुचारू चलता है।'
                : 'Direct contact with our engineering leadership without call center delays. We keep your systems operating smoothly with 99.9% uptime.'}
            </p>
          </div>
          <a href="tel:+919644570828" className="btn-accent nowrap">
            {language === 'hi' ? 'सीधी हेल्पलाइन: +91 9644570828' : 'Direct Helpline: +91 9644570828'}
          </a>
        </div>
      </div>
    </section>
  );
};
