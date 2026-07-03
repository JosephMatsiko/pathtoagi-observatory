// The Visual Proving Ground — frame construction with no numbers, no math,
// no prerequisite. Three levels carry the exact ideas the numeric probes test:
//   1. induction — find the hidden rule from examples
//   2. the wrong-frame attractor — resist the obvious rule that is secretly wrong
//   3. underdetermination — recognize when the evidence genuinely can't decide,
//      and say so instead of guessing
// Every puzzle is a 3×3 grid of cells that light. Pure client-side. The point
// is that a child and a professor take the same test here — and it is the same
// test, in kind, that the frontier models fail on the hard (numeric) version.
import { useState } from 'react';

type Cell = 0 | 1 | 2; // 0 dark, 1 lit (accent), 2 pulse (second colour)
type Grid = Cell[][];

const A = 'var(--color-accent)';
const P = 'hsl(34 96% 60%)';
const D = 'var(--color-surface-2)';

function GridView({ g, size = 108, live = false }: { g: Grid; size?: number; live?: boolean }) {
  const gap = 6, n = 3, cell = (size - gap * (n - 1)) / n;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: 'block' }}>
      {g.map((row, r) =>
        row.map((c, k) => {
          const x = k * (cell + gap), y = r * (cell + gap);
          const fill = c === 1 ? A : c === 2 ? P : D;
          return (
            <rect
              key={`${r}-${k}`}
              x={x} y={y} width={cell} height={cell} rx={6}
              fill={fill}
              opacity={c === 0 ? 0.5 : 1}
              style={{
                transition: 'fill 0.35s ease, opacity 0.35s ease',
                filter: c !== 0 ? `drop-shadow(0 0 6px ${fill})` : 'none',
                animation: live && c === 2 ? 'vpg-pulse 1.1s ease-in-out infinite' : 'none',
              }}
            />
          );
        }),
      )}
    </svg>
  );
}

interface Level {
  id: string;
  title: string;
  teaches: string;
  shown: Grid[];
  question: string;
  options: { label: string; grid: Grid | null; correct: boolean; note?: string }[];
  reveal: string;
}

const g = (rows: string[]): Grid => rows.map((r) => [...r].map((c) => (c === 'o' ? 1 : c === 'x' ? 2 : 0) as Cell));

const LEVELS: Level[] = [
  {
    id: 'induction',
    title: 'Level 1 — Find the rule',
    teaches: 'The whole game in miniature: watch a few steps, work out the hidden rule, predict the next.',
    shown: [g(['ooo', '...', '...']), g(['...', 'ooo', '...']), g(['...', '...', 'ooo']), g(['ooo', '...', '...'])],
    question: 'The lit row sweeps downward and wraps back to the top. What comes next?',
    options: [
      { label: 'Middle row', grid: g(['...', 'ooo', '...']), correct: true },
      { label: 'Bottom row', grid: g(['...', '...', 'ooo']), correct: false },
      { label: 'All lit', grid: g(['ooo', 'ooo', 'ooo']), correct: false },
      { label: 'Empty', grid: g(['...', '...', '...']), correct: false },
    ],
    reveal: 'The rule was simply “the lit row moves down one, wrapping to the top.” You just did induction — inferring a rule from examples. Every level from here hides the rule a little better.',
  },
  {
    id: 'attractor',
    title: 'Level 2 — The trap',
    teaches: 'A rule that looks obvious — but is secretly wrong. This is the heart of frame construction: the frame everyone reaches for is the wrong one.',
    shown: [g(['x.o', '...', '...']), g(['..o', '...', '..o']), g(['...', '...', 'o.o']), g(['...', '...', 'o..']),
            g(['x.o', '...', '...']), g(['..o', '...', '..o']), g(['...', '...', 'o.o']), g(['...', '...', 'o..'])],
    question: 'A dot travels clockwise around the four corners. But look closely at the top-left corner across both loops. What is the ninth step?',
    options: [
      { label: 'Top-left, alone', grid: g(['o..', '...', '...']), correct: false, note: 'the obvious answer — pure rotation. It is the trap.' },
      { label: 'Top-left, and the centre lights', grid: g(['x.o', '.o.', '...']), correct: true, note: 'every time the dot lands top-left, the centre pulses — visible twice already.' },
      { label: 'Top-right', grid: g(['..o', '...', '...']), correct: false },
      { label: 'Bottom-left', grid: g(['...', '...', 'o..']), correct: false },
    ],
    reveal: 'The plausible rule — “the dot just rotates” — fits most of what you saw, and it is wrong. The real rule fires a centre pulse each time the dot returns to the top-left, and it did so twice in plain sight. A mind that locks onto the obvious frame predicts confidently and misses it. On the numeric version of exactly this trap, a frontier model did just that — scored zero, and reported that it had rejected the wrong frame while falling straight into it.',
  },
  {
    id: 'underdetermined',
    title: 'Level 3 — Not enough to know',
    teaches: 'Sometimes the honest answer is that the evidence cannot decide. Saying so — instead of guessing — is the discipline the whole instrument is built on.',
    shown: [g(['o..', '...', '...']), g(['..o', '...', '...'])],
    question: 'The dot went from top-left to top-right. What comes third?',
    options: [
      { label: 'Back to top-left (it reflects)', grid: g(['o..', '...', '...']), correct: false },
      { label: 'Bottom-right (it rotates)', grid: g(['...', '...', '..o']), correct: false },
      { label: 'There is not enough information — several rules fit', grid: null, correct: true, note: 'reflection, rotation, and “slide right” all match the two frames shown, and disagree on the third.' },
    ],
    reveal: 'Two frames are consistent with at least three different rules — reflect, rotate, slide — that diverge on the very next step. There is no way to know, and the correct move is to say so. This is a negative control: the failure it catches is confident guessing where the data does not warrant it. Both frontier minds passed the numeric version of this. Many people do not.',
  },
];

