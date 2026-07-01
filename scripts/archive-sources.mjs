#!/usr/bin/env node
// Source archiving — capture cited sources before links rot. Deterministic,
// read-only fetches; text extraction only; 2MB per source; archive/ dir only.
// Run: npm run archive:sources
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const ARCHIVE = join(ROOT, 'archive');
const CAP = 2 * 1024 * 1024;

const evidence = JSON.parse(readFileSync(join(ROOT, 'src/data/evidence.json'), 'utf8'));
const urls = [...new Set(evidence.map((e) => e.sourceUrl).filter((u) => /^https?:\/\//.test(u)))];

const slug = (u) => u.replace(/^https?:\/\//, '').replace(/[^a-zA-Z0-9.-]+/g, '_').slice(0, 120);
const strip = (html) =>
  html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z#0-9]+;/gi, ' ')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n\s*\n\s*\n+/g, '\n\n')
    .trim();

let saved = 0, skipped = 0, failed = 0;
for (const url of urls) {
  const dir = join(ARCHIVE, slug(url));
  const file = join(dir, 'capture.txt');
  if (existsSync(file)) { skipped++; continue; }
  try {
    const res = await fetch(url, { redirect: 'follow', signal: AbortSignal.timeout(20000), headers: { 'user-agent': 'pathtoAGI-observatory-archiver/1.0 (+https://pathtoagi-observatory.netlify.app)' } });
    if (!res.ok) { failed++; console.log(`  ✗ ${res.status} ${url}`); continue; }
    const buf = Buffer.from(await res.arrayBuffer());
    const text = strip(buf.slice(0, CAP).toString('utf8'));
    mkdirSync(dir, { recursive: true });
    writeFileSync(file, `SOURCE: ${url}\nCAPTURED: ${new Date().toISOString()}\nHTTP: ${res.status}\nTRUNCATED: ${buf.length > CAP}\n\n${text}\n`);
    saved++;
    console.log(`  ✓ archived ${url}`);
  } catch (e) {
    failed++;
    console.log(`  ✗ ${String(e.message ?? e).slice(0, 60)} ${url}`);
  }
}
console.log(`archive: ${saved} saved, ${skipped} already captured, ${failed} unreachable (noted, not fatal)`);
