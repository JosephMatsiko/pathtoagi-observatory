#!/usr/bin/env node
// Anchor the record in time. Stamps the current git HEAD commit hash into the
// OpenTimestamps calendar network (free, Bitcoin-anchored), so pre-registration
// of forecasts and the ordering of revisions can be verified by strangers —
// honesty as a checkable property, not a claim.
//
// Proofs land in timestamps/<short>.ots with a manifest. A fresh proof is
// "pending" until the calendars aggregate into a Bitcoin block (hours); the
// upgrade pass promotes pending proofs on later runs.
import { execSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import OpenTimestamps from 'opentimestamps';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const TS_DIR = join(ROOT, 'timestamps');
const MANIFEST = join(TS_DIR, 'manifest.json');
mkdirSync(TS_DIR, { recursive: true });

const readManifest = () => {
  try { return JSON.parse(readFileSync(MANIFEST, 'utf8')); } catch { return []; }
};

const commit = execSync('git rev-parse HEAD', { cwd: ROOT }).toString().trim();
const short = commit.slice(0, 12);
const manifest = readManifest();

// Upgrade pass: try to promote pending proofs to Bitcoin-confirmed.
for (const entry of manifest.filter((e) => e.status === 'pending')) {
  try {
    const bytes = new Uint8Array(readFileSync(join(ROOT, entry.ots)));
    const detached = OpenTimestamps.DetachedTimestampFile.deserialize(bytes);
    const changed = await OpenTimestamps.upgrade(detached);
    if (changed) {
      writeFileSync(join(ROOT, entry.ots), Buffer.from(detached.serializeToBytes()));
      entry.status = 'confirmed';
      entry.confirmedAt = new Date().toISOString();
      console.log(`↑ upgraded ${entry.commit.slice(0, 12)} → confirmed`);
    }
  } catch { /* calendars unreachable or still pending — try next run */ }
}

if (manifest.some((e) => e.commit === commit)) {
  console.log(`= HEAD ${short} already stamped`);
} else {
  // The digest is sha256 over the ASCII commit hash. The commit hash itself
  // commits to the full tree and history, so anchoring it anchors the record.
  const digest = createHash('sha256').update(commit, 'utf8').digest();
  const detached = OpenTimestamps.DetachedTimestampFile.fromHash(
    new OpenTimestamps.Ops.OpSHA256(),
    digest,
  );
  await OpenTimestamps.stamp(detached);
  const otsRel = `timestamps/${short}.ots`;
  writeFileSync(join(ROOT, otsRel), Buffer.from(detached.serializeToBytes()));
  manifest.unshift({
    commit,
    digestOf: 'sha256(utf8 commit hash)',
    ots: otsRel,
    stampedAt: new Date().toISOString(),
    status: 'pending',
  });
  console.log(`✓ stamped HEAD ${short} → ${otsRel} (pending Bitcoin aggregation)`);
}

writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + '\n');
