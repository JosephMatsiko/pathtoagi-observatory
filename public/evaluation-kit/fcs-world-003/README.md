# Evaluation Kit — fcs-world-003-2026-07-02

This kit points to the public World-003 registered run bundle.

## Fresh Checkout Path

```sh
git clone https://github.com/JosephMatsiko/pathtoagi-observatory.git
cd pathtoagi-observatory
npm install
npm run check:record
node scripts/fcs-synth/grade-world-003.mjs <revealed-keyfile>
```

The grading command is intentionally unusable before reveal because the key is held off-repository.

## Public Inputs

- `/runs/fcs-world-003-2026-07-02/00_manifest.json`
- `/runs/fcs-world-003-2026-07-02/01_protocol.md`
- `/runs/fcs-world-003-2026-07-02/02_prompt.md`
- `/runs/fcs-world-003-2026-07-02/03_human_baseline.md`
- `/runs/fcs-world-003-2026-07-02/04_independent_scoring.md`
- `/runs/fcs-world-003-2026-07-02/05_attempt_template.json`
- `experiments/fcs-synth-world-003/observations.json`
- `experiments/fcs-synth-world-003/SEAL.md`
- `experiments/fcs-synth-world-003/law.enc`

No result should be cited until attempts, reveal, grading, human baseline, and independent scoring are all present.
