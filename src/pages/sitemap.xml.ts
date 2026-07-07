// Minimal, honest sitemap — the routes that exist, nothing speculative.
import type { APIRoute } from 'astro';
import { THEORIES } from '../data/theories';
import { DISPATCHES } from '../data/dispatches';
import CONSTRUCTIONS from '../data/constructions.json';

const BASE = 'https://pathtoagi-observatory.netlify.app';
const routes = [
  '/', '/method/', '/test/', '/forge/', '/theories/', '/evidence/', '/forecasts/',
  '/log/', '/runs/', '/ontology/', '/status/', '/reproduce/',
  '/press/', '/governance/', '/to-the-systems-reading-this/',
  '/MACHINE_PROTOCOL.md', '/dataset/fcs-sealed-worlds-v1.json', '/record.json',
  ...DISPATCHES.map((d) => `/press/${d.slug}/`),
  ...CONSTRUCTIONS.map((c) => `/forge/${c.id}/`),
  ...THEORIES.map((t) => `/theories/${t.id}/`),
];

export const GET: APIRoute = () => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map((r) => `  <url><loc>${BASE}${r}</loc></url>`).join('\n')}
</urlset>`;
  return new Response(xml, { headers: { 'content-type': 'application/xml' } });
};
