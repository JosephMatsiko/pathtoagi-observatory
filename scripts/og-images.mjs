#!/usr/bin/env node
// Share-card imagery — the record gains a face. A default card plus one per
// dispatch, rendered from an SVG template via sharp at build time. Dark
// instrument aesthetic; no stock, no decoration without meaning.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import sharp from 'sharp';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'public', 'og');
mkdirSync(OUT, { recursive: true });

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const wrap = (text, max = 34) => {
  const words = text.split(' ');
  const lines = [''];
  for (const w of words) {
    if ((lines[lines.length - 1] + ' ' + w).trim().length > max) lines.push(w);
    else lines[lines.length - 1] = (lines[lines.length - 1] + ' ' + w).trim();
  }
  return lines.slice(0, 4);
};

const card = ({ eyebrow, title, footer }) => `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="sky" cx="50%" cy="120%" r="130%">
      <stop offset="0%" stop-color="#0d1b1e"/>
      <stop offset="100%" stop-color="#07090b"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#sky)"/>
  ${[...Array(28)].map((_, i) => {
    const x = (i * 379 + 83) % 1180 + 10;
    const y = (i * 173 + 41) % 300 + 20;
    const r = (i % 3) * 0.7 + 0.8;
    return `<circle cx="${x}" cy="${y}" r="${r}" fill="#8fd3d8" opacity="${0.15 + (i % 5) * 0.1}"/>`;
  }).join('')}
  <circle cx="1050" cy="120" r="46" fill="none" stroke="#22333a" stroke-width="1"/>
  <circle cx="1050" cy="120" r="70" fill="none" stroke="#1a272c" stroke-width="1"/>
  <text x="80" y="180" font-family="Menlo, monospace" font-size="26" letter-spacing="6" fill="#5f7d84">${esc(eyebrow.toUpperCase())}</text>
  ${wrap(title).map((line, i) => `<text x="78" y="${262 + i * 74}" font-family="Georgia, serif" font-size="62" fill="#e8f0ef">${esc(line)}</text>`).join('')}
  <text x="80" y="560" font-family="Menlo, monospace" font-size="24" fill="#8fd3d8">pathto<tspan fill="#e8f0ef">AGI</tspan> — the observatory</text>
  <text x="80" y="592" font-family="Menlo, monospace" font-size="18" fill="#5f7d84">${esc(footer)}</text>
</svg>`;

const render = async (name, opts) => {
  await sharp(Buffer.from(card(opts))).png().toFile(join(OUT, name));
  console.log(`✓ og/${name}`);
};

const dispatches = JSON.parse(readFileSync(join(ROOT, 'src', 'data', 'dispatches.json'), 'utf8'));
await render('default.png', {
  eyebrow: 'A public epistemic instrument',
  title: 'Could an AI derive general relativity by 1915? No. Not yet.',
  footer: 'sources · claims · forecasts · revisions — a record that can be inspected',
});
for (const d of dispatches) {
  await render(`press-${d.slug}.png`, {
    eyebrow: `The Observatory Press · No. ${String(d.no).padStart(3, '0')}`,
    title: d.title,
    footer: `${d.date} · every claim traces to the record · corrections in public`,
  });
}
