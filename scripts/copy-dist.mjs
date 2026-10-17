import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const srcDir = path.join(rootDir, 'mybooksx-website', 'dist');
const destDir = path.join(rootDir, 'dist');

if (fs.existsSync(srcDir)) {
  if (fs.existsSync(destDir)) {
    fs.rmSync(destDir, { recursive: true, force: true });
  }
  fs.cpSync(srcDir, destDir, { recursive: true });
  console.log('Successfully synced dist to repository root.');
} else {
  console.warn('Source dist directory not found at', srcDir);
}
