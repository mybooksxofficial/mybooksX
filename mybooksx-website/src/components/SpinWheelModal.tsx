import React, { useState, useEffect } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { X, Sparkles, Gift, Check, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import './SpinWheelModal.css';

interface SpinWheelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyCode: (code: string, discount: string) => void;
}

export const SpinWheelModal: React.FC<SpinWheelModalProps> = ({ isOpen, onClose, onApplyCode }) => {
  const { t } = useLanguage();
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [hasSpun, setHasSpun] = useState(false);
  const [wonDiscount, setWonDiscount] = useState<string | null>(null);
  const [promoCode, setPromoCode] = useState<string | null>(null);

  // Check localStorage if already spun once
  useEffect(() => {
    try {
      const savedCode = localStorage.getItem('mybooksx_wheel_code');
      const savedDiscount = localStorage.getItem('mybooksx_wheel_discount');
      if (savedCode && savedDiscount) {
        setHasSpun(true);
        setWonDiscount(savedDiscount);
        setPromoCode(savedCode);
      }
    } catch (e) {
      // LocalStorage fallback
    }
  }, []);

  if (!isOpen) return null;

  // 8 Sectors with 45 degrees each:
  // Includes 10% OFF, 5% OFF, 25% OFF, 12% OFF, and 7% OFF
  const sectors = [
    { label: "100% OFF", color: "#FFDBBB", textColor: "#664930" }, // 0
    { label: "10% OFF", color: "#0A58CA", textColor: "#FFFFFF" },  // 1 (Safe win)
    { label: "5% OFF", color: "#CCBEB1", textColor: "#2C1F16" },   // 2 (Safe win)
    { label: "25% OFF", color: "#664930", textColor: "#FFFFFF" },  // 3 (Safe win - paid boost)
    { label: "Ojas FREE", color: "#FFDBBB", textColor: "#664930" }, // 4
    { label: "10% OFF", color: "#0A58CA", textColor: "#FFFFFF" },  // 5 (Safe win)
    { label: "50% OFF", color: "#CCBEB1", textColor: "#2C1F16" },  // 6
    { label: "12% OFF", color: "#664930", textColor: "#FFFFFF" },  // 7 (Safe win)
  ];

  const handleSpin = (paid = false) => {
    if (spinning) return;
    if (hasSpun && !paid) return;
    setSpinning(true);

    // Guaranteed landing picks between: 10%, 5%, 25%, 12%
    const targetPicks = paid
      ? [
          { discount: "25%", code: "MYBOOKS25BOOST", targetIndex: 3 },
          { discount: "10%", code: "MYBOOKS10BOOST", targetIndex: 1 },
          { discount: "12%", code: "MYBOOKS12BOOST", targetIndex: 7 }
        ]
      : [
          { discount: "10%", code: "MYBOOKS10ROYAL", targetIndex: 1 },
          { discount: "5%", code: "MYBOOKS5FESTIVE", targetIndex: 2 },
          { discount: "12%", code: "MYBOOKS12VIP", targetIndex: 7 }
        ];

    const chosen = targetPicks[Math.floor(Math.random() * targetPicks.length)];
    
    // Calculate rotation:
    const sliceAngle = 45;
    const centerOffset = sliceAngle / 2;
    const extraSpins = 6 * 360; // 6 full circles
    const targetSliceDegree = chosen.targetIndex * sliceAngle + centerOffset;
    const finalDegree = extraSpins + (360 - targetSliceDegree) + 270;

    setRotation(finalDegree);

    setTimeout(() => {
      setSpinning(false);
      setHasSpun(true);
      setWonDiscount(chosen.discount);
      setPromoCode(chosen.code);

      try {
        localStorage.setItem('mybooksx_wheel_code', chosen.code);
        localStorage.setItem('mybooksx_wheel_discount', chosen.discount);
      } catch (e) {
        // Fallback
      }

      try {
        confetti({
          particleCount: 120,
          spread: 75,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // Fallback
      }
    }, 4000);
  };

  const handleApply = () => {
    if (promoCode && wonDiscount) {
      onApplyCode(promoCode, wonDiscount);
      onClose();
    }
  };

  const handleSendBillToWhatsApp = () => {
    if (!promoCode || !wonDiscount) return;

    const billMessage = encodeURIComponent(
      `🧾 *MyBooks Official Discount Invoice / Voucher*\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `🎁 *Benefit:* ${wonDiscount} INSTANT DISCOUNT\n` +
      `🏷️ *Promo Coupon Code:* ${promoCode}\n` +
      `📅 *Issued On:* ${new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}\n` +
      `🛡️ *Status:* Verified & Redeemable on All Products\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `_I have spun the lucky wheel and won ${wonDiscount} OFF. Please apply this discount voucher to my software order._`
    );

    window.open(`https://api.whatsapp.com/send/?phone=919644570828&text=${billMessage}`, '_blank');
  };

  return (
    <div className="wheel-modal-overlay" onClick={onClose}>
      <div className="wheel-modal-card" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="wheel-close-btn" onClick={onClose} aria-label="Close modal">
          <X size={20} />
        </button>

        <div className="wheel-header">
          <span className="badge-royal">
            <Sparkles size={14} />
            {t.spinWheel.badge}
          </span>
          <h3>{t.spinWheel.title}</h3>
          <p>{t.spinWheel.subtitle}</p>
        </div>

        {/* Wheel Container */}
        <div className="wheel-interactive-container">
          <div className="wheel-pointer-triangle" />

          <div 
            className="wheel-circle"
            style={{ 
              transform: `rotate(${rotation}deg)`,
              transition: spinning ? 'transform 4s cubic-bezier(0.15, 0.9, 0.2, 1)' : 'none'
            }}
          >
            <svg viewBox="0 0 400 400" className="wheel-svg">
              <defs>
                <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.2"/>
                </filter>
              </defs>
              {sectors.map((sec, i) => {
                const angle = 45;
                const startAngle = i * angle;
                const endAngle = (i + 1) * angle;
                
                const x1 = 200 + 190 * Math.cos((Math.PI * startAngle) / 180);
                const y1 = 200 + 190 * Math.sin((Math.PI * startAngle) / 180);
                const x2 = 200 + 190 * Math.cos((Math.PI * endAngle) / 180);
                const y2 = 200 + 190 * Math.sin((Math.PI * endAngle) / 180);
                
                const pathData = `M 200 200 L ${x1} ${y1} A 190 190 0 0 1 ${x2} ${y2} Z`;
                
                const textAngle = startAngle + angle / 2;
                const tx = 200 + 125 * Math.cos((Math.PI * textAngle) / 180);
                const ty = 200 + 125 * Math.sin((Math.PI * textAngle) / 180);

                return (
                  <g key={i}>
                    <path d={pathData} fill={sec.color} stroke="#FFFFFF" strokeWidth="2.5" />
                    <text
                      x={tx}
                      y={ty}
                      fill={sec.textColor}
                      fontSize="13"
                      fontWeight="800"
                      fontFamily="Space Grotesk, sans-serif"
                      textAnchor="middle"
                      dominantBaseline="central"
                      transform={`rotate(${textAngle + 90}, ${tx}, ${ty})`}
                    >
                      {sec.label}
                    </text>
                  </g>
                );
              })}
              {/* Center Hub with Circular Logo */}
              <circle cx="200" cy="200" r="36" fill="#FFFFFF" stroke="#664930" strokeWidth="3.5" />
              <circle cx="200" cy="200" r="28" fill="#FFDBBB" />
              <text x="200" y="200" textAnchor="middle" dominantBaseline="central" fontSize="10" fontWeight="800" fill="#664930">
                MYBOOKS
              </text>
            </svg>
          </div>
        </div>

        {/* Won Banner or Already Spun Notification */}
        {wonDiscount ? (
          <div className="won-result-box">
            <h4>{t.spinWheel.wonTitle} <span className="highlight-discount">{wonDiscount}</span>!</h4>
            <p>{hasSpun ? t.spinWheel.alreadySpunDesc : t.spinWheel.congrats}</p>
            <div className="promo-code-pill">
              <span>{t.spinWheel.codeLabel}</span>
              <strong>{promoCode}</strong>
            </div>

            <div className="wheel-actions-grid">
              <button type="button" onClick={handleApply} className="btn-primary w-full">
                <Check size={18} />
                <span>{t.spinWheel.applyCta}</span>
              </button>

              <button
                type="button"
                onClick={handleSendBillToWhatsApp}
                className="btn-accent w-full whatsapp-bill-btn"
              >
                <Sparkles size={16} />
                <span>Send Bill & Voucher to WhatsApp</span>
              </button>
            </div>

            <p className="single-spin-note">
              <AlertCircle size={14} className="inline-icon" /> Note: Only 1 lucky spin is allowed per user. This voucher is locked to your session.
            </p>
          </div>
        ) : (
          <div className="wheel-action-section">
            <button
              type="button"
              className="btn-accent spin-action-btn"
              onClick={() => handleSpin(false)}
              disabled={spinning || hasSpun}
            >
              <Gift size={18} />
              <span>{spinning ? t.spinWheel.spinning : t.spinWheel.spinBtn}</span>
            </button>
            <p className="wheel-disclaimer-note">{t.spinWheel.disclaimer}</p>
          </div>
        )}
      </div>
    </div>
  );
};
