#!/usr/bin/env bash
# Verify the Observatory's record without trusting its operator.
# Usage: bash scripts/verify.sh   (from a clone; requires node + npm i)
set -uo pipefail
cd "$(dirname "$0")/.."
FAIL=0

echo "── 1. Conformance gates (deterministic, offline)"
npm run --silent check:record || FAIL=1
npm run --silent check:timestamps || FAIL=1

echo
echo "── 2. Timestamp anchors vs commit history"
node - <<'EOF' || FAIL=1
const { execSync } = require('child_process');
const { readFileSync } = require('fs');
let manifest;
try { manifest = JSON.parse(readFileSync('timestamps/manifest.json', 'utf8')); }
catch { console.log('  no manifest — record unanchored'); process.exit(1); }
let bad = 0;
for (const e of manifest) {
  try {
    execSync(`git cat-file -e ${e.commit}`, { stdio: 'ignore' });
    console.log(`  ✓ anchored commit ${e.commit.slice(0, 12)} exists in history (${e.status})`);
  } catch {
    console.log(`  ✗ anchored commit ${e.commit.slice(0, 12)} NOT in history`);
    bad++;
  }
}
console.log(`  ${manifest.length - bad}/${manifest.length} anchors match history.`);
console.log('  Full Bitcoin verification: install opentimestamps-client and run `ots verify` on each .ots against its digest.');
process.exit(bad ? 1 : 0);
EOF

echo
echo "── 3. Release signatures"
if git log --show-signature -1 2>&1 | grep -q "Good.*signature"; then
  echo "  ✓ HEAD carries a good signature (checked against .allowed_signers)"
else
  echo "  ⚠ HEAD signature not verifiable here — check .allowed_signers is configured:"
  echo "    git config gpg.ssh.allowedSignersFile \"\$(pwd)/.allowed_signers\""
fi

echo
if [ "$FAIL" -eq 0 ]; then echo "✓ verify: the record checks out"; else echo "✗ verify: FAILURES above"; exit 1; fi
