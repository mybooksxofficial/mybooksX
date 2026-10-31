import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const arenaPath = path.join(rootDir, 'src/pages/QuestArenaPage.tsx');
let code = fs.readFileSync(arenaPath, 'utf8');

// 1. Add gate form state
if (!code.includes('const [gateName, setGateName]')) {
  code = code.replace(
    "const { isAuthenticated, openAuthModal, refreshUser } = useAuth();",
    `const { isAuthenticated, openAuthModal, refreshUser } = useAuth();
  const [gateName, setGateName] = useState('');
  const [gatePhone, setGatePhone] = useState('');
  const [isGateSubmitting, setIsGateSubmitting] = useState(false);
  const [gateError, setGateError] = useState('');

  const handleGatePhoneLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setGateError('');
    const trimmedName = gateName.trim();
    const cleanDigits = gatePhone.replace(/\\D/g, '');

    if (!trimmedName || trimmedName.length < 2) {
      setGateError('Please enter your full name (at least 2 characters).');
      return;
    }
    if (cleanDigits.length < 10) {
      setGateError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setIsGateSubmitting(true);
    try {
      const res = await api.auth.phoneLogin({
        fullName: trimmedName,
        phone: cleanDigits.slice(-10)
      });
      if (res.success) {
        await refreshUser();
      } else {
        setGateError(res.message || 'Could not sign in with this number.');
      }
    } catch (err: any) {
      setGateError(err.message || 'Network error.');
    } finally {
      setIsGateSubmitting(false);
    }
  };`
  );
}

// 2. Replace unauthenticated screen with direct real Name & Phone entry
const oldGate = `  // Render Unauthenticated State
  if (!isAuthenticated) {
    return (
      <div className="mbx-quest-viewport center-layout">
        <div className="quest-gate-card">
          <Zap size={36} className="text-royal" />
          <h2>Authentication Required</h2>
          <p>You must be signed in with a verified account to participate in QUEST.</p>
          <div className="gate-actions">
            <button type="button" className="btn-primary" onClick={() => openAuthModal('login')}>
              Sign In to Enter QUEST
            </button>
            <button type="button" className="btn-secondary" onClick={() => navigateTo('/dashboard')}>
              Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }`;

const newGate = `  // Render Direct Fast Entry Form for Unauthenticated Users
  if (!isAuthenticated) {
    return (
      <div className="mbx-quest-viewport center-layout">
        <div className="quest-gate-card" style={{ maxWidth: '440px', width: '100%', padding: '2rem 1.75rem', textAlign: 'center', background: '#FFFFFF', borderRadius: '16px', boxShadow: '0 8px 30px rgba(0,0,0,0.08)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'inline-flex', padding: '0.75rem', borderRadius: '50%', background: '#EFF6FF', marginBottom: '0.75rem' }}>
            <Zap size={36} className="text-royal" />
          </div>
          <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
            15-Minute Mathematical QUEST
          </h2>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
            Enter your real Name & Mobile Number to start the 20-question challenge and earn software rewards.
          </p>

          {gateError && (
            <div style={{ background: '#FEE2E2', color: '#B91C1C', padding: '0.6rem 0.85rem', borderRadius: '8px', fontSize: '0.84rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem', textAlign: 'left' }}>
              <AlertCircle size={16} />
              <span>{gateError}</span>
            </div>
          )}

          <form onSubmit={handleGatePhoneLogin} style={{ textAlign: 'left' }}>
            <div style={{ marginBottom: '0.85rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                Full Name
              </label>
              <input
                type="text"
                placeholder="e.g. Deep Mehta"
                required
                value={gateName}
                onChange={e => setGateName(e.target.value)}
                style={{ width: '100%', padding: '0.75rem 0.9rem', borderRadius: '8px', border: '1px solid var(--border-subtle)', fontSize: '0.92rem', background: '#FFFFFF' }}
              />
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
                Mobile Number (India)
              </label>
              <input
                type="tel"
                placeholder="9644570828"
                required
                maxLength={10}
                value={gatePhone}
                onChange={e => setGatePhone(e.target.value.replace(/\\D/g, ''))}
                style={{ width: '100%', padding: '0.75rem 0.9rem', borderRadius: '8px', border: '1px solid var(--border-subtle)', fontSize: '0.92rem', background: '#FFFFFF' }}
              />
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.25rem', display: 'block' }}>
                Real 10-digit number. Winner vouchers are sent directly to this number.
              </span>
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={isGateSubmitting}
              style={{
                width: '100%',
                padding: '0.85rem',
                fontSize: '0.98rem',
                fontWeight: 700,
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)',
                cursor: 'pointer'
              }}
            >
              {isGateSubmitting ? <RefreshCw size={18} className="spin" /> : <Zap size={18} />}
              <span>{isGateSubmitting ? 'Starting QUEST...' : '⚡ Enter QUEST (20 Questions • 15 Mins)'}</span>
            </button>
          </form>

          <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button
              type="button"
              onClick={() => openAuthModal('login')}
              style={{ background: 'none', border: 'none', fontSize: '0.8rem', color: 'var(--royal-blue)', cursor: 'pointer', fontWeight: 600 }}
            >
              Sign in with Email instead
            </button>
            <button
              type="button"
              onClick={() => navigateTo('/dashboard')}
              style={{ background: 'none', border: 'none', fontSize: '0.8rem', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              View Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }`;

code = code.replace(oldGate.replace(/\r\n/g, '\n'), newGate);
code = code.replace(oldGate.replace(/\n/g, '\r\n'), newGate.replace(/\n/g, '\r\n'));

// 3. Update error notice card to provide Instant Replay / Reset
const oldError = `        ) : errorMsg ? (
          <div className="quest-error-card">
            <AlertCircle size={32} className="text-danger" />
            <h3>Notice</h3>
            <p>{errorMsg}</p>
            <button type="button" className="btn-primary" onClick={() => navigateTo('/dashboard')}>
              Back to Dashboard
            </button>
          </div>`;

const newError = `        ) : errorMsg ? (
          <div className="quest-error-card" style={{ maxWidth: '480px', margin: '2rem auto', textAlign: 'center', padding: '2rem', background: '#FFFFFF', borderRadius: '16px', boxShadow: '0 8px 30px rgba(0,0,0,0.08)', border: '1px solid var(--border-subtle)' }}>
            <AlertCircle size={36} className="text-warning" style={{ margin: '0 auto 0.75rem' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>QUEST Notice</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', lineHeight: 1.5 }}>{errorMsg}</p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="btn-primary"
                onClick={async () => {
                  setIsLoading(true);
                  setErrorMsg('');
                  try {
                    await api.admin.resetAttempts();
                  } catch {}
                  window.location.reload();
                }}
                style={{ background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.75rem 1rem', borderRadius: '8px', border: 'none', color: '#fff', fontWeight: 700, cursor: 'pointer' }}
              >
                <Zap size={16} />
                <span>⚡ Replay Now (Reset Attempt)</span>
              </button>
              <button type="button" className="btn-secondary" onClick={() => navigateTo('/dashboard')} style={{ padding: '0.75rem 1rem', borderRadius: '8px' }}>
                Return to Dashboard
              </button>
            </div>
          </div>`;

code = code.replace(oldError.replace(/\r\n/g, '\n'), newError);
code = code.replace(oldError.replace(/\n/g, '\r\n'), newError.replace(/\n/g, '\r\n'));

fs.writeFileSync(arenaPath, code, 'utf8');
console.log('✅ Enhanced QuestArenaPage with direct entry and instant replay');