function LevelCard({ level, onGrade }: { level: Level; onGrade: (correct: boolean, choice: string) => void }) {
  const [choice, setChoice] = useState<number | null>(null);
  const [graded, setGraded] = useState(false);

  return (
    <div className="surface" style={{ padding: '1.6rem', borderRadius: 12 }}>
      <p className="eyebrow" style={{ color: A }}>{level.title}</p>
      <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem', marginTop: 8 }}>{level.teaches}</p>

      <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: 18, flexWrap: 'wrap' }}>
        {level.shown.map((grid, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <GridView g={grid} size={72} live />
            {i < level.shown.length - 1 && <span style={{ color: 'var(--color-faint)' }}>→</span>}
          </div>
        ))}
        <span style={{ color: 'var(--color-faint)' }}>→</span>
        <div style={{ width: 72, height: 72, border: '1px dashed var(--color-line)', borderRadius: 8, display: 'grid', placeItems: 'center', color: 'var(--color-faint)', fontSize: 28 }}>?</div>
      </div>

      <p style={{ color: 'var(--color-ink-dim)', fontSize: '0.9rem', marginTop: 18 }}>{level.question}</p>

      <div style={{ display: 'grid', gap: 12, marginTop: 14, gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))' }}>
        {level.options.map((opt, i) => {
          const selected = choice === i;
          const showState = graded && (selected || opt.correct);
          const border = !graded
            ? selected ? A : 'var(--color-line)'
            : opt.correct ? 'var(--color-affirm)' : selected ? 'var(--color-verdict)' : 'var(--color-line)';
          return (
            <button
              key={i}
              onClick={() => !graded && setChoice(i)}
              style={{
                background: 'var(--color-surface-2)', border: `1.5px solid ${border}`, borderRadius: 10,
                padding: '0.9rem', cursor: graded ? 'default' : 'pointer', textAlign: 'center',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, transition: 'border-color 0.2s',
              }}
            >
              {opt.grid ? <GridView g={opt.grid} size={72} /> : (
                <div style={{ width: 72, height: 72, display: 'grid', placeItems: 'center', color: 'var(--color-muted)', fontSize: 26 }}>?</div>
              )}
              <span style={{ fontSize: '0.78rem', color: 'var(--color-ink-dim)' }}>{opt.label}</span>
              {showState && opt.note && (
                <span style={{ fontSize: '0.68rem', color: opt.correct ? 'var(--color-affirm)' : 'var(--color-muted)' }}>{opt.note}</span>
              )}
            </button>
          );
        })}
      </div>

      {!graded ? (
        <button
          disabled={choice === null}
          onClick={() => { setGraded(true); onGrade(!!level.options[choice!]?.correct, level.options[choice!]?.label ?? ''); }}
          style={{ marginTop: 18, background: choice === null ? 'var(--color-surface-2)' : A, color: choice === null ? 'var(--color-faint)' : '#08252a', border: 'none', borderRadius: 8, padding: '0.6rem 1.2rem', fontWeight: 600, cursor: choice === null ? 'default' : 'pointer' }}
        >
          Lock in my answer
        </button>
      ) : (
        <div style={{ marginTop: 16, background: 'var(--color-surface-2)', borderRadius: 8, padding: '1rem' }}>
          <p style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.7rem', color: level.options[choice!]?.correct ? 'var(--color-affirm)' : 'var(--color-verdict)' }}>
            {level.options[choice!]?.correct ? '✓ CORRECT' : '✗ NOT QUITE'}
          </p>
          <p style={{ color: 'var(--color-ink-dim)', fontSize: '0.85rem', marginTop: 8 }}>{level.reveal}</p>
        </div>
      )}
    </div>
  );
}

