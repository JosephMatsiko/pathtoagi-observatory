// The Proving Ground — the Observatory's playable surface, and its
// human-baseline collector. Levels 1–2 are REVEALED worlds (instant,
// client-side grading against the published laws — practice). Level 3 is the
// LIVE sealed world-003: no instant grade is possible because the law is
// sealed; a submitted attempt becomes genuine human-baseline data for the
// pending run bundle (verdict gate OG-9). Motion and feedback carry meaning;
// nothing here inflates a result the record wouldn't honor.
import { useState } from 'react';
import gameData from '../data/game/proving-ground.json';

const S = {
  card: { background: 'var(--color-surface)', border: '1px solid var(--color-line)', borderRadius: 12, padding: '1.5rem' } as const,
  quiet: { background: 'var(--color-surface-2)', borderRadius: 8, padding: '0.9rem 1rem' } as const,
  mono: { fontFamily: 'var(--font-mono, monospace)', fontSize: '0.75rem' } as const,
  btn: { background: 'var(--color-accent)', color: '#08252a', border: 'none', borderRadius: 8, padding: '0.6rem 1.1rem', fontWeight: 600, cursor: 'pointer' } as const,
  ghost: { background: 'transparent', color: 'var(--color-accent)', border: '1px solid var(--color-line)', borderRadius: 8, padding: '0.55rem 1rem', cursor: 'pointer' } as const,
  input: { background: 'var(--color-surface-2)', border: '1px solid var(--color-line)', borderRadius: 6, color: 'var(--color-ink)', padding: '0.4rem 0.6rem', width: 72, fontFamily: 'var(--font-mono, monospace)' } as const,
  good: { color: 'var(--color-affirm)' } as const,
  bad: { color: 'var(--color-verdict)' } as const,
  dim: { color: 'var(--color-muted)' } as const,
};

