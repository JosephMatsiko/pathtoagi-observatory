#!/usr/bin/env node
// Autonomous window-closer — the end of the probe lifecycle, mechanized.
//
// Before this script existed, sealed worlds had no autonomous path from
// "attempts anchored" to "revealed and graded": a mind had to decide to close
// the window. Now the close date is PRE-REGISTERED on the record (in the run
// bundle's attemptWindowCloses field, published before any result is known),
// and when it arrives the Command Center runs this script. Everything it does
// is mechanical: reveal with the off-repo key, verify the seal, run the pinned
// grader, update the run bundle from GRADING.json fields (no narration
// invented), append a templated revision entry, sync, gate, build, commit,
// anchor, push, deploy. No model and no human decides anything here.
//
// Usage: node scripts/close-world-window.mjs <world-id> <keyfile>
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const [worldId, keyFile] = process.argv.slice(2);
if (!worldId || !keyFile) { console.error('usage: close-world-window.mjs <world-id> <keyfile>'); process.exit(1); }
const run = (cmd, args, opts = {}) => execFileSync(cmd, args, { cwd: ROOT, stdio: 'inherit', ...opts });

const expDir = join(ROOT, 'experiments', `fcs-synth-${worldId}`);
if (existsSync(join(expDir, 'REVEAL.md'))) { console.error(`${worldId}: already revealed — nothing to do`); process.exit(0); }
const graderPath = join(ROOT, 'scripts', 'fcs-synth', `grade-${worldId}.mjs`);
if (!existsSync(graderPath)) { console.error(`${worldId}: no pinned grader at ${graderPath}`); process.exit(1); }

// 1. Reveal + grade (the grader verifies the seal before anything else).
run('node', [graderPath, keyFile]);
const grading = JSON.parse(readFileSync(join(expDir, 'GRADING.json'), 'utf8'));
const scored = grading.results.filter((r) => r.status === 'scored');

// 2. Update the run bundle mechanically from GRADING.json — numbers only,
// no invented narrative.
const bundlesPath = join(ROOT, 'src', 'data', 'run-bundles.json');
const bundles = JSON.parse(readFileSync(bundlesPath, 'utf8'));
const bundle = bundles.find((b) => b.experimentPath?.endsWith(`fcs-synth-${worldId}`));
if (!bundle) { console.error(`${worldId}: no run bundle found`); process.exit(1); }
const summarize = (r) => {
  const total = r.predictionsTotal ?? '?';
  const full = r.probesFullyCorrect ?? r.predictionsCorrect ?? '?';
  return `${r.attempt}: ${full}/${total} fully-correct probes`;
};
bundle.status = 'graded';
bundle.evidenceLevel = `graded mechanically at window close: ${scored.map(summarize).join(' · ')}`;
bundle.pending = (bundle.pending ?? []).filter((p) => !/reveal|window/i.test(p));
bundle.summary += ` WINDOW CLOSED (${new Date().toISOString().slice(0, 10)}, autonomous): the pre-registered attempt window ended; the world was revealed and graded mechanically by the pinned grader with no mind in the path. Scores: ${scored.map(summarize).join('; ')}. Full GRADING.json and REVEAL.md are published in the experiment directory.`;
writeFileSync(bundlesPath, JSON.stringify(bundles, null, 2) + '\n');

// 3. Templated revision entry — states only mechanical facts.
const revPath = join(ROOT, 'src', 'data', 'revisions.json');
const revs = JSON.parse(readFileSync(revPath, 'utf8'));
revs.unshift({
  date: new Date().toISOString().slice(0, 10),
  kind: 'record',
  title: `${worldId} window closed autonomously: revealed and graded with no mind in the path`,
  detail: `The pre-registered attempt window for ${worldId} ended and the Command Center executed the mechanical close: seal verified, world revealed, pinned grader run. Results, stated as numbers only: ${scored.map(summarize).join('; ')}. Interpretation is deliberately absent from this entry — it is written by a script, and a script does not editorialize; the mesh may add bounded interpretation in a later cycle if the evidence warrants it. Artifacts: experiments/fcs-synth-${worldId}/REVEAL.md and GRADING.json, hashes now part of the anchored release.`,
});
writeFileSync(revPath, JSON.stringify(revs, null, 2) + '\n');

// 3b. Templated MECHANICAL evidence entry — numbers from GRADING.json only.
// Interpretation, capability-ladder classification, and likelihoods are
// deliberately absent: a script records facts; the mesh may add bounded
// interpretation in a later cycle. healthΔ 0 by construction.
const evPath = join(ROOT, 'src', 'data', 'evidence.json');
const evidence = JSON.parse(readFileSync(evPath, 'utf8'));
const evId = `cce-${new Date().toISOString().slice(0, 10)}-${worldId}-window-close`;
if (!evidence.some((e) => e.id === evId)) {
  evidence.unshift({
    id: evId,
    observedAt: new Date().toISOString().slice(0, 10),
    source: `Observatory FCS-synth ${worldId} — autonomous window close: revealed and graded mechanically by the pinned grader, no mind in the path`,
    sourceUrl: `https://pathtoagi-observatory.netlify.app/experiments/fcs-synth-${worldId}/`,
    class: 'falsifier-review',
    theories: ['architectural-gap', 'scaling-sufficient', 'scaling-plus-rl'],
    signal: `Pre-registered attempt window closed on schedule. Mechanical results, numbers only: ${scored.map(summarize).join('; ')}. Declared structures and full envelopes are published verbatim in the attempts directory; REVEAL.md and GRADING.json establish grading truth.`,
    implication: 'None asserted here. This entry was written by the autonomous window-close script, which records mechanical facts and does not editorialize; a mesh cycle may add bounded interpretation under evidence discipline if warranted.',
    bounded: 'Machine-written at window close. Scores are exact-match held-out grading against the sealed law; whether any attempt was first-party or external, hinted or clean, is stated in each attempt file and is not summarized here. healthΔ 0; the verdict is unmoved by construction.',
    nextNeeded: 'A mesh cycle to classify capability level and, if warranted, per-theory likelihoods within pinned bounds; external re-derivation of the grading (the refutation channel stands open).',
    healthDelta: 0,
  });
  writeFileSync(evPath, JSON.stringify(evidence, null, 2) + '\n');
}

// 4. Sync, gate, build, commit, anchor, push, deploy.
run('node', ['scripts/sync-public-experiments.mjs']);
run('node', ['scripts/check-record.mjs']);
run('npm', ['run', 'build']);
run('git', ['add', '-A']);
run('git', ['commit', '-S', '-m', `${worldId}: window closed autonomously — revealed and graded mechanically`]);
run('node', ['scripts/timestamp-record.mjs']);
run('git', ['add', '-A']);
run('git', ['commit', '-S', '-m', `chore: anchor ${worldId} window-close [skip-deploy]`]);
run('git', ['push', 'origin', 'main']);
run('npm', ['run', 'deploy']);
console.log(`✓ ${worldId}: window closed end-to-end (reveal → grade → record → anchor → deploy), mechanically.`);
