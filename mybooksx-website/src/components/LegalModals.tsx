/**
 * Legal Transparency & Compliance Modal
 * Discloses Free-to-Play Program rules, anti-gambling protections, and DPDP Indian Data Protection framework.
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { X, ShieldCheck } from 'lucide-react';
import './LegalModals.css';

export const LegalModals: React.FC = () => {
  const { isLegalModalOpen, closeLegalModal, legalDoc } = useAuth();
  const [activeDoc, setActiveDoc] = useState<'terms' | 'privacy' | 'rewards_policy'>('terms');

  useEffect(() => {
    if (legalDoc) {
      setActiveDoc(legalDoc);
    }
  }, [legalDoc]);

  if (!isLegalModalOpen) return null;

  return (
    <div className="legal-modal-overlay" onClick={closeLegalModal}>
      <div className="legal-modal-card" onClick={e => e.stopPropagation()}>
        <button
          type="button"
          className="arena-close-btn"
          onClick={closeLegalModal}
          aria-label="Close Legal Window"
        >
          <X size={18} />
        </button>

        <div className="mbx-auth-brand-pill">
          <ShieldCheck size={14} className="text-royal" />
          <span>Trust & Compliance Disclosures</span>
        </div>
        <h2 className="mbx-auth-title" style={{ fontSize: '1.4rem' }}>
          MyBooksX Policies & Transparency
        </h2>

        {/* Tabs */}
        <div className="legal-tabs-header">
          <button
            type="button"
            className={`legal-tab-btn ${activeDoc === 'terms' ? 'active' : ''}`}
            onClick={() => setActiveDoc('terms')}
          >
            Terms & Conditions
          </button>
          <button
            type="button"
            className={`legal-tab-btn ${activeDoc === 'privacy' ? 'active' : ''}`}
            onClick={() => setActiveDoc('privacy')}
          >
            Privacy Policy (DPDP Act)
          </button>
          <button
            type="button"
            className={`legal-tab-btn ${activeDoc === 'rewards_policy' ? 'active' : ''}`}
            onClick={() => setActiveDoc('rewards_policy')}
          >
            Rewards Program Rules
          </button>
        </div>

        {/* Content Bodies */}
        {activeDoc === 'terms' && (
          <div className="legal-content-body">
            <div className="legal-alert-box">
              <strong>Strict Free-to-Play Guarantee:</strong> The MyBooksX Quiz Arena is an educational and promotional software engagement experience. No purchase, payment, stake, or wager is required or accepted to participate.
            </div>

            <h3>1. Acceptance of Terms</h3>
            <p>
              By accessing the MyBooksX platform, registering an account, or participating in the daily quiz competitions, you agree to comply with these terms, all applicable Indian state and central laws, and related regulations.
            </p>

            <h3>2. User Eligibility & One-Account Rule</h3>
            <ul>
              <li>Participants must be at least 18 years of age or have legal guardian consent.</li>
              <li>Only one account is permitted per individual. Automated scripts, bots, headless browsers, or multiple fraudulent accounts will result in immediate disqualification and account termination.</li>
              <li>Email verification is mandatory before participating in official competitions or redeeming rewards.</li>
            </ul>

            <h3>3. Prohibition of Gambling & Wagering</h3>
            <p>
              Under no circumstances does MyBooksX offer betting, wagering, real-money gaming, or prize lotteries. Points cannot be purchased with fiat money, cryptocurrencies, or digital assets, and hold no monetary cash equivalency.
            </p>

            <h3>4. Limitation of Liability</h3>
            <p>
              MyBooksX software products are provided on an "as is" and "as available" basis. Access validity for redeemed applications is strictly limited to 30 days unless extended through enterprise contracts.
            </p>
          </div>
        )}

        {activeDoc === 'privacy' && (
          <div className="legal-content-body">
            <div className="legal-alert-box">
              <strong>DPDP Compliance:</strong> Designed in alignment with the Indian Digital Personal Data Protection (DPDP) Act, 2023. We practice strict purpose limitation and data minimization.
            </div>

            <h3>1. What Personal Data We Process</h3>
            <ul>
              <li><strong>Identity Data:</strong> Full name and verified email address for account authorization.</li>
              <li><strong>Technical Metadata:</strong> IP address and user-agent strictly for session security and anti-cheat rate limiting.</li>
              <li><strong>Performance Data:</strong> Quiz response latency and speed calculations recorded for accurate leaderboard placement.</li>
            </ul>

            <h3>2. Purpose Limitation</h3>
            <p>
              Your personal data is processed solely for maintaining your account session, delivering email verification codes, and fulfilling 30-day software licenses. We never sell, rent, or trade user data to third-party advertisers.
            </p>

            <h3>3. Data Principal Rights</h3>
            <p>
              Under the DPDP framework, you have the right to request access to your personal data, rectify inaccuracies, or request account erasure and data deletion by contacting our grievance officer.
            </p>

            <h3>4. Grievance Officer & Contact</h3>
            <div style={{ background: 'var(--bg-page)', padding: '0.85rem', borderRadius: 'var(--radius-sm)' }}>
              <strong>Official Contact:</strong> Deep Mehta, Founder & Grievance Officer<br />
              <strong>Email:</strong> mybooksxofficial@gmail.com<br />
              <strong>Helpline:</strong> +91 9644570828
            </div>
          </div>
        )}

        {activeDoc === 'rewards_policy' && (
          <div className="legal-content-body">
            <div className="legal-alert-box">
              <strong>Promotional Software Utility:</strong> Reward points exist solely to unlock temporary promotional licenses for MyBooksX digital products.
            </div>

            <h3>1. Earning Reward Points</h3>
            <ul>
              <li>Points are earned exclusively through accurate, fast answers in the Daily Quiz Arena.</li>
              <li>Response time is measured server-side to guarantee fairness: 0-3s (100 pts), 4-6s (85 pts), 7-9s (70 pts), 10-12s (50 pts), 13-15s (30 pts).</li>
            </ul>

            <h3>2. Redemption Guidelines</h3>
            <ul>
              <li>Points are non-transferable and non-exchangeable for cash or discounts on unrelated services.</li>
              <li>Submitting a redemption reserves the required points and creates a pending request.</li>
              <li>Approved redemptions grant a unique license key valid for 30 consecutive calendar days.</li>
              <li>If a redemption is rejected for policy or technical reasons, all reserved points are immediately and atomically refunded to the user's wallet.</li>
            </ul>

            <h3>3. Expiry and Integrity</h3>
            <p>
              Points remain valid while the user's account is in good standing. Accounts found manipulating network packets or abusing submission order will have their balances forfeited.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
