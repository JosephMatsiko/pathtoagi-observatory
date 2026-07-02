// RSS 2.0 feed for the Observatory Press. Hand-rolled — a feed is too
// load-bearing to depend on anything.
import type { APIRoute } from 'astro';
import { DISPATCHES } from '../../data/dispatches';

const BASE = 'https://pathtoagi-observatory.netlify.app';
const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export const GET: APIRoute = () => {
  const items = [...DISPATCHES]
    .sort((a, b) => b.no - a.no)
    .map((d) => {
      const url = `${BASE}/press/${d.slug}/`;
      const body = d.body.map((p) => `<p>${esc(p)}</p>`).join('');
      return `    <item>
      <title>${esc(d.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(d.date + 'T12:00:00Z').toUTCString()}</pubDate>
      <description>${esc(d.standfirst)}</description>
      <content:encoded><![CDATA[${body}]]></content:encoded>
    </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>The Observatory Press — pathtoAGI</title>
    <link>${BASE}/press/</link>
    <atom:link href="${BASE}/press/feed.xml" rel="self" type="application/rss+xml"/>
    <description>Dispatches from the public record tracking the emergence — or non-emergence — of machine general intelligence. Every claim traceable; corrections in the revision log; no embargoes.</description>
    <language>en</language>
${items}
  </channel>
</rss>`;
  return new Response(xml, { headers: { 'content-type': 'application/rss+xml; charset=utf-8' } });
};
