# The Observatory

A lean, inspectable public record tracking the path to AGI — a clean-room rebuild of the original *Path to AGI* Observatory, kept small on purpose so it can be regrown deliberately.

The central question it exists to track:

> Could an AI, given only what was known in 1911, derive general relativity by 1915?

Today's answer: **No. Not yet.** This app is the instrument for watching what would have to change for that to become *yes*.

## Stack

- **[Astro 5](https://astro.build)** — content spine, static output
- **React 19 + TypeScript** — interactive islands (the capability-frontier radar)
- **Tailwind CSS v4** — theming via `@tailwindcss/vite`

## Develop

```sh
npm install
npm run dev      # local dev server
npm run build    # static build to dist/
npm run preview  # serve the built site
npm run check    # astro type + content check
```

## Structure

```
src/
  data/
    capabilities.ts   # 8 capability axes + 2026 frontier + human reference vectors
    theories.ts       # 5 theories: health + trend + one-line summary
  content/
    theories/*.md      # long-form theory bodies (Astro content collection)
  content.config.ts    # collection schema
  components/
    Frontier.tsx        # React island — capability-frontier radar
  layouts/Base.astro    # shell: nav, footer, theme
  pages/
    index.astro         # home — the 1911 question + frontier + theory strip
    frontier/           # full frontier instrument + ranked-gap table
    theories/           # index + [slug] detail pages
    charter.astro       # the constitution
  styles/global.css     # Tailwind v4 theme tokens
```

## What this is (and isn't)

The capability scores and theory-health readings are **seed estimates** carried from the original register — deliberately conservative, meant to be re-grounded against fresh evidence before they're treated as measured fact. The whole point of the record is that it can be inspected and revised on the record, not that it is right.

The full original Observatory (313 routes, ~100 conformance-check scripts, forecast ledgers, self-state records) lives in a separate repo. This is the spine.
