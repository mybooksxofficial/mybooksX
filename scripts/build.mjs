import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const websiteDir = path.join(rootDir, 'mybooksx-website');

console.log('--- Building MyBooks Website ---');
const isWin = process.platform === 'win32';
const buildCmd = isWin ? 'npm.cmd run build' : 'npm run build';

execSync(buildCmd, {
  cwd: websiteDir,
  stdio: ['ignore', 'inherit', 'inherit']
});

const srcDist = path.join(websiteDir, 'dist');
const rootDist = path.join(rootDir, 'dist');

if (fs.existsSync(srcDist)) {
  if (fs.existsSync(rootDist)) {
    fs.rmSync(rootDist, { recursive: true, force: true });
  }
  fs.cpSync(srcDist, rootDist, { recursive: true });
  console.log('--- Build Succeeded: Synced dist to repository root ---');
} else {
  console.error('Error: Build completed but dist directory was not found!');
  process.exit(1);
}

process.exit(0);
