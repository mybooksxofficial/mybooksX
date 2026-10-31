/**
 * High-End Authentication Modal
 * Clean, production-ready authentication: Real Google OAuth 2.0 (PKCE) & Instant Google Sign-In & Genuine Email/Password.
 * Strictly adheres to production standards: No developer configuration boxes or blockers.
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { api } from '../services/apiClient.ts';
import { navigateTo } from '../utils/navigation.ts';
import { X, Lock, User, ShieldCheck, AlertCircle, Eye, EyeOff, RefreshCw, CheckCircle2 } from 'lucide-react';
import './AuthModal.css';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    authModalTab,
    closeAuthModal,
    openAuthModal,
    refreshUser,
    openLegalModal
  } = useAuth();

  // Form inputs
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Status indicators
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const resetFormState = () => {
    setErrorMsg('');
    setSuccessMsg('');
  };

  const handleTabSwitch = (tab: 'login' | 'register' | 'verify' | 'forgot') => {
    resetFormState();
    openAuthModal(tab);
  };

  // Listen for OAuth redirect errors from backend callback (?auth_error=...)
  useEffect(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const authError = urlParams.get('auth_error');
      if (authError) {
        let friendly = decodeURIComponent(authError);
        if (authError === 'access_denied') {
          friendly = 'Google Sign-In was cancelled.';
        } else if (authError === 'missing_code_or_state' || authError === 'INVALID_STATE') {
          friendly = 'Authentication session invalid or expired. Please try again.';
        } else if (authError === 'EXPIRED_STATE') {
          friendly = 'The Google sign-in session expired. Please try again.';
        } else if (authError === 'UNVERIFIED_EMAIL') {
          friendly = 'Your Google account email is not verified. Please verify your email with Google before signing in.';
        } else if (authError === 'TOKEN_EXCHANGE_FAILED') {
          friendly = 'Google authorization exchange failed. Please try again.';
        }

        setErrorMsg(friendly);
        openAuthModal('login');

        // Clean up URL parameter cleanly
        const cleanUrl = window.location.pathname + window.location.hash;
        window.history.replaceState({}, document.title, cleanUrl);
      }
    } catch {
      // Ignore URL parsing errors
    }
  }, [openAuthModal]);

  // Real Google Sign-In Handler
  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    resetFormState();

    try {
      const res = await api.auth.getGoogleAuthUrl();
      if (res.success && res.url) {
        // Genuine OAuth redirect to Google's official account selection & consent screen
        window.location.href = res.url;
        return;
      }
      setErrorMsg(res.message || 'Unable to connect to Google OAuth service.');
    } catch (err: any) {
      setErrorMsg(err.message || 'Network error during Google Sign-In.');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  // Genuine Email & Password Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    resetFormState();
    setIsLoading(true);

    try {
      const res = await api.auth.login({ email, password });
      if (res.success) {
        setSuccessMsg('Signed in successfully! Redirecting...');
        await refreshUser();
        setTimeout(() => {
          closeAuthModal();
          navigateTo('/dashboard');
        }, 500);
      } else {
        setErrorMsg(res.message || 'Login failed. Please verify your credentials.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred during sign in.');
    } finally {
      setIsLoading(false);
    }
  };

  // Genuine User Registration
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    resetFormState();

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    if (password.length < 8) {
      setErrorMsg('Password must be at least 8 characters.');
      return;
    }

    if (!acceptedTerms) {
      setErrorMsg('Please agree to the Terms & Conditions and Privacy Policy.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await api.auth.register({
        fullName,
        email,
        password,
        confirmPassword,
        acceptedTerms
      });

      if (res.success) {
        setSuccessMsg('Account registered successfully! Redirecting...');
        await refreshUser();
        setTimeout(() => {
          closeAuthModal();
          navigateTo('/dashboard');
        }, 600);
      } else {
        setErrorMsg(res.message || 'Registration failed. Please check your details.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred during registration.');
    } finally {
      setIsLoading(false);
    }
  };

  // Email Verification Handler
  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    resetFormState();
    setIsLoading(true);

    try {
      const res = await api.auth.verifyEmail({ email, code: verificationCode });
      if (res.success) {
        setSuccessMsg('Email verified successfully! You can now participate in Quizzes and Redemptions.');
        await refreshUser();
        setTimeout(() => {
          closeAuthModal();
          navigateTo('/dashboard');
        }, 800);
      } else {
        setErrorMsg(res.message || 'Verification failed. Please check the code.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Verification error.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!email) {
      setErrorMsg('Please enter your email address to receive a new code.');
      return;
    }
    setIsLoading(true);
    resetFormState();
    try {
      const res = await api.auth.resendCode(email);
      if (res.success) {
        setSuccessMsg(res.message || 'Verification code sent to your email.');
      } else {
        setErrorMsg(res.message || 'Could not resend code.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to resend code.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    resetFormState();
    setIsLoading(true);

    try {
      const res = await api.auth.forgotPassword(email);
      setSuccessMsg(res.message || 'Recovery instructions sent if the email exists.');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to process password recovery.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthModalOpen) return null;

  return (
    <div className="mbx-auth-overlay" onClick={closeAuthModal}>
      <div className="mbx-auth-card" onClick={e => e.stopPropagation()}>
        <button
          type="button"
          className="mbx-auth-close-btn"
          onClick={closeAuthModal}
          aria-label="Close dialog"
        >
          <X size={18} />
        </button>

        <div className="mbx-auth-header">
              <div className="mbx-auth-brand-pill">
                <ShieldCheck size={14} className="text-royal" />
                <span>MyBooksX Portal</span>
              </div>
              <h2 className="mbx-auth-title">
                {authModalTab === 'login' && 'Welcome Back'}
                {authModalTab === 'register' && 'Create Your Account'}
                {authModalTab === 'verify' && 'Verify Your Email'}
                {authModalTab === 'forgot' && 'Reset Password'}
              </h2>
              <p className="mbx-auth-subtitle">
                {authModalTab === 'login' && 'Sign in to access daily quizzes, points balance & rewards.'}
                {authModalTab === 'register' && 'Join MyBooksX to compete, earn points, and claim software rewards.'}
                {authModalTab === 'verify' && 'Enter the verification code to activate your account.'}
                {authModalTab === 'forgot' && 'Enter your email to receive recovery instructions.'}
              </p>
            </div>

            {/* Tab switcher for Login / Register */}
            {(authModalTab === 'login' || authModalTab === 'register') && (
              <div className="mbx-auth-tabs">
                <button
                  type="button"
                  className={`mbx-auth-tab-btn ${authModalTab === 'login' ? 'active' : ''}`}
                  onClick={() => handleTabSwitch('login')}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  className={`mbx-auth-tab-btn ${authModalTab === 'register' ? 'active' : ''}`}
                  onClick={() => handleTabSwitch('register')}
                >
                  Register
                </button>
              </div>
            )}

            {/* Real Google Authentication Button */}
            {(authModalTab === 'login' || authModalTab === 'register') && (
              <div className="mbx-google-auth-section">
                <button
                  type="button"
                  className="mbx-btn-google"
                  onClick={handleGoogleSignIn}
                  disabled={isLoading || isGoogleLoading}
                >
                  {isGoogleLoading ? (
                    <RefreshCw size={18} className="spin text-royal" />
                  ) : (
                    <svg className="mbx-google-g-icon" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                  )}
                  <span>{isGoogleLoading ? 'Connecting to Google...' : 'Continue with Google'}</span>
                </button>

                <div className="mbx-divider-row">
                  <span>OR WITH EMAIL & PASSWORD</span>
                </div>
              </div>
            )}

            {/* Dynamic Alerts */}
            {errorMsg && (
              <div className="mbx-auth-alert error">
                <AlertCircle size={16} />
                <span>{errorMsg}</span>
              </div>
            )}
            {successMsg && (
              <div className="mbx-auth-alert success">
                <CheckCircle2 size={16} />
                <span>{successMsg}</span>
              </div>
            )}

            {/* LOGIN FORM */}
            {authModalTab === 'login' && (
              <form className="mbx-auth-form" onSubmit={handleLogin}>
                <div className="mbx-input-group">
                  <label className="mbx-input-label">Email Address</label>
                  <input
                    type="email"
                    className="mbx-input-field"
                    placeholder="name@company.com"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                </div>

                <div className="mbx-input-group">
                  <div className="mbx-input-label">
                    <span>Password</span>
                    <button
                      type="button"
                      className="mbx-legal-link"
                      onClick={() => handleTabSwitch('forgot')}
                    >
                      Forgot?
                    </button>
                  </div>
                  <div className="mbx-password-wrapper">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="mbx-input-field"
                      placeholder="••••••••"
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="mbx-password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button type="submit" className="mbx-btn-submit" disabled={isLoading || isGoogleLoading}>
                  {isLoading ? <RefreshCw size={16} className="spin" /> : <Lock size={16} />}
                  <span>{isLoading ? 'Signing In...' : 'Sign In'}</span>
                </button>

                <div className="mbx-auth-switch">
                  <span>Don't have an account?</span>
                  <button
                    type="button"
                    className="mbx-switch-link"
                    onClick={() => handleTabSwitch('register')}
                  >
                    Register free
                  </button>
                </div>
              </form>
            )}

            {/* REGISTER FORM */}
            {authModalTab === 'register' && (
              <form className="mbx-auth-form" onSubmit={handleRegister}>
                <div className="mbx-input-group">
                  <label className="mbx-input-label">Full Name</label>
                  <input
                    type="text"
                    className="mbx-input-field"
                    placeholder="Deep Mehta"
                    required
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                  />
                </div>

                <div className="mbx-input-group">
                  <label className="mbx-input-label">Email Address</label>
                  <input
                    type="email"
                    className="mbx-input-field"
                    placeholder="name@company.com"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                </div>

                <div className="mbx-input-group">
                  <label className="mbx-input-label">Password (Min. 8 characters)</label>
                  <div className="mbx-password-wrapper">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="mbx-input-field"
                      placeholder="••••••••"
                      required
                      minLength={8}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="mbx-password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label="Toggle visibility"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="mbx-input-group">
                  <label className="mbx-input-label">Confirm Password</label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="mbx-input-field"
                    placeholder="••••••••"
                    required
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                  />
                </div>

                <div className="mbx-checkbox-row">
                  <input
                    type="checkbox"
                    id="mbx-terms"
                    checked={acceptedTerms}
                    onChange={e => setAcceptedTerms(e.target.checked)}
                    required
                  />
                  <label htmlFor="mbx-terms">
                    I agree to the{' '}
                    <button
                      type="button"
                      className="mbx-legal-link"
                      onClick={() => openLegalModal('terms')}
                    >
                      Terms & Conditions
                    </button>{' '}
                    and{' '}
                    <button
                      type="button"
                      className="mbx-legal-link"
                      onClick={() => openLegalModal('privacy')}
                    >
                      Privacy Policy
                    </button>
                    .
                  </label>
                </div>

                <button type="submit" className="mbx-btn-submit" disabled={isLoading || isGoogleLoading}>
                  {isLoading ? <RefreshCw size={16} className="spin" /> : <User size={16} />}
                  <span>{isLoading ? 'Creating Account...' : 'Create Account'}</span>
                </button>

                <div className="mbx-auth-switch">
                  <span>Already have an account?</span>
                  <button
                    type="button"
                    className="mbx-switch-link"
                    onClick={() => handleTabSwitch('login')}
                  >
                    Sign In
                  </button>
                </div>
              </form>
            )}

            {/* VERIFY EMAIL FORM */}
            {authModalTab === 'verify' && (
              <form className="mbx-auth-form" onSubmit={handleVerifyEmail}>
                <div className="mbx-input-group">
                  <label className="mbx-input-label">Email to Verify</label>
                  <input
                    type="email"
                    className="mbx-input-field"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                </div>

                <div className="mbx-input-group">
                  <label className="mbx-input-label">6-Digit Verification Code</label>
                  <input
                    type="text"
                    className="mbx-input-field"
                    placeholder="123456"
                    maxLength={6}
                    required
                    value={verificationCode}
                    onChange={e => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                    style={{ letterSpacing: '0.25em', fontSize: '1.2rem', textAlign: 'center' }}
                  />
                </div>

                <button type="submit" className="mbx-btn-submit" disabled={isLoading || verificationCode.length !== 6}>
                  {isLoading ? <RefreshCw size={16} className="spin" /> : <ShieldCheck size={16} />}
                  <span>Verify & Activate</span>
                </button>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.75rem' }}>
                  <button
                    type="button"
                    className="mbx-legal-link"
                    onClick={handleResendCode}
                    disabled={isLoading}
                  >
                    Resend Code
                  </button>
                  <button
                    type="button"
                    className="mbx-legal-link"
                    onClick={() => handleTabSwitch('login')}
                  >
                    Back to Sign In
                  </button>
                </div>
              </form>
            )}

            {/* FORGOT PASSWORD FORM */}
            {authModalTab === 'forgot' && (
              <form className="mbx-auth-form" onSubmit={handleForgotPassword}>
                <div className="mbx-input-group">
                  <label className="mbx-input-label">Registered Email</label>
                  <input
                    type="email"
                    className="mbx-input-field"
                    placeholder="name@company.com"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                </div>

                <button type="submit" className="mbx-btn-submit" disabled={isLoading}>
                  {isLoading ? <RefreshCw size={16} className="spin" /> : <ShieldCheck size={16} />}
                  <span>Send Recovery Email</span>
                </button>

                <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                  <button
                    type="button"
                    className="mbx-switch-link"
                    onClick={() => handleTabSwitch('login')}
                  >
                    Back to Sign In
                  </button>
                </div>
              </form>
            )}
      </div>
    </div>
  );
};
