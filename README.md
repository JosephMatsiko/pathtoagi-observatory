# pathtoAGI — the Observatory

A public epistemic instrument watching the emergence — or non-emergence — of machine general intelligence. Sources, claims, forecasts, revisions. A record that can be inspected, not an oracle.

The one question it exists to track:

> Could an AI, given only what was known in 1911, derive general relativity by 1915?

Today's answer: **No. Not yet.** The instrument tracks what would have to change for that to become *yes*.

## Stack

- **[Astro 5](https://astro.build)** — content spine, static output
- **React 19 + TypeScript** — interactive islands (the capability-frontier radar)
- **Tailwind CSS v4** — theming via `@tailwindcss/vite`
- **Newsreader / JetBrains Mono** — self-hosted editorial + mono type

## Develop

```sh
npm install
npm run dev      # local dev server
npm run build    # static build to dist/
npm run preview  # serve the built site
```

## Structure

```
src/
  data/                  # the record, as typed data
    capabilities.ts       # 8 capability axes + 2026 frontier + human reference
    theories.ts           # 5 theories: health, trend, proponents, falsifier
    frame-construction.ts  # the operating question + six FCS probes + asymmetry
    evidence.ts           # capability events under healthΔ-0 discipline
    forecasts.ts          # scoreable forecasts + Brier scoring
    revisions.ts          # the revision log
  content/theories/*.md   # long-form theory bodies (content collection)
  components/Frontier.tsx  # React island — capability-frontier radar
  layouts/Base.astro       # shell: nav, footer, theme
  pages/
    index.astro            # the Readout — question, verdict, instrument strip
    frontier/              # the capability frontier + ranked-gap table
    test/                  # the Einstein Test — frame construction operationalized
    theories/              # index + [slug] detail pages
    evidence/              # the evidence ledger
    forecasts/             # the forecast ledger + calibration
    log.astro              # the revision log
    charter.astro          # the constitution
    colophon.astro         # self-state + negative space
  styles/global.css        # theme tokens + type system
```

## Evidence discipline

The capability scores, theory-health readings, probe statuses, and forecast probabilities are **estimates**, held open to revision — deliberately conservative and meant to be re-grounded against evidence, not treated as measured fact. That is the point of the record: it can be inspected and revised in public, not that it is already right. Resolved forecasts keep their original probability so the calibration score counts the misses.
