// Minimal, honest sitemap — the routes that exist, nothing speculative.
import type { APIRoute } from 'astro';
import { THEORIES } from '../data/theories';

const BASE = 'https://pathtoagi-observatory.netlify.app';
const routes = [
  '/', '/frontier/', '/test/', '/theories/', '/evidence/', '/forecasts/',
  '/log/', '/operate/', '/charter/', '/colophon/',
  ...THEORIES.map((t) => `/theories/${t.id}/`),
];

export const GET: APIRoute = () => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map((r) => `  <url><loc>${BASE}${r}</loc></url>`).join('\n')}
</urlset>`;
  return new Response(xml, { headers: { 'content-type': 'application/xml' } });
};
