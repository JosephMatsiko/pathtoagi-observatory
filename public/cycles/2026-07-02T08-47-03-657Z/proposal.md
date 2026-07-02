# SCOUT proposal — 2026-07-02T08:47Z

## Coverage checklist sweep

1. **Frontier labs**
   - **Anthropic — PROPOSAL BELOW.** Claude Sonnet 5 announced 2026-06-30 (https://www.anthropic.com/news/claude-sonnet-5); not in evidence.json (no sonnet-5 id exists). This is the event two prior cycles lost to score misattribution. Also announced Jun 30: "Claude Science" research application — product tooling, not capability signal; no record proposed. Fable 5 redeployment already covered (cce-2026-06-30-fable5-redeployment).
   - OpenAI: GPT-5.6 preview already covered (cce-2026-06-26-gpt-5-6-preview). Nothing newer found in-window.
   - Google DeepMind: no release/GA news in-window; Gemini 3.5 Pro GA forecast (fc-gemini-35-pro-ga) horizon 2026-07-31 not yet due.
   - Meta: nothing citable in-window.
   - xAI: Grok 4.5 private beta already covered (cce-2026-06-28-grok-45-private-beta).
   - DeepSeek / Alibaba-Qwen / Mistral: latest identifiable releases (Qwen3.5 9B, 2026-06-01; DeepSeek V4 Flash; Mistral Large 3, late 2025) all predate the record window; nothing new in-window.
2. **Regulatory & governance**: the only in-window regulatory event (US lift of Fable 5 export controls, effective Jul 1) is already captured in cce-2026-06-30-fable5-redeployment. Nothing else found.
3. **Independent evaluations**: METR's most recent Frontier Risk Report is dated 2026-05-19 (covers Feb–Mar 2026) — predates the record window and is not new signal; no new METR/ARC-AGI/Epoch publication found since 2026-07-01. METR's cce-2026-06-26-metr-gpt-5-6-eval remains the latest eval entry.
4. **Already-covered diff**: candidate diffed against all 9 existing evidence ids; only Sonnet 5 is uncovered.

## Forecasts past horizon

None. Today is 2026-07-02; nearest open horizon is fc-fable5-cap-transition (2026-07-08). Nothing to resolve.

## Evidence to add (1 record)

```json
{
  "id": "cce-2026-06-30-sonnet-5-launch",
  "observedAt": "2026-06-30",
  "source": "Anthropic — Introducing Claude Sonnet 5 (published June 30, 2026)",
  "sourceUrl": "https://www.anthropic.com/news/claude-sonnet-5",
  "class": "vendor-reported",
  "theories": ["scaling-plus-rl"],
  "signal": "Anthropic released Claude Sonnet 5 on June 30, positioning it as frontier performance across coding, agents, and professional work. Claims verified against the primary post: it is the default model for Free and Pro plans; API id claude-sonnet-5; introductory pricing $2/$10 per Mtok input/output through August 31, 2026, then $3/$15; footnote 2 states an updated tokenizer consumes roughly 1.0–1.35x more tokens than previous models depending on content type. Safety claims (Anthropic's own): overall lower rate of undesirable behaviors than Sonnet 4.6; 'much lower ability to perform cybersecurity tasks than our current Opus models'; on the Firefox exploit-development eval, 'Neither of the Sonnet models could successfully develop a working exploit (both scored 0.0%)' — the 0.0% applies to both Sonnet 5 and Sonnet 4.6.",
  "implication": "Routine mid-tier frontier refresh days after the Fable 5 redeployment: the release cadence resumed immediately after the export-control episode, and the launch emphasizes agentic/professional work over raw capability jumps. The effective price is murkier than the headline: the 1.0–1.35x tokenizer inflation partially offsets the $2/$10 introductory rate.",
  "bounded": "All claims are vendor-reported and unaudited. The announcement's benchmark comparison table ('Scores for Sonnet 5 ... compared to those of Sonnet 4.6 and Opus 4.8') is published as an image whose cell values could not be programmatically verified; per the source-fidelity rule — and after two prior cycles were rejected for misattributing footnoted Sonnet 4.6 scores to Sonnet 5 — every benchmark number is deliberately omitted from this record rather than risked. Third-party claims circulating in secondary coverage (e.g. a 1M-token context window, 'default model in Claude Code') were NOT confirmed on the primary page and are excluded. No independent evaluation of Sonnet 5 exists yet.",
  "nextNeeded": "Independent benchmark replication (METR, Epoch, or academic); OCR-verified or API-doc-confirmed benchmark figures with exact column attribution; confirmation or refutation of the 1M-context claim from Anthropic's model docs."
}
```

### Source-fidelity audit trail (per the 2026-07-01 method-health rule)
Every number retained, with its attribution sentence on the primary page:
- **$2/$10 through Aug 31; $3/$15 after** — pricing section, attributed to Sonnet 5 introductory/standard pricing.
- **1.0–1.35x tokenizer factor** — footnote 2, explicitly about Sonnet 5's updated tokenizer vs. previous models.
- **0.0% Firefox exploit** — exact sentence: "Neither of the Sonnet models could successfully develop a working exploit (both scored 0.0%)"; attributed to *both* Sonnets and recorded as such.
- **All benchmark-table scores** — attribution unverifiable (image); omitted entirely.

## Forecast changes

None proposed. fc-verdict-holds unaffected: a vendor-reported mid-tier refresh with no independently verified capability delta does not move the operating verdict.
