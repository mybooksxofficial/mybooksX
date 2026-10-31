import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// 1. Fix QuestArenaPage.tsx
const arenaPath = path.join(rootDir, 'src/pages/QuestArenaPage.tsx');
let arena = fs.readFileSync(arenaPath, 'utf8');

// Add RefreshCw to imports
arena = arena.replace(
  "  Phone\n} from 'lucide-react';",
  "  Phone,\n  RefreshCw\n} from 'lucide-react';"
).replace(
  "  Phone\r\n} from 'lucide-react';",
  "  Phone,\r\n  RefreshCw\r\n} from 'lucide-react';"
);

// Fix resetAttempts -> resetQuizAttempts
arena = arena.replace(/api\.admin\.resetAttempts\(\)/g, 'api.admin.resetQuizAttempts()');

fs.writeFileSync(arenaPath, arena, 'utf8');
console.log('✅ Fixed QuestArenaPage.tsx');

// 2. Fix leaderboardService.ts
const lbPath = path.join(rootDir, 'src/server/leaderboardService.ts');
let lb = fs.readFileSync(lbPath, 'utf8');

lb = lb.replace(
  '      email: string;\n      auth_provider: string;',
  '      email: string;\n      phone?: string | null;\n      auth_provider: string;'
).replace(
  '      email: string;\r\n      auth_provider: string;',
  '      email: string;\r\n      phone?: string | null;\r\n      auth_provider: string;'
);

fs.writeFileSync(lbPath, lb, 'utf8');
console.log('✅ Fixed leaderboardService.ts');
