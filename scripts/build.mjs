import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const websiteDir = path.join(rootDir, 'mybooksx-website');

console.log('--- Building MyBooks Website ---');
const isWin = process.platform === 'win32';
const buildCmd = isWin ? 'npm.cmd run build' : 'npm run build';

try {
  execSync(buildCmd, {
    cwd: websiteDir,
    stdio: ['ignore', 'inherit', 'inherit'],
    env: { ...process.env, CI: 'false' }
  });
} catch {
  console.log('Retrying build from root workspace...');
  const rootBuildCmd = isWin ? 'npm.cmd run build --workspace=mybooksx-website' : 'npm run build --workspace=mybooksx-website';
  execSync(rootBuildCmd, {
    cwd: rootDir,
    stdio: ['ignore', 'inherit', 'inherit'],
    env: { ...process.env, CI: 'false' }
  });
}

const srcDist = path.join(websiteDir, 'dist');
const rootDist = path.join(rootDir, 'dist');

if (fs.existsSync(srcDist)) {
  if (fs.existsSync(rootDist)) {
    fs.rmSync(rootDist, { recursive: true, force: true });
  }
  fs.cpSync(srcDist, rootDist, { recursive: true });

  // Ensure _redirects is present for Cloudflare Pages / Vercel SPA routing
  const redirectsSrc = path.join(websiteDir, 'public', '_redirects');
  const redirectsDest = path.join(rootDist, '_redirects');
  if (fs.existsSync(redirectsSrc)) {
    fs.copyFileSync(redirectsSrc, redirectsDest);
  } else if (!fs.existsSync(redirectsDest)) {
    fs.writeFileSync(redirectsDest, '/* /index.html 200\n', 'utf8');
  }

  console.log('--- Build Succeeded: Synced dist & _redirects to repository root ---');
} else {
  console.error('Error: Build completed but dist directory was not found!');
  process.exit(1);
}

process.exit(0);
