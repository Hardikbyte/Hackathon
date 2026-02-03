import { existsSync } from 'fs';
import archiver from 'archiver';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const ROOT = path.resolve(__dirname, '../..');
const SKIP_DIRS = new Set([
  'node_modules',
  '.git',
  '.next',
  '.cache',
  '.turbo',
  'dist',
  'build',
  'coverage',
]);
const SKIP_FILES = new Set([
  '.env',
  '.env.local',
  '.env.development',
  '.env.production',
  '.env.test',
  'npm-debug.log',
  'yarn-error.log',
]);

function shouldInclude(entry) {
  const name = entry.name || '';
  const parts = name.split('/').filter(Boolean);
  if (parts.some((part) => SKIP_DIRS.has(part))) return false;
  const base = path.basename(name);
  if (SKIP_FILES.has(base)) return false;
  if (base.endsWith('.log') || base.endsWith('.zip')) return false;
  return true;
}

export async function downloadProjectRoute(req, res) {
  res.setHeader('Content-Type', 'application/zip');
  res.setHeader('Content-Disposition', 'attachment; filename=voice-automation-project.zip');
  const archive = archiver('zip', { zlib: { level: 9 } });
  archive.on('error', (err) => {
    console.error(err);
    if (!res.headersSent) res.status(500).end();
  });
  archive.pipe(res);
  const dirs = ['frontend', 'backend', 'n8n-workflow', 'prompts'];
  const files = ['README.md', 'package.json', 'package-lock.json', '.env.example'];
  for (const dir of dirs) {
    const full = path.join(ROOT, dir);
    if (existsSync(full)) archive.directory(full, dir, (entry) => (shouldInclude(entry) ? entry : false));
  }
  for (const file of files) {
    const full = path.join(ROOT, file);
    if (existsSync(full)) archive.file(full, { name: file });
  }
  await archive.finalize();
}