// ── Level 1: the calibration test (world-006, revealed) ──────────────────────
function LevelOne({ onDone }: { onDone: (score: string) => void }) {
  const systems = gameData.l1 as { id: string; shown: number[][]; query: number; laws: string[]; values: number[] }[];
  const [answers, setAnswers] = useState<Record<string, { flag: boolean; value: string }>>({});
  const [graded, setGraded] = useState(false);

  const grade = () => {
    setGraded(true);
    const correct = systems.filter((s) => answers[s.id]?.flag).length;
    onDone(`${correct}/${systems.length} correctly flagged as underdetermined`);
  };

  return (
    <div style={S.card}>
      <p className="eyebrow">Level 1 · The calibration test · world-006 (revealed — practice)</p>
      <p style={{ ...S.dim, marginTop: 8, fontSize: '0.9rem' }}>
        Each mini-system shows input→output pairs of an unknown integer function, then asks for a new value.
        The real test: <em>does the data even determine a unique answer?</em> Both frontier minds got all
        three right — by refusing to guess. Your move.
      </p>
      <div style={{ display: 'grid', gap: 12, marginTop: 16 }}>
        {systems.map((s) => {
          const a = answers[s.id] ?? { flag: false, value: '' };
          const set = (patch: Partial<typeof a>) => setAnswers({ ...answers, [s.id]: { ...a, ...patch } });
          return (
            <div key={s.id} style={S.quiet}>
              <span style={{ ...S.mono, color: 'var(--color-accent)' }}>{s.id}</span>
              <span style={{ ...S.mono, marginLeft: 12, color: 'var(--color-ink-dim)' }}>
                {s.shown.map(([x, y]) => `f(${x})=${y}`).join('   ')}   →   f({s.query}) = ?
              </span>
              <div style={{ marginTop: 10, display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap' }}>
                <input style={S.input} placeholder="value" disabled={graded || a.flag} value={a.value}
                  onChange={(e) => set({ value: e.target.value })} />
                <label style={{ ...S.mono, color: 'var(--color-muted)', cursor: 'pointer' }}>
                  <input type="checkbox" disabled={graded} checked={a.flag}
                    onChange={(e) => set({ flag: e.target.checked, value: '' })} />{' '}
                  not enough information to answer
                </label>
                {graded && (
                  <span style={{ ...S.mono, ...(a.flag ? S.good : S.bad) }}>
                    {a.flag
                      ? '✓ correct — genuinely underdetermined'
                      : `✗ trap: both ${s.laws[0]} and ${s.laws[1]} fit every pair — giving ${s.values[0]} vs ${s.values[1]}`}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {!graded && <button style={{ ...S.btn, marginTop: 16 }} onClick={grade}>Grade me</button>}
      {graded && (
        <p style={{ ...S.dim, marginTop: 14, fontSize: '0.85rem' }}>
          Every system here was <em>verified at generation</em> to admit at least two laws that disagree at the
          query. Confidently asserting one is the failure mode this probe exists to catch — in machines and in us.
        </p>
      )}
    </div>
  );
}

// ── Level 2: the trap (world-005, revealed) ──────────────────────────────────
function LevelTwo({ onDone }: { onDone: (score: string) => void }) {
  const { publicSamples, chosen, lawText, trapText } = gameData.l2 as any;
  const [preds, setPreds] = useState<Record<string, { x: string; y: string }>>({});
  const [graded, setGraded] = useState(false);

  const grade = () => {
    setGraded(true);
    const correct = chosen.filter((c: any) => {
      const p = preds[c.key];
      return p && Number(p.x) === c.truth[0] && Number(p.y) === c.truth[1];
    }).length;
    onDone(`${correct}/${chosen.length} held-out states exact`);
  };

  return (
    <div style={S.card}>
      <p className="eyebrow">Level 2 · The trap · world-005 (revealed — practice)</p>
      <p style={{ ...S.dim, marginTop: 8, fontSize: '0.9rem' }}>
        A deterministic system over pairs [x, y]. Here are the public samples from one trajectory — sparse on
        purpose. Predict the missing steps. Fair warning: when this ran live, GPT-5.5 found a rule that fit
        “most” rows, noticed it broke on one, and refused to guess. It scored 0 — and that refusal was still
        the most honest answer available without the true rule.
      </p>
      <div style={{ ...S.quiet, marginTop: 14, overflowX: 'auto' }}>
        <span style={{ ...S.mono, color: 'var(--color-ink-dim)' }}>
          {publicSamples.map((s: any) => `s${s.step}:[${s.state.join(',')}]`).join('  ')}
        </span>
      </div>
      <div style={{ display: 'grid', gap: 10, marginTop: 14 }}>
        {chosen.map((c: any) => {
          const p = preds[c.key] ?? { x: '', y: '' };
          const set = (patch: Partial<typeof p>) => setPreds({ ...preds, [c.key]: { ...p, ...patch } });
          const right = graded && Number(p.x) === c.truth[0] && Number(p.y) === c.truth[1];
          return (
            <div key={c.key} style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{ ...S.mono, color: 'var(--color-accent)', width: 60 }}>{c.key}</span>
              <input style={S.input} placeholder="x" disabled={graded} value={p.x} onChange={(e) => set({ x: e.target.value })} />
              <input style={S.input} placeholder="y" disabled={graded} value={p.y} onChange={(e) => set({ y: e.target.value })} />
              {graded && (
                <span style={{ ...S.mono, ...(right ? S.good : S.bad) }}>
                  {right ? '✓ exact' : `✗ truth: [${c.truth.join(', ')}]`}
                </span>
              )}
            </div>
          );
        })}
      </div>
      {!graded && <button style={{ ...S.btn, marginTop: 16 }} onClick={grade}>Grade me</button>}
      {graded && (
        <div style={{ ...S.quiet, marginTop: 14 }}>
          <p style={{ ...S.mono, color: 'var(--color-accent)' }}>THE REVEALED LAW</p>
          <p style={{ ...S.dim, fontSize: '0.85rem', marginTop: 6 }}>{lawText}</p>
          <p style={{ ...S.dim, fontSize: '0.85rem', marginTop: 6 }}>{trapText}</p>
        </div>
      )}
    </div>
  );
}

// ── Level 3: the live sealed world (world-003 — this one counts) ─────────────
function LevelThree() {
  const { samples, negativeControl, chosenKeys } = gameData.l3 as any;
  const [preds, setPreds] = useState<Record<string, { x: string; y: string }>>({});
  const [ncAnswer, setNcAnswer] = useState<'' | 'predictable' | 'underdetermined'>('');
  const [frame, setFrame] = useState('');
  const [background, setBackground] = useState('');
  const [state, setState] = useState<'editing' | 'sending' | 'sent' | 'error'>('editing');

  const submit = async () => {
    setState('sending');
    const attempt = {
      worldId: 'world-003',
      lane: 'human-baseline',
      submittedAt: new Date().toISOString(),
      frame,
      predictions: Object.fromEntries(chosenKeys.map((k: string) => [k, [Number(preds[k]?.x ?? NaN), Number(preds[k]?.y ?? NaN)]])),
      negativeControl: ncAnswer,
      background,
      toolsUsed: 'none-declared',
    };
    const body = new URLSearchParams({ 'form-name': 'human-baseline-world-003', attempt: JSON.stringify(attempt) });
    try {
      const r = await fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: body.toString() });
      setState(r.ok ? 'sent' : 'error');
    } catch {
      setState('error');
    }
  };

  return (
    <div style={{ ...S.card, borderColor: 'color-mix(in oklab, var(--color-accent) 40%, var(--color-line))' }}>
      <p className="eyebrow" style={{ color: 'var(--color-accent)' }}>
        Level 3 · The live world · world-003 (SEALED — this one counts)
      </p>
      <p style={{ ...S.dim, marginTop: 8, fontSize: '0.9rem' }}>
        This world's law is sealed — its hash is public, its answer is not, and nobody grading you knows it
        either. Your attempt becomes real <strong>human-baseline data</strong> for the pending run bundle
        (verdict gate OG-9): when the seal opens, human and machine attempts are graded together, by the same
        mechanical grader. No account, no name required. Honest struggle is exactly the data we need.
      </p>
      <div style={{ ...S.quiet, marginTop: 14, maxHeight: 180, overflow: 'auto' }}>
        {samples.map((t: any) => (
          <div key={t.trajectory} style={{ ...S.mono, color: 'var(--color-ink-dim)', marginBottom: 6 }}>
            t{t.trajectory}: {t.samples.map((s: any) => `s${s.step}:[${s.state.join(',')}]`).join('  ')}
          </div>
        ))}
      </div>

      <p style={{ ...S.mono, marginTop: 16, color: 'var(--color-muted)' }}>YOUR RULE (in words — what do you think governs this system?)</p>
      <textarea
        style={{ ...S.input, width: '100%', minHeight: 64, marginTop: 6 }}
        disabled={state !== 'editing'}
        value={frame}
        onChange={(e) => setFrame(e.target.value)}
        placeholder="e.g. each step multiplies x by … and adds …, except when …"
      />

      <p style={{ ...S.mono, marginTop: 14, color: 'var(--color-muted)' }}>PREDICT SIX HELD-OUT STATES</p>
      <div style={{ display: 'grid', gap: 8, marginTop: 8 }}>
        {chosenKeys.map((k: string) => {
          const p = preds[k] ?? { x: '', y: '' };
          const set = (patch: Partial<typeof p>) => setPreds({ ...preds, [k]: { ...p, ...patch } });
          return (
            <div key={k} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <span style={{ ...S.mono, color: 'var(--color-accent)', width: 78 }}>{k}</span>
              <input style={S.input} placeholder="x" disabled={state !== 'editing'} value={p.x} onChange={(e) => set({ x: e.target.value })} />
              <input style={S.input} placeholder="y" disabled={state !== 'editing'} value={p.y} onChange={(e) => set({ y: e.target.value })} />
            </div>
          );
        })}
      </div>

      <p style={{ ...S.mono, marginTop: 16, color: 'var(--color-muted)' }}>THE NEGATIVE-CONTROL LANE</p>
      <div style={{ ...S.quiet, marginTop: 6, ...S.mono, color: 'var(--color-ink-dim)', maxHeight: 90, overflow: 'auto' }}>
        {JSON.stringify(negativeControl).slice(0, 400)}…
      </div>
      <div style={{ marginTop: 8, display: 'flex', gap: 16 }}>
        {(['predictable', 'underdetermined'] as const).map((opt) => (
          <label key={opt} style={{ ...S.mono, color: 'var(--color-muted)', cursor: 'pointer' }}>
            <input type="radio" name="nc" disabled={state !== 'editing'} checked={ncAnswer === opt} onChange={() => setNcAnswer(opt)} />{' '}
            {opt === 'predictable' ? 'exact prediction is justified' : 'underdetermined — refusing to guess'}
          </label>
        ))}
      </div>

      <p style={{ ...S.mono, marginTop: 14, color: 'var(--color-muted)' }}>OPTIONAL: YOUR BACKGROUND (for baseline stratification only)</p>
      <input
        style={{ ...S.input, width: '100%', marginTop: 6 }}
        disabled={state !== 'editing'}
        value={background}
        onChange={(e) => setBackground(e.target.value)}
        placeholder="e.g. software engineer / math undergrad / no technical background"
      />

      {state === 'editing' && (
        <button style={{ ...S.btn, marginTop: 18 }} onClick={submit} disabled={!frame && !ncAnswer}>
          Submit my attempt to the record
        </button>
      )}
      {state === 'sending' && <p style={{ ...S.mono, marginTop: 16, ...S.dim }}>submitting…</p>}
      {state === 'sent' && (
        <p style={{ marginTop: 16, ...S.good, fontSize: '0.9rem' }}>
          ✓ Received. Your attempt joins the human-baseline pool for world-003. When the seal opens, it will be
          graded by the same mechanical grader as the machine attempts — and the comparison published, either way.
        </p>
      )}
      {state === 'error' && (
        <p style={{ marginTop: 16, ...S.bad, fontSize: '0.9rem' }}>
          Submission failed (the form service may not be live in this preview). Your attempt was not recorded.
        </p>
      )}
    </div>
  );
}

export default function ProvingGround() {
  const [scores, setScores] = useState<Record<string, string>>({});
  return (
    <div style={{ display: 'grid', gap: 20 }}>
      <LevelOne onDone={(s) => setScores((p) => ({ ...p, l1: s }))} />
      <LevelTwo onDone={(s) => setScores((p) => ({ ...p, l2: s }))} />
      <LevelThree />
      {(scores.l1 || scores.l2) && (
        <div style={{ ...S.quiet, display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          <span style={{ ...S.mono, color: 'var(--color-muted)' }}>YOUR PRACTICE RECORD</span>
          {scores.l1 && <span style={{ ...S.mono, color: 'var(--color-ink-dim)' }}>calibration: {scores.l1}</span>}
          {scores.l2 && <span style={{ ...S.mono, color: 'var(--color-ink-dim)' }}>the trap: {scores.l2}</span>}
        </div>
      )}
    </div>
  );
}
