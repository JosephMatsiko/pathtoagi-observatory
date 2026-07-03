# Key request — world-003 reveal key

**Status: BLOCKING grading of world-003.**

The world-003 run bundle (`fcs-world-003-2026-07-02`) was sealed by the
parallel Codex/GPT-5.5 session on 2026-07-02. Per its own generator
(`scripts/fcs-synth/generate-world-003.mjs`, usage line
`generate-world-003.mjs <keyfile-out (OFF-repo)>`) and receipts
(`public/runs/fcs-world-003-2026-07-02/06_receipts.json`: *"The reveal key is
intentionally absent from this manifest"*), the AES-256 reveal key was written
to an off-repository path chosen by that session and is **not on this machine**
under any searched location.

Model attempts are now anchored (GPT-5.5 full envelope; Claude no-attempt,
usage-capped) and human-baseline collection is live at `/play/`. But the
mechanical grader cannot run without the key, so world-003 remains
`attempts-anchored`, verdict impact none, **grading-blocked**.

## To unblock (any one)

1. **Supply the key.** Place the hex key at
   `observatory-command/runs/fcs-synth-world-003.key` (gitignored) and run
   `node scripts/fcs-synth/grade-world-003.mjs <keyfile>`. The grader verifies
   `sha256(decrypt(law.enc))` against `SEAL.md` before grading, so a wrong key
   fails safely.
2. **Ask Codex.** If the registering Codex session persisted the key, retrieve
   it and do (1).
3. **Accept it as permanently sealed.** If the key is genuinely lost, world-003
   stays an honest, anchored, ungradeable artifact — the attempts still precede
   any hypothetical reveal, and world-005/006 (this session's hardened probes)
   carry the gradeable evidence instead. This is not a failure; it is the
   record refusing to invent a grade it cannot compute.
