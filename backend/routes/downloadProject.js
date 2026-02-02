import { existsSync } from 'fs';
import archiver from 'archiver';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const ROOT = path.resolve(__dirname, '../..');

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
  const files = ['README.md', 'package.json', '.env.example'];
  for (const dir of dirs) {
    const full = path.join(ROOT, dir);
    if (existsSync(full)) archive.directory(full, dir);
  }
  for (const file of files) {
    const full = path.join(ROOT, file);
    if (existsSync(full)) archive.file(full, { name: file });
  }
  await archive.finalize();
}
