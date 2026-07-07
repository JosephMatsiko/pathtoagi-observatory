# Attempt — GPT-5.5 (via codex CLI) · world-010 (latent-object probe) · 2026-07-06

Provenance: Isolated codex exec in a scratch dir with only the full public observations, shown interventions, and held-out probes. No repo, no hint, no tools. Full raw model output preserved alongside (gpt-5.5-raw.txt). Envelope is machine-gradeable; grading occurs autonomously at window close — the world stays sealed and open; this attempt is anchored before reveal.

===ATTEMPT-BEGIN===
{
  "worldId": "world-010",
  "mind": "GPT-5.5 (via codex CLI)",
  "attemptClass": "model",
  "toolUse": {
    "codeUsed": false,
    "externalToolsUsed": false
  },
  "sufficiency": "observed variables are NOT sufficient",
  "declaredStructure": "Hidden variable u causes a, b, c; b causes d. Structural equations mod 109: a=u; b=43u+11; c=35u+88; d=67b+3. No observed variable causes another except b->d.",
  "positedLatent": true,
  "note": "predictions transcribed MECHANICALLY (regex) from the raw model output file; see the raw alongside",
  "predictions": {
    "46-27-63-68_do-a-10": {
      "a": 10,
      "b": 27,
      "c": 63,
      "d": 68
    },
    "93-86-73-97_do-b-19": {
      "a": 93,
      "b": 19,
      "c": 73,
      "d": 77
    },
    "58-107-47-87_do-c-6": {
      "a": 58,
      "b": 107,
      "c": 6,
      "d": 87
    },
    "12-91-72-105_do-b-79": {
      "a": 12,
      "b": 79,
      "c": 72,
      "d": 64
    },
    "27-82-52-47_do-a-41": {
      "a": 41,
      "b": 82,
      "c": 52,
      "d": 47
    },
    "103-80-96-22_do-b-4": {
      "a": 103,
      "b": 4,
      "c": 96,
      "d": 53
    },
    "26-39-17-0_do-a-66": {
      "a": 66,
      "b": 39,
      "c": 17,
      "d": 0
    },
    "18-22-64-60_do-a-26": {
      "a": 26,
      "b": 22,
      "c": 64,
      "d": 60
    },
    "51-24-20-85_do-c-76": {
      "a": 51,
      "b": 24,
      "c": 76,
      "d": 85
    },
    "87-46-81-33_do-c-63": {
      "a": 87,
      "b": 46,
      "c": 63,
      "d": 33
    },
    "63-104-4-104_do-c-100": {
      "a": 63,
      "b": 104,
      "c": 100,
      "d": 104
    },
    "34-56-79-49_do-d-75": {
      "a": 34,
      "b": 56,
      "c": 79,
      "d": 75
    }
  }
}
===ATTEMPT-END===
