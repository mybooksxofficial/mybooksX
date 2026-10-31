import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const appPath = path.join(rootDir, 'src/App.tsx');
let code = fs.readFileSync(appPath, 'utf8');

const oldQuestBlock = `  // Dedicated Route 4: /quest (QUEST Challenge Arena)
  if (currentRoute === '/quest') {
    return (
      <div className="mybooksx-app-container">
        <QuestArenaPage />
      </div>
    );
  }`;

const newQuestBlock = `  // Dedicated Route 4: /quest (QUEST Challenge Arena)
  if (currentRoute === '/quest') {
    return (
      <div className="mybooksx-app-container">
        <QuestArenaPage />
        <AuthModal />
        <LegalModals />
      </div>
    );
  }`;

code = code.replace(oldQuestBlock.replace(/\r\n/g, '\n'), newQuestBlock);
code = code.replace(oldQuestBlock.replace(/\n/g, '\r\n'), newQuestBlock.replace(/\n/g, '\r\n'));

const oldDashBlock = `  // Dedicated Route 3: /dashboard (Single Unified Authenticated Dashboard)
  if (currentRoute === '/dashboard') {
    return (
      <div className="mybooksx-app-container">
        <UserDashboardPage />
        <LegalModals />
      </div>
    );
  }`;

const newDashBlock = `  // Dedicated Route 3: /dashboard (Single Unified Authenticated Dashboard)
  if (currentRoute === '/dashboard') {
    return (
      <div className="mybooksx-app-container">
        <UserDashboardPage />
        <AuthModal />
        <LegalModals />
      </div>
    );
  }`;

code = code.replace(oldDashBlock.replace(/\r\n/g, '\n'), newDashBlock);
code = code.replace(oldDashBlock.replace(/\n/g, '\r\n'), newDashBlock.replace(/\n/g, '\r\n'));

fs.writeFileSync(appPath, code, 'utf8');
console.log('✅ Added <AuthModal /> to /quest and /dashboard in App.tsx');
