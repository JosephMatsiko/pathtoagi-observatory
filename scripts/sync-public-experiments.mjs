#!/usr/bin/env node
// Sync sealed-world artifacts from experiments/ (source of truth, in the repo
// root) into public/experiments/ (the servable copy) so evidence sourceUrls
// pointing at /experiments/<world>/ actually resolve. Runs before every build
// so the two can never silently drift — experiments/ is what the graders and
// gate read; public/experiments/ is what a browser can fetch. The off-repo
// reveal key is never copied (it never lives in experiments/ either).
import { readdirSync, statSync, mkdirSync, copyFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(ROOT, 'experiments');
const DEST = join(ROOT, 'public', 'experiments');

function copyDir(src, dest) {
  mkdirSync(dest, { recursive: true });
  for (const entry of readdirSync(src)) {
    const s = join(src, entry);
    const d = join(dest, entry);
    if (statSync(s).isDirectory()) copyDir(s, d);
    else copyFileSync(s, d);
  }
}

let synced = 0;
for (const name of readdirSync(SRC)) {
  const src = join(SRC, name);
  if (!statSync(src).isDirectory() || !name.startsWith('fcs-synth-')) continue;
  copyDir(src, join(DEST, name));
  synced++;
}
console.log(`✓ synced ${synced} sealed-world director${synced === 1 ? 'y' : 'ies'} → public/experiments/`);
