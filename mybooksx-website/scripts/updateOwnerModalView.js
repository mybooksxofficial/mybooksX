import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const ownerModalPath = path.join(rootDir, 'src/components/OwnerPanelModal.tsx');
let code = fs.readFileSync(ownerModalPath, 'utf8');

// 1. Update search filter to include phone
code = code.replace(
  'u.fullName.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.userId.toLowerCase().includes(q);',
  'u.fullName.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || (u.phone && u.phone.includes(q)) || u.userId.toLowerCase().includes(q);'
);

// 2. Update player dossier text to include phone
code = code.replace(
  'Rank: #${u.rank}\\nName: ${u.fullName}\\nEmail: ${u.email}',
  'Rank: #${u.rank}\\nName: ${u.fullName}\\nMobile: ${u.phone || "N/A"}\\nEmail: ${u.email}'
);

// 3. Update player row display to prominently feature real name, phone, and badge
const oldPlayerTd = `<div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{u.fullName}</div>
                                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{u.email}</div>
                                  <div style={{ display: 'flex', gap: '0.35rem', marginTop: '0.2rem' }}>
                                    <span style={{ fontSize: '0.7rem', padding: '0.1rem 0.4rem', borderRadius: '4px', background: u.authProvider === 'google' ? '#EFF6FF' : '#F3F4F6', color: u.authProvider === 'google' ? '#1D4ED8' : '#374151' }}>
                                      {u.authProvider === 'google' ? 'Google OAuth' : 'Email/Password'}
                                    </span>
                                    {u.isVerified && (
                                      <span style={{ fontSize: '0.7rem', padding: '0.1rem 0.4rem', borderRadius: '4px', background: '#DCFCE7', color: '#15803D' }}>
                                        Verified
                                      </span>
                                    )}
                                  </div>`;

const newPlayerTd = `<div style={{ fontWeight: 700, fontSize: '0.96rem', color: 'var(--text-primary)' }}>{u.fullName}</div>
                                  {u.phone ? (
                                    <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#059669', display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.15rem' }}>
                                      <Phone size={12} />
                                      <span>{u.phone}</span>
                                    </div>
                                  ) : (
                                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{u.email}</div>
                                  )}
                                  <div style={{ display: 'flex', gap: '0.35rem', marginTop: '0.25rem' }}>
                                    <span style={{ fontSize: '0.68rem', padding: '0.1rem 0.45rem', borderRadius: '4px', background: u.authProvider === 'phone' ? '#ECFDF5' : '#EFF6FF', color: u.authProvider === 'phone' ? '#065F46' : '#1D4ED8', fontWeight: 600 }}>
                                      {u.authProvider === 'phone' ? '📱 Mobile Verified' : 'Email Account'}
                                    </span>
                                    {u.isVerified && (
                                      <span style={{ fontSize: '0.68rem', padding: '0.1rem 0.45rem', borderRadius: '4px', background: '#DCFCE7', color: '#15803D', fontWeight: 600 }}>
                                        ✓ Active
                                      </span>
                                    )}
                                  </div>`;

code = code.replace(oldPlayerTd.replace(/\r\n/g, '\n'), newPlayerTd);
code = code.replace(oldPlayerTd.replace(/\n/g, '\r\n'), newPlayerTd.replace(/\n/g, '\r\n'));

// 4. Update action buttons to have Call button if phone exists
const oldActionCol = `<div style={{ display: 'flex', gap: '0.4rem' }}>
                                    <a
                                      href={waUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="btn-outline"
                                      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.35rem 0.6rem', fontSize: '0.76rem', borderColor: '#25D366', color: '#128C7E', textDecoration: 'none', borderRadius: '4px' }}
                                      title="Send this player's points text directly to Founder's WhatsApp (+91 9644570828)"
                                    >
                                      <MessageSquare size={13} />
                                      <span>Text to +91 9644570828</span>
                                    </a>
                                  </div>`;

const newActionCol = `<div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                                    {u.phone && (
                                      <a
                                        href={\`tel:\${u.phone.replace(/\\s+/g, '')}\`}
                                        className="btn-outline"
                                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', padding: '0.35rem 0.55rem', fontSize: '0.74rem', borderColor: '#3B82F6', color: '#1D4ED8', textDecoration: 'none', borderRadius: '4px' }}
                                        title={\`Call \${u.fullName} directly\`}
                                      >
                                        <Phone size={12} />
                                        <span>Call</span>
                                      </a>
                                    )}
                                    <a
                                      href={waUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="btn-outline"
                                      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.35rem 0.55rem', fontSize: '0.74rem', borderColor: '#25D366', color: '#128C7E', textDecoration: 'none', borderRadius: '4px' }}
                                      title="Send this player's points dossier directly to Founder's WhatsApp (+91 9644570828)"
                                    >
                                      <MessageSquare size={12} />
                                      <span>Send to Hotline</span>
                                    </a>
                                  </div>`;

code = code.replace(oldActionCol.replace(/\r\n/g, '\n'), newActionCol);
code = code.replace(oldActionCol.replace(/\n/g, '\r\n'), newActionCol.replace(/\n/g, '\r\n'));

// 5. Update Quiz Schedule tab description to 20 Questions / 15 Minutes
code = code.replace(
  '10 questions (4 Easy, 4 Medium, 2 Hard)',
  '20 Mathematical Questions (15 Minutes Total Duration)'
);
code = code.replace(
  'Exactly 5 minutes (300 seconds), 30 seconds per question',
  'Exactly 15 minutes (900 seconds), 45 seconds per question'
);

fs.writeFileSync(ownerModalPath, code, 'utf8');
console.log('✅ Updated src/components/OwnerPanelModal.tsx with Real Name, Phone, and 20 Math Questions info');

