import { useEffect, useMemo, useRef, useState } from 'react';
import {
  CAPABILITY_AXES,
  FRONTIER_2026,
  HUMAN_REFERENCE,
  type CapabilityId,
} from '../data/capabilities';

const SIZE = 460;
const CENTER = SIZE / 2;
const RADIUS = 168;
const RINGS = [0.25, 0.5, 0.75, 1];

interface Point {
  x: number;
  y: number;
}

function polar(angle: number, r: number): Point {
  const a = angle - Math.PI / 2; // start at top, go clockwise
  return { x: CENTER + Math.cos(a) * r, y: CENTER + Math.sin(a) * r };
}

function polygon(values: number[], scale = 1): string {
  const step = (Math.PI * 2) / values.length;
  return values
    .map((v, i) => {
      const p = polar(step * i, RADIUS * v * scale);
      return `${p.x.toFixed(1)},${p.y.toFixed(1)}`;
    })
    .join(' ');
}

function useDrawIn(): number {
  const [t, setT] = useState(0);
  const raf = useRef<number>(0);
  useEffect(() => {
    const reduce = window.matchMedia?.(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    if (reduce) {
      setT(1);
      return;
    }
    const start = performance.now();
    const dur = 900;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / dur);
      // ease-out cubic
      setT(1 - Math.pow(1 - p, 3));
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, []);
  return t;
}

export default function Frontier() {
  const axes = CAPABILITY_AXES;
  const [active, setActive] = useState<CapabilityId | null>(null);
  const t = useDrawIn();

  const frontierVals = axes.map((a) => FRONTIER_2026[a.id]);
  const humanVals = axes.map((a) => HUMAN_REFERENCE[a.id]);
  const step = (Math.PI * 2) / axes.length;

  const activeAxis = useMemo(
    () => axes.find((a) => a.id === active) ?? null,
    [axes, active],
  );

  const mean =
    frontierVals.reduce((s, v) => s + v, 0) / frontierVals.length;

  return (
    <div className="grid gap-7 sm:grid-cols-[minmax(0,1fr)_16rem] sm:items-center">
      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="mx-auto w-full max-w-[460px]"
        role="img"
        aria-label="Capability frontier radar: the 2026 frontier estimate versus a human-competent reference across eight axes."
      >
        {RINGS.map((r) => (
          <circle
            key={r}
            cx={CENTER}
            cy={CENTER}
            r={RADIUS * r}
            fill="none"
            stroke="var(--color-line-soft)"
            strokeWidth={1}
          />
        ))}

        {axes.map((axis, i) => {
          const outer = polar(step * i, RADIUS);
          const label = polar(step * i, RADIUS + 27);
          const isActive = axis.id === active;
          return (
            <g key={axis.id}>
              <line
                x1={CENTER}
                y1={CENTER}
                x2={outer.x}
                y2={outer.y}
                stroke="var(--color-line-soft)"
                strokeWidth={1}
              />
              <text
                x={label.x}
                y={label.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={10.5}
                fontFamily="var(--font-mono)"
                letterSpacing="0.05em"
                fill={isActive ? axis.accent : 'var(--color-muted)'}
                style={{ cursor: 'pointer', transition: 'fill 140ms' }}
                onMouseEnter={() => setActive(axis.id)}
                onMouseLeave={() => setActive(null)}
              >
                {axis.short.toUpperCase()}
              </text>
            </g>
          );
        })}

        {/* human reference */}
        <polygon
          points={polygon(humanVals, t)}
          fill="none"
          stroke="var(--color-muted)"
          strokeWidth={1}
          strokeDasharray="3 5"
          opacity={0.6 * t}
        />

        {/* frontier */}
        <polygon
          points={polygon(frontierVals, t)}
          fill="var(--color-accent)"
          fillOpacity={0.13 * t}
          stroke="var(--color-accent)"
          strokeWidth={2}
        />

        {axes.map((axis, i) => {
          const p = polar(step * i, RADIUS * FRONTIER_2026[axis.id] * t);
          const isActive = axis.id === active;
          return (
            <circle
              key={axis.id}
              cx={p.x}
              cy={p.y}
              r={isActive ? 6 : 3.6}
              fill={axis.accent}
              stroke="var(--color-void)"
              strokeWidth={1.5}
              style={{ cursor: 'pointer', transition: 'r 140ms' }}
              onMouseEnter={() => setActive(axis.id)}
              onMouseLeave={() => setActive(null)}
            />
          );
        })}
      </svg>

      <div className="min-h-[10rem]">
        {activeAxis ? (
          <div
            className="surface p-4"
            style={{ borderColor: activeAxis.accent }}
          >
            <p className="eyebrow" style={{ color: activeAxis.accent }}>
              {activeAxis.label}
            </p>
            <p className="tabular mt-1 text-[2rem] leading-none">
              {FRONTIER_2026[activeAxis.id].toFixed(2)}
              <span className="text-sm" style={{ color: 'var(--color-faint)' }}>
                {' '}
                / 1.00
              </span>
            </p>
            <p className="mt-3 text-sm" style={{ color: 'var(--color-muted)' }}>
              {activeAxis.description}
            </p>
          </div>
        ) : (
          <div className="surface-quiet p-4">
            <p className="eyebrow">Frontier readout</p>
            <p className="tabular mt-1 text-[2rem] leading-none">
              {mean.toFixed(2)}
              <span className="text-sm" style={{ color: 'var(--color-faint)' }}>
                {' '}
                mean
              </span>
            </p>
            <p className="mt-3 text-sm" style={{ color: 'var(--color-muted)' }}>
              Solid: the 2026 frontier estimate. Dashed: a human-competent
              reference. Hover an axis to read it. The dents —{' '}
              <span style={{ color: 'var(--color-ink-dim)' }}>
                memory, world models, embodiment, creativity
              </span>{' '}
              — are the shape of <em>not yet</em>.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
