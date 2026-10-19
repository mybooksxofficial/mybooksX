import React, { useState, useEffect } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { Building2, CheckCircle2, CalendarCheck, PlusCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { formStateService } from '../services/formStateService';
import { bookingService } from '../services/bookingService';
import './CustomSolutionForm.css';

interface CustomSolutionFormProps {
  preselectedService?: string;
  appliedPromo?: { code: string; discount: string } | null;
}

export const CustomSolutionForm: React.FC<CustomSolutionFormProps> = ({
  preselectedService = '',
  appliedPromo = null,
}) => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState(() => formStateService.getData());
  const [isHighlighted, setIsHighlighted] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const [promoCodeInput, setPromoCodeInput] = useState(() => {
    try {
      return appliedPromo?.code || localStorage.getItem('mybooksx_wheel_code') || localStorage.getItem('mybooksx_quiz_code') || '';
    } catch (e) {
      return '';
    }
  });

  const [activeDiscount, setActiveDiscount] = useState<string>(() => {
    try {
      return appliedPromo?.discount || localStorage.getItem('mybooksx_wheel_discount') || localStorage.getItem('mybooksx_quiz_discount') || '';
    } catch (e) {
      return '';
    }
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState<any | null>(null);

  // Synchronize with shared form state (two-way binding with Ojas AI)
  useEffect(() => {
    const unsubscribe = formStateService.subscribe((data) => {
      setFormData(data);
      if (data.promoCode) setPromoCodeInput(data.promoCode);
    });

    const unHighlight = formStateService.onHighlight(() => {
      setIsHighlighted(true);
      setTimeout(() => setIsHighlighted(false), 2400);
    });

    return () => {
      unsubscribe();
      unHighlight();
    };
  }, []);

  // Sync preselectedService immediately when user clicks any card
  useEffect(() => {
    if (preselectedService) {
      formStateService.updateData({ service: preselectedService });
    }
  }, [preselectedService]);

  useEffect(() => {
    if (appliedPromo) {
      setPromoCodeInput(appliedPromo.code);
      setActiveDiscount(appliedPromo.discount);
      formStateService.updateData({ promoCode: appliedPromo.code });
    }
  }, [appliedPromo]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    formStateService.setField(name as any, value);
    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleBookProject = (e: React.FormEvent) => {
    e.preventDefault();

    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = 'Please enter your name.';
    if (!formData.phone.trim() || formData.phone.trim().length < 8) {
      errors.phone = 'Please provide a valid phone or WhatsApp number.';
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setValidationErrors({});
    setIsSubmitting(true);

    try {
      // Create permanent booking in storage (visible in Owner Panel)
      const newBooking = bookingService.createBooking({
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        businessType: formData.businessType.trim() || 'General Business',
        service: formData.service || 'Custom Software Development',
        details: formData.details.trim(),
        promoCode: promoCodeInput.trim()
      });

      // Fire celebratory confetti
      try {
        confetti({
          particleCount: 90,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch (err) {}

      setTimeout(() => {
        setIsSubmitting(false);
        setBookingConfirmed(newBooking);
      }, 350);
    } catch (e) {
      setIsSubmitting(false);
      console.error('Booking creation error:', e);
    }
  };

  return (
    <section className="custom-solution-section" id="custom-solution">
      <div className="container">
        <div className="section-header">
          <span className="badge-royal">
            <Building2 size={13} />
            {t.customSolution.badge}
          </span>
          <h2>Book Your Custom Project</h2>
          <p>
            Tell us about your business vision. Our lead engineering team will analyze your requirements and reach out within 24 hours.
          </p>
        </div>

        <div className={`solution-form-card ${isHighlighted ? 'ojas-highlight-pulse' : ''}`}>
          {Boolean(formData.name || formData.phone) && (
            <div className="ojas-agent-sync-badge">
              <CheckCircle2 size={14} className="text-royal" />
              <span>Live Synchronized with Ojas AI Assistant</span>
            </div>
          )}

          {bookingConfirmed ? (
            /* CLEAN BOOKING CONFIRMATION VIEW (No complex invoice) */
            <div className="booking-success-view">
              <div className="booking-success-icon-wrap">
                <CalendarCheck size={48} className="text-success" />
              </div>

              <h3>Booking Confirmed!</h3>
              <span className="booking-ref-badge">Booking Reference: {bookingConfirmed.id}</span>

              <p className="booking-success-desc">
                Thank you, <strong>{bookingConfirmed.name}</strong>! We have received your booking request for{' '}
                <strong>{bookingConfirmed.service}</strong>. Our senior software lead will get in touch on{' '}
                <strong>{bookingConfirmed.phone}</strong> shortly.
              </p>

              <div className="booking-summary-pill-box">
                <div className="summary-pill-item">
                  <span className="pill-lbl">Client</span>
                  <strong>{bookingConfirmed.name}</strong>
                </div>
                <div className="summary-pill-item">
                  <span className="pill-lbl">Phone / WhatsApp</span>
                  <strong>{bookingConfirmed.phone}</strong>
                </div>
                <div className="summary-pill-item">
                  <span className="pill-lbl">Selected Service</span>
                  <strong>{bookingConfirmed.service}</strong>
                </div>
                {bookingConfirmed.promoCode && (
                  <div className="summary-pill-item">
                    <span className="pill-lbl">Voucher Code</span>
                    <strong>{bookingConfirmed.promoCode}</strong>
                  </div>
                )}
              </div>

              <div className="booking-success-actions">
                <button
                  type="button"
                  onClick={() => {
                    setBookingConfirmed(null);
                    formStateService.updateData({ name: '', phone: '', businessType: '', details: '' });
                  }}
                  className="btn-primary"
                >
                  <PlusCircle size={16} />
                  <span>Done / Book Another Consultation</span>
                </button>
              </div>
            </div>
          ) : (
            /* CLEAN DIRECT BOOKING FORM */
            <form onSubmit={handleBookProject} className="project-inquiry-form">
              <div className="form-grid">
                {/* Name */}
                <div className="form-field">
                  <label htmlFor="name">{t.customSolution.nameLabel} *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    placeholder="e.g. Rajesh Sharma"
                    value={formData.name}
                    onChange={handleChange}
                  />
                  {validationErrors.name && <span className="form-field-error-msg">{validationErrors.name}</span>}
                </div>

                {/* Phone / WhatsApp */}
                <div className="form-field">
                  <label htmlFor="phone">Phone / WhatsApp Number *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    placeholder="+91 9644570828"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                  {validationErrors.phone && <span className="form-field-error-msg">{validationErrors.phone}</span>}
                </div>

                {/* Business Type */}
                <div className="form-field">
                  <label htmlFor="businessType">{t.customSolution.businessTypeLabel}</label>
                  <input
                    type="text"
                    id="businessType"
                    name="businessType"
                    placeholder="e.g. Restaurant, Healthcare, Retail, Startup"
                    value={formData.businessType}
                    onChange={handleChange}
                  />
                </div>

                {/* Service Selection */}
                <div className="form-field">
                  <label htmlFor="service">{t.customSolution.serviceNeededLabel} *</label>
                  <select
                    id="service"
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                  >
                    {formData.service && ![
                      "Customized Website Development - Yearly (₹5,999/yr)",
                      "Customized Website + Ojas AI - Yearly (₹6,999/yr)",
                      "Customized Android App - Yearly (₹6,999/yr)",
                      "Customized Android App + Ojas AI - Yearly (₹7,999/yr)",
                      "Customized Website Development - Lifetime (₹24,999)",
                      "Customized Android App Development - Lifetime (₹29,999)",
                      "Resto-X (Yearly: ₹4,999)",
                      "Resto-X (Permanent: ₹24,999)",
                      "Resto-X + Ojas AI (Yearly: ₹5,999)",
                      "Resto-X + Ojas AI (Permanent: ₹27,499)",
                      "Ojas AI (Yearly: ₹999)",
                      "Ojas AI (Permanent: ₹1,999)",
                      "Event-X (Permanent: ₹2,999)",
                      "Fitness-X (Yearly: ₹999)",
                      "Fitness-X (Permanent: ₹2,999)",
                      "Social Media Management - Starter (₹12,000/mo)",
                      "Social Media Management - Growth (₹22,000/mo)",
                      "Social Media Management - Dominance (₹35,000/mo)",
                      "Email Marketing - Starter (₹8,000/mo)",
                      "Email Marketing - Growth (₹15,000/mo)",
                      "Email Marketing - Premium (₹25,000/mo)",
                    ].includes(formData.service) && (
                      <option value={formData.service}>{formData.service} (Selected)</option>
                    )}

                    <optgroup label="Custom Web & Mobile App Plans">
                      <option value="Customized Website Development - Yearly (₹5,999/yr)">
                        Customized Website Development - Yearly (₹5,999/yr)
                      </option>
                      <option value="Customized Website + Ojas AI - Yearly (₹6,999/yr)">
                        Customized Website + Ojas AI - Yearly (₹6,999/yr)
                      </option>
                      <option value="Customized Android App - Yearly (₹6,999/yr)">
                        Customized Android App - Yearly (₹6,999/yr)
                      </option>
                      <option value="Customized Android App + Ojas AI - Yearly (₹7,999/yr)">
                        Customized Android App + Ojas AI - Yearly (₹7,999/yr)
                      </option>
                      <option value="Customized Website Development - Lifetime (₹24,999)">
                        Customized Website - Lifetime 100% Code (₹24,999)
                      </option>
                      <option value="Customized Android App Development - Lifetime (₹29,999)">
                        Customized Android App - Lifetime 100% Code (₹29,999)
                      </option>
                    </optgroup>

                    <optgroup label="Digital Growth Services">
                      <option value="Social Media Management - Starter (₹12,000/mo)">
                        Social Media Management - Starter (₹12,000/mo)
                      </option>
                      <option value="Social Media Management - Growth (₹22,000/mo)">
                        Social Media Management - Growth (₹22,000/mo)
                      </option>
                      <option value="Email Marketing - Starter (₹8,000/mo)">
                        Email Marketing & Campaigns - Starter (₹8,000/mo)
                      </option>
                    </optgroup>
                  </select>
                </div>

                {/* Promo Voucher Code */}
                <div className="form-field full-width">
                  <label htmlFor="promoCode">
                    Discount Promo Code {activeDiscount && <span className="active-tag">Applied Voucher: {activeDiscount} OFF</span>}
                  </label>
                  <input
                    type="text"
                    id="promoCode"
                    placeholder="Enter Coupon / Spin Wheel Code (Optional)"
                    value={promoCodeInput}
                    onChange={(e) => setPromoCodeInput(e.target.value)}
                  />
                  {activeDiscount && (
                    <small className="promo-applied-helper">
                      ✓ Special voucher <strong>{activeDiscount}</strong> applied to your booking!
                    </small>
                  )}
                </div>

                {/* Details */}
                <div className="form-field full-width">
                  <label htmlFor="details">{t.customSolution.detailsLabel}</label>
                  <textarea
                    id="details"
                    name="details"
                    rows={3}
                    placeholder="Tell us what you'd like us to build or any custom workflow features needed..."
                    value={formData.details}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* SINGLE CLEAR BOOK BUTTON */}
              <div className="booking-submit-action-row">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full book-now-primary-btn"
                >
                  <CalendarCheck size={18} />
                  <span>{isSubmitting ? 'Confirming Booking...' : 'Book Project Now'}</span>
                </button>
              </div>

              <p className="instant-notice">
                ✓ No login required for clients. Your booking is recorded directly into our management schedule.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
