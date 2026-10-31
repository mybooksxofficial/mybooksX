import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// 1. UserDashboardPage.tsx
const dashboardPath = path.join(rootDir, 'src/pages/UserDashboardPage.tsx');
let dash = fs.readFileSync(dashboardPath, 'utf8');

dash = dash.replace(
  '<span>Start QUEST (10 Questions • 5 Mins)</span>',
  '<span>Start QUEST (20 Questions • 15 Mins)</span>'
);
dash = dash.replace(
  '<h4>30-Second Speed Points Criteria (5 Min Total)</h4>',
  '<h4>45-Second Speed Points Criteria (15 Min Total • 20 Math Questions)</h4>'
);
dash = dash.replace(
  `<div className="score-tier">
                    <span className="time">0–5 seconds</span>
                    <strong className="pts text-royal">+200 pts</strong>
                    <span className="badge-speed">Lightning</span>
                  </div>
                  <div className="score-tier">
                    <span className="time">6–10 seconds</span>
                    <strong className="pts text-royal">+180 pts</strong>
                    <span className="badge-speed">Fast</span>
                  </div>
                  <div className="score-tier">
                    <span className="time">11–15 seconds</span>
                    <strong className="pts text-royal">+160 pts</strong>
                    <span className="badge-speed">Great</span>
                  </div>
                  <div className="score-tier">
                    <span className="time">16–20 seconds</span>
                    <strong className="pts text-royal">+130 pts</strong>
                    <span className="badge-speed">Good</span>
                  </div>
                  <div className="score-tier">
                    <span className="time">21–25 seconds</span>
                    <strong className="pts text-royal">+100 pts</strong>
                    <span className="badge-speed">Steady</span>
                  </div>`,
  `<div className="score-tier">
                    <span className="time">0–7 seconds</span>
                    <strong className="pts text-royal">+200 pts</strong>
                    <span className="badge-speed">Lightning</span>
                  </div>
                  <div className="score-tier">
                    <span className="time">8–15 seconds</span>
                    <strong className="pts text-royal">+180 pts</strong>
                    <span className="badge-speed">Fast</span>
                  </div>
                  <div className="score-tier">
                    <span className="time">16–25 seconds</span>
                    <strong className="pts text-royal">+150 pts</strong>
                    <span className="badge-speed">Great</span>
                  </div>
                  <div className="score-tier">
                    <span className="time">26–35 seconds</span>
                    <strong className="pts text-royal">+120 pts</strong>
                    <span className="badge-speed">Good</span>
                  </div>
                  <div className="score-tier">
                    <span className="time">36–45 seconds</span>
                    <strong className="pts text-royal">+90 pts</strong>
                    <span className="badge-speed">Steady</span>
                  </div>`
);

fs.writeFileSync(dashboardPath, dash, 'utf8');

// 2. OwnerPanelModal.tsx text
const ownerPath = path.join(rootDir, 'src/components/OwnerPanelModal.tsx');
let owner = fs.readFileSync(ownerPath, 'utf8');
owner = owner.replace(
  'Set the daily 5-minute business competition live at any time',
  'Set the daily 15-minute mathematical competition live at any time'
);
owner = owner.replace(
  'take the 10-question business challenge at any minute',
  'take the 20-question mathematical challenge at any minute'
);
fs.writeFileSync(ownerPath, owner, 'utf8');

console.log('✅ Updated UserDashboardPage and OwnerPanelModal texts to 20 Questions / 15 Mins / 45s criteria');