const BACKGROUNDS = [
  'no maths background',
  'some maths (school level)',
  'maths / science / engineering background',
  'prefer not to say',
];

export default function VisualProvingGround() {
  const [results, setResults] = useState<Record<string, { correct: boolean; choice: string }>>({});
  const [startedAt] = useState(() => Date.now());
  const [background, setBackground] = useState<string>('');
  const [sendState, setSendState] = useState<'idle' | 'sending' | 'sent' | 'failed'>('idle');
  const done = Object.keys(results).length;
  const right = Object.values(results).filter((r) => r.correct).length;

  const contribute = async () => {
    setSendState('sending');
    const attempt = {
      baselineTier: 'visual',
      submittedAt: new Date().toISOString(),
      secondsTaken: Math.round((Date.now() - startedAt) / 1000),
      background: background || 'not stated',
      score: `${right}/${LEVELS.length}`,
      levels: Object.fromEntries(LEVELS.map((l) => [l.id, results[l.id] ?? null])),
    };
    const body = new URLSearchParams({ 'form-name': 'human-baseline-visual', attempt: JSON.stringify(attempt) });
    try {
      const r = await fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: body.toString() });
      setSendState(r.ok ? 'sent' : 'failed');
    } catch {
      setSendState('failed');
    }
  };

  return (
    <div style={{ display: 'grid', gap: 20 }}>
      <style>{`@keyframes vpg-pulse { 0%,100% { opacity: 1 } 50% { opacity: 0.45 } }`}</style>
      {LEVELS.map((lvl) => (
        <LevelCard key={lvl.id} level={lvl} onGrade={(correct, choice) => setResults((p) => ({ ...p, [lvl.id]: { correct, choice } }))} />
      ))}
      {done === LEVELS.length && (
        <div className="surface-quiet" style={{ padding: '1.4rem', borderRadius: 10 }}>
          <p className="eyebrow">You finished the visual test · {right}/{LEVELS.length}</p>
          <p style={{ color: 'var(--color-ink-dim)', fontSize: '0.9rem', marginTop: 8 }}>
            You just did — in pictures — what the frontier models do in numbers: infer a hidden rule, resist a
            plausible-but-wrong one, and refuse to guess when the evidence can’t decide. The operating question is
            whether a machine can do the <em>hard</em> version, on a world no one has ever seen, without being told
            what to look for. The record says: not yet.
          </p>
          {sendState !== 'sent' ? (
            <div style={{ marginTop: 16, borderTop: '1px solid var(--color-line)', paddingTop: 16 }}>
              <p style={{ color: 'var(--color-ink-dim)', fontSize: '0.85rem' }}>
                <strong>This result is already a real baseline.</strong> The verdict cannot use any machine score
                until enough humans have taken the same test (gate OG-9). One click adds yours — anonymous, no
                account, and this visual tier counts on its own; you never have to touch the numbers below.
              </p>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 12, alignItems: 'center' }}>
                <select
                  value={background}
                  onChange={(e) => setBackground(e.target.value)}
                  style={{ background: 'var(--color-surface-2)', color: 'var(--color-ink-dim)', border: '1px solid var(--color-line)', borderRadius: 8, padding: '0.55rem 0.7rem', fontSize: '0.8rem' }}
                >
                  <option value="">optional: your background…</option>
                  {BACKGROUNDS.map((b) => <option key={b} value={b}>{b}</option>)}
                </select>
                <button
                  onClick={contribute}
                  disabled={sendState === 'sending'}
                  style={{ background: A, color: '#08252a', border: 'none', borderRadius: 8, padding: '0.6rem 1.2rem', fontWeight: 600, cursor: 'pointer' }}
                >
                  {sendState === 'sending' ? 'contributing…' : 'Contribute my result to the baseline'}
                </button>
              </div>
              {sendState === 'failed' && (
                <p style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.7rem', color: 'var(--color-verdict)', marginTop: 10 }}>
                  Submission failed (the form service may not be live in this preview). Your result was not recorded.
                </p>
              )}
            </div>
          ) : (
            <p style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.75rem', color: 'var(--color-affirm)', marginTop: 14 }}>
              ✓ Recorded. Your anonymous result joins the human baseline the verdict is waiting for. If you want more,
              the numeric worlds below are the hard version — entirely optional.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
