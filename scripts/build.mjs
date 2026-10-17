import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const websiteDir = path.join(rootDir, 'mybooksx-website');

console.log('--- Building MyBooks Website ---');
const isWin = process.platform === 'win32';
const npmCmd = isWin ? 'npm.cmd' : 'npm';

const result = spawnSync(npmCmd, ['run', 'build'], {
  cwd: websiteDir,
  stdio: 'inherit',
  shell: isWin
});

if (result.status !== 0) {
  console.error('Build failed with exit code', result.status);
  process.exit(result.status || 1);
}

const srcDist = path.join(websiteDir, 'dist');
const rootDist = path.join(rootDir, 'dist');

if (fs.existsSync(srcDist)) {
  if (fs.existsSync(rootDist)) {
    fs.rmSync(rootDist, { recursive: true, force: true });
  }
  fs.cpSync(srcDist, rootDist, { recursive: true });
  console.log('--- Build Succeeded: Synced dist to repository root and mybooksx-website/dist ---');
} else {
  console.error('Error: Build completed but dist directory was not found!');
  process.exit(1);
}
