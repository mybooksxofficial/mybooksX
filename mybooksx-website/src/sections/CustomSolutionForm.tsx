import React, { useState, useEffect } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { Building2, PhoneCall, Mail, MessageSquare, Zap, Receipt, RefreshCw, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { formStateService } from '../services/formStateService';
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
  const [showInvoice, setShowInvoice] = useState(false);
  const [invoiceData, setInvoiceData] = useState<{
    invoiceNumber: string;
    date: string;
    basePrice: number;
    discountPercent: number;
    discountAmount: number;
    finalTotal: number;
    serviceName: string;
    clientName: string;
    clientPhone: string;
    clientEmail: string;
    businessType: string;
  } | null>(null);

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

  // Parse estimated base price from service string
  const calculatePricing = () => {
    let base = 24999;
    const s = formData.service.toLowerCase();

    if (s.includes('android app') || s.includes('29,999') || s.includes('29999')) base = 29999;
    else if (s.includes('resto-x') && s.includes('permanent')) base = 24999;
    else if (s.includes('resto-x') && s.includes('5,999')) base = 5999;
    else if (s.includes('resto-x') && s.includes('4,999')) base = 4999;
    else if (s.includes('event-x') || s.includes('wedding')) base = 2999;
    else if (s.includes('ojas ai') && s.includes('permanent')) base = 1999;
    else if (s.includes('ojas ai')) base = 999;
    else if (s.includes('fitness-x') && s.includes('permanent')) base = 2999;
    else if (s.includes('fitness-x')) base = 999;
    else if (s.includes('social media') && s.includes('35,000')) base = 35000;
    else if (s.includes('social media') && s.includes('22,000')) base = 22000;
    else if (s.includes('social media')) base = 12000;
    else if (s.includes('email') && s.includes('25,000')) base = 25000;
    else if (s.includes('email') && s.includes('15,000')) base = 15000;
    else if (s.includes('email')) base = 8000;
    else if (s.includes('website') || s.includes('24,999')) base = 24999;

    let discPercent = 0;
    if (activeDiscount.includes('%')) {
      discPercent = parseFloat(activeDiscount.replace('%', '')) || 0;
    } else if (activeDiscount.includes('1000')) {
      discPercent = (1000 / base) * 100;
    }

    const discountAmount = Math.round((base * discPercent) / 100);
    const finalTotal = Math.max(0, base - discountAmount);

    return { base, discPercent, discountAmount, finalTotal };
  };

  const handleGenerateInvoice = async (channel: 'whatsapp' | 'email') => {
    // Client-side and server-side validation
    const validation = formStateService.validate();
    if (!validation.isValid) {
      setValidationErrors(validation.errors as Record<string, string>);
      return;
    }
    setValidationErrors({});
    setIsSubmitting(true);

    // Call real backend endpoint to persist enquiry record
    try {
      await formStateService.submitToBackend();
    } catch (e) {
      console.warn('Backend enquiry dispatch notice:', e);
    }

    const { base, discPercent, discountAmount, finalTotal } = calculatePricing();
    const invNum = `MBX-INV-${Math.floor(100000 + Math.random() * 900000)}`;
    const today = new Date().toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });

    const calculatedInvoice = {
      invoiceNumber: invNum,
      date: today,
      basePrice: base,
      discountPercent: discPercent,
      discountAmount,
      finalTotal,
      serviceName: formData.service,
      clientName: formData.name,
      clientPhone: formData.phone,
      clientEmail: formData.email,
      businessType: formData.businessType
    };

    setInvoiceData(calculatedInvoice);

    setTimeout(() => {
      setIsSubmitting(false);
      setShowInvoice(true);

      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.5 }
        });
      } catch (err) {
        // Fallback
      }

      if (channel === 'whatsapp') {
        const message = encodeURIComponent(
          `*Official Project Invoice Estimate*\n` +
          `*Invoice No:* ${invNum}\n` +
          `*Client:* ${formData.name} (${formData.businessType})\n` +
          `*Phone:* ${formData.phone}\n` +
          `*Email:* ${formData.email}\n` +
          `*Service / Suite:* ${formData.service}\n` +
          `*Base Fee:* ₹${base.toLocaleString()}\n` +
          (discountAmount > 0 ? `*Promo Voucher Applied:* ${promoCodeInput} (-₹${discountAmount.toLocaleString()})\n` : '') +
          `*Final Payable Amount:* ₹${finalTotal.toLocaleString()}\n\n` +
          `*Workflow Notes:* ${formData.details || 'None'}\n\n` +
          `Please confirm this official order quotation.`
        );
        window.open(`https://wa.me/919644570828?text=${message}`, '_blank');
      } else {
        const subject = encodeURIComponent(`Invoice Estimate ${invNum}: ${formData.name}`);
        const body = encodeURIComponent(
          `MyBooksX Official Project Invoice Estimate\n\n` +
          `Invoice No: ${invNum}\n` +
          `Date: ${today}\n` +
          `Client: ${formData.name}\n` +
          `Business: ${formData.businessType}\n` +
          `Phone: ${formData.phone}\n` +
          `Email: ${formData.email}\n\n` +
          `Service: ${formData.service}\n` +
          `Base Rate: ₹${base.toLocaleString()}\n` +
          `Discount Code: ${promoCodeInput} (-₹${discountAmount.toLocaleString()})\n` +
          `Final Total: ₹${finalTotal.toLocaleString()}\n\n` +
          `Notes: ${formData.details}\n`
        );
        window.open(`mailto:mybooksxofficial@gmail.com?subject=${subject}&body=${body}`, '_blank');
      }
    }, 600);
  };

  return (
    <section className="custom-solution-section" id="custom-solution">
      <div className="container">
        <div className="section-header">
          <span className="badge-royal">
            <Building2 size={13} />
            {t.customSolution.badge}
          </span>
          <h2>{t.customSolution.title}</h2>
          <p>{t.customSolution.subtitle}</p>
        </div>

        <div className={`solution-form-card ${isHighlighted ? 'ojas-highlight-pulse' : ''}`}>
          {/* Direct channels banner */}
          <div className="direct-reach-banner">
            <div className="direct-item">
              <PhoneCall size={20} className="text-royal" />
              <div>
                <small>DIRECT CALL / WHATSAPP</small>
                <strong>+91 9644570828</strong>
              </div>
            </div>
            <div className="direct-item">
              <Mail size={20} className="text-royal" />
              <div>
                <small>OFFICIAL EXECUTIVE EMAIL</small>
                <strong>mybooksxofficial@gmail.com</strong>
              </div>
            </div>
          </div>

          {Boolean(formData.name || formData.phone || formData.email) && (
            <div className="ojas-agent-sync-badge">
              <CheckCircle2 size={14} className="text-royal" />
              <span>Live Synchronized with Ojas AI Assistant</span>
            </div>
          )}

          {showInvoice && invoiceData ? (
            /* FINAL INVOICE PAGE */
            <div className="invoice-page-view">
              <div className="invoice-header-row">
                <div className="invoice-brand">
                  <div className="circular-logo-container">
                    <img src="/logo/mybooksx-logo.png" alt="MyBooksX" className="circular-logo-img" />
                  </div>
                  <div>
                    <h3>MyBooksX Software Studio</h3>
                    <small>Official Quotation & Order Estimate</small>
                  </div>
                </div>
                <div className="invoice-meta-right">
                  <span className="invoice-number-pill">{invoiceData.invoiceNumber}</span>
                  <span className="invoice-date-text">Date: {invoiceData.date}</span>
                </div>
              </div>

              <div className="invoice-bill-to-grid">
                <div className="bill-to-box">
                  <span className="box-title">BILLED TO:</span>
                  <strong>{invoiceData.clientName}</strong>
                  <p>{invoiceData.businessType}</p>
                  <p>{invoiceData.clientPhone} • {invoiceData.clientEmail}</p>
                </div>
                <div className="bill-to-box">
                  <span className="box-title">ENGINEERING PARTNER:</span>
                  <strong>MyBooksX Digital Development</strong>
                  <p>Hotline: +91 9644570828</p>
                  <p>Email: mybooksxofficial@gmail.com</p>
                </div>
              </div>

              {/* Invoice Line Items Table */}
              <div className="invoice-table-container">
                <table className="invoice-table">
                  <thead>
                    <tr>
                      <th>Selected Service / Software</th>
                      <th>License Type</th>
                      <th>Standard Price</th>
                      <th>Applied Discount</th>
                      <th>Payable Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <strong>{invoiceData.serviceName}</strong>
                        <p className="item-subdesc">Custom tailored architecture & complete source code.</p>
                      </td>
                      <td>Direct License</td>
                      <td>₹{invoiceData.basePrice.toLocaleString()}</td>
                      <td className="text-success">
                        {invoiceData.discountAmount > 0
                          ? `-₹${invoiceData.discountAmount.toLocaleString()} (${promoCodeInput})`
                          : '₹0'}
                      </td>
                      <td className="final-cell">₹{invoiceData.finalTotal.toLocaleString()}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="invoice-total-summary">
                <div className="summary-row">
                  <span>Subtotal:</span>
                  <strong>₹{invoiceData.basePrice.toLocaleString()}</strong>
                </div>
                {invoiceData.discountAmount > 0 && (
                  <div className="summary-row discount-row">
                    <span>Voucher Deduction ({promoCodeInput}):</span>
                    <strong>-₹{invoiceData.discountAmount.toLocaleString()}</strong>
                  </div>
                )}
                <div className="summary-row grand-total-row">
                  <span>Total Payable:</span>
                  <span className="grand-price">₹{invoiceData.finalTotal.toLocaleString()}</span>
                </div>
              </div>

              <div className="invoice-actions-footer">
                <a
                  href={`https://wa.me/919644570828?text=Hello%20MyBooksX%20Team!%20I%20have%20reviewed%20Invoice%20${invoiceData.invoiceNumber}%20for%20₹${invoiceData.finalTotal}.%20Please%20proceed%20with%20my%20order.`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-primary"
                >
                  <MessageSquare size={16} />
                  <span>Confirm Order via WhatsApp (+91 9644570828)</span>
                </a>
                <button
                  type="button"
                  onClick={() => setShowInvoice(false)}
                  className="btn-secondary"
                >
                  <RefreshCw size={15} />
                  <span>Modify Inquiry Details</span>
                </button>
              </div>
            </div>
          ) : (
            <form className="project-inquiry-form">
              <div className="form-grid">
                {/* Business Type */}
                <div className="form-field full-width">
                  <label htmlFor="businessType">{t.customSolution.businessTypeLabel} *</label>
                  <input
                    type="text"
                    id="businessType"
                    name="businessType"
                    required
                    placeholder={t.customSolution.businessTypePlaceholder}
                    value={formData.businessType}
                    onChange={handleChange}
                  />
                </div>

                {/* Name */}
                <div className="form-field">
                  <label htmlFor="name">{t.customSolution.nameLabel} *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    placeholder="e.g., Rajesh Sharma"
                    value={formData.name}
                    onChange={handleChange}
                  />
                  {validationErrors.name && <span className="form-field-error-msg">{validationErrors.name}</span>}
                </div>

                {/* Phone */}
                <div className="form-field">
                  <label htmlFor="phone">{t.customSolution.phoneLabel} *</label>
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

                {/* Email */}
                <div className="form-field">
                  <label htmlFor="email">{t.customSolution.emailLabel} *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    placeholder="name@business.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  {validationErrors.email && <span className="form-field-error-msg">{validationErrors.email}</span>}
                </div>

                {/* Service Selection - Auto populated from settled card */}
                <div className="form-field">
                  <label htmlFor="service">{t.customSolution.serviceNeededLabel} *</label>
                  <select
                    id="service"
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                  >
                    {/* If selected item is a custom string passed from cards, render it at top */}
                    {formData.service && ![
                      "Customized Website Development (Offer ₹24,999)",
                      "Customized Android App Development (Offer ₹29,999)",
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
                      "Social Media Management - Premium (₹35,000/mo)",
                      "Email Marketing & Campaigns - Starter (₹8,000/mo)",
                      "Email Marketing & Campaigns - Growth (₹15,000/mo)",
                      "Email Marketing & Campaigns - Premium (₹25,000/mo)"
                    ].includes(formData.service) && (
                      <option value={formData.service}>
                        {formData.service}
                      </option>
                    )}
                    <option value="Customized Website Development (Offer ₹24,999)">
                      Customized Website Development (Offer ₹24,999)
                    </option>
                    <option value="Customized Android App Development (Offer ₹29,999)">
                      Customized Android App Development (Offer ₹29,999)
                    </option>
                    <option value="Resto-X (Yearly: ₹4,999)">
                      Resto-X Restaurant POS (Yearly: ₹4,999)
                    </option>
                    <option value="Resto-X (Permanent: ₹24,999)">
                      Resto-X Restaurant POS (Permanent: ₹24,999)
                    </option>
                    <option value="Resto-X + Ojas AI (Yearly: ₹5,999)">
                      Resto-X + Ojas AI Suite (Yearly: ₹5,999)
                    </option>
                    <option value="Resto-X + Ojas AI (Permanent: ₹27,499)">
                      Resto-X + Ojas AI Suite (Permanent: ₹27,499)
                    </option>
                    <option value="Ojas AI (Yearly: ₹999)">
                      Ojas AI Intelligent Bot (Yearly: ₹999)
                    </option>
                    <option value="Ojas AI (Permanent: ₹1,999)">
                      Ojas AI Intelligent Bot (Permanent: ₹1,999)
                    </option>
                    <option value="Event-X (Permanent: ₹2,999)">
                      Event-X Wedding Suite (Permanent: ₹2,999)
                    </option>
                    <option value="Fitness-X (Yearly: ₹999)">
                      Fitness-X Gym Manager (Yearly: ₹999)
                    </option>
                    <option value="Fitness-X (Permanent: ₹2,999)">
                      Fitness-X Gym Manager (Permanent: ₹2,999)
                    </option>
                    <option value="Social Media Management - Starter (₹12,000/mo)">
                      Social Media Management - Starter (₹12,000/mo)
                    </option>
                    <option value="Social Media Management - Growth (₹22,000/mo)">
                      Social Media Management - Growth (₹22,000/mo)
                    </option>
                    <option value="Social Media Management - Premium (₹35,000/mo)">
                      Social Media Management - Premium (₹35,000/mo)
                    </option>
                    <option value="Email Marketing & Campaigns - Starter (₹8,000/mo)">
                      Email Marketing & Campaigns - Starter (₹8,000/mo)
                    </option>
                    <option value="Email Marketing & Campaigns - Growth (₹15,000/mo)">
                      Email Marketing & Campaigns - Growth (₹15,000/mo)
                    </option>
                    <option value="Email Marketing & Campaigns - Premium (₹25,000/mo)">
                      Email Marketing & Campaigns - Premium (₹25,000/mo)
                    </option>
                  </select>
                </div>

                {/* Promo Voucher Code (No budget option, as requested) */}
                <div className="form-field full-width">
                  <label htmlFor="promoCode">
                    Discount Promo Code {activeDiscount && <span className="active-tag">Applied Voucher: {activeDiscount} OFF</span>}
                  </label>
                  <input
                    type="text"
                    id="promoCode"
                    placeholder="Enter Coupon or Promo Code (e.g. from Quiz / Spin Wheel)"
                    value={promoCodeInput}
                    onChange={(e) => setPromoCodeInput(e.target.value)}
                  />
                  {activeDiscount && (
                    <small className="promo-applied-helper">
                      ✓ Special voucher <strong>{activeDiscount}</strong> active & deducted automatically!
                    </small>
                  )}
                </div>

                {/* Details */}
                <div className="form-field full-width">
                  <label htmlFor="details">{t.customSolution.detailsLabel}</label>
                  <textarea
                    id="details"
                    name="details"
                    rows={4}
                    placeholder={t.customSolution.detailsPlaceholder}
                    value={formData.details}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* DUAL ACTION BUTTONS TRANSITIONING TO FINAL INVOICE PAGE */}
              <div className="dual-submit-buttons-container">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => handleGenerateInvoice('whatsapp')}
                  className="btn-primary submit-whatsapp-btn"
                >
                  <Receipt size={18} />
                  <span>{isSubmitting ? 'Generating Invoice...' : 'Generate Invoice & Send via WhatsApp'}</span>
                </button>

                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => handleGenerateInvoice('email')}
                  className="btn-accent submit-email-btn"
                >
                  <Mail size={18} />
                  <span>{isSubmitting ? 'Generating Invoice...' : 'Generate Invoice & Send via Email'}</span>
                </button>
              </div>

              <p className="instant-notice">
                <Zap size={14} className="text-royal inline-icon" /> Submitting instantly generates your formal invoice estimate and alerts +91 9644570828 / mybooksxofficial@gmail.com
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
