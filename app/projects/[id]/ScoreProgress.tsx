"use client";

import { useMemo, useState } from "react";

type ProposalPoint = {
  id: string;
  score: number | null;
  status: string;
};

export function ScoreProgress({
  baseline,
  best,
  target,
  improvedPct,
  proposals,
}: {
  baseline: number;
  best: number;
  target: number;
  improvedPct: number;
  proposals: ProposalPoint[];
}) {
  const [open, setOpen] = useState(false);

  const stages = useMemo(() => {
    return [
      { label: "Baseline", value: baseline, kind: "baseline" as const },
      { label: "Current best", value: best, kind: "best" as const },
      { label: "Next target", value: target, kind: "target" as const },
    ];
  }, [baseline, best, target]);

  const allValues = useMemo(() => {
    const vals = [baseline, best, target];
    for (const p of proposals) if (p.score !== null) vals.push(p.score);
    return vals.filter((v) => Number.isFinite(v));
  }, [baseline, best, target, proposals]);

  const min = Math.min(...allValues);
  const max = Math.max(...allValues);
  const pad = (max - min || Math.abs(max) || 1) * 0.18;
  const lo = min - pad;
  const hi = max + pad;

  const fmt = (n: number) =>
    n.toLocaleString(undefined, { maximumFractionDigits: 4 });

  // Geometry
  const W = 640;
  const H = 200;
  const padX = 56;
  const padY = 28;
  const x = (i: number) =>
    padX + (i / (stages.length - 1)) * (W - padX * 2);
  const y = (v: number) =>
    padY + (1 - (v - lo) / (hi - lo || 1)) * (H - padY * 2);

  const linePath = stages
    .map((s, i) => `${i === 0 ? "M" : "L"} ${x(i)} ${y(s.value)}`)
    .join(" ");
  const solidPath = `M ${x(0)} ${y(stages[0].value)} L ${x(1)} ${y(stages[1].value)}`;
  const dashPath = `M ${x(1)} ${y(stages[1].value)} L ${x(2)} ${y(stages[2].value)}`;

  return (
    <div className="rounded-[var(--radius-md)] border border-[var(--color-line)] bg-[var(--color-bg-soft)]">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-[rgb(var(--ink)_/_0.02)]"
      >
        <span className="flex items-center gap-3">
          <MiniSpark baseline={baseline} best={best} target={target} />
          <span>
            <span className="block font-sans text-[15px] font-medium text-[var(--color-fg)]">
              Mining progress
            </span>
            <span className="mt-0.5 block font-mono text-[11px] text-[var(--color-fg-dim)]">
              baseline {fmt(baseline)} → best {fmt(best)}
              {improvedPct > 0 ? (
                <span className="text-[var(--color-cyan)]">
                  {" "}
                  · +{improvedPct.toLocaleString(undefined, { maximumFractionDigits: 2 })}%
                </span>
              ) : (
                <span> · at baseline</span>
              )}
            </span>
          </span>
        </span>
        <span
          className={`grid size-7 shrink-0 place-items-center rounded-sm border border-[var(--color-line-2)] text-[var(--color-fg-muted)] transition-transform ${
            open ? "rotate-180" : ""
          }`}
          aria-hidden="true"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M3 4.5 6 7.5 9 4.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>

      {open ? (
        <div className="border-t border-[var(--color-line)] p-5">
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="block h-auto w-full"
            role="img"
            aria-label="Score progression from baseline to current best to next target"
          >
            {/* gridlines */}
            {[0, 0.5, 1].map((t) => {
              const gy = padY + t * (H - padY * 2);
              return (
                <line
                  key={t}
                  x1={padX}
                  x2={W - padX}
                  y1={gy}
                  y2={gy}
                  style={{ stroke: "rgb(var(--ink) / 0.08)" }}
                  strokeWidth="1"
                />
              );
            })}

            {/* axis labels (y) */}
            <text
              x={padX - 10}
              y={y(hi) + 4}
              textAnchor="end"
              style={{ fill: "rgb(var(--ink) / 0.45)" }}
              fontFamily="var(--font-mono)"
              fontSize="10"
            >
              {fmt(hi)}
            </text>
            <text
              x={padX - 10}
              y={y(lo) + 4}
              textAnchor="end"
              style={{ fill: "rgb(var(--ink) / 0.45)" }}
              fontFamily="var(--font-mono)"
              fontSize="10"
            >
              {fmt(lo)}
            </text>

            {/* proposal markers */}
            {proposals.map((p, i) =>
              p.score === null ? null : (
                <circle
                  key={p.id}
                  cx={x(1) + 14 + i * 10}
                  cy={y(p.score)}
                  r="3"
                  style={{ fill: "rgb(0 167 181 / 0.55)" }}
                />
              ),
            )}

            {/* solid baseline→best, dashed best→target */}
            <path
              d={solidPath}
              fill="none"
              style={{ stroke: "var(--color-accent)" }}
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d={dashPath}
              fill="none"
              style={{ stroke: "rgb(240 197 0 / 0.9)" }}
              strokeWidth="2"
              strokeDasharray="5 5"
              strokeLinecap="round"
            />

            {/* stage points + labels */}
            {stages.map((s, i) => (
              <g key={s.label}>
                <circle
                  cx={x(i)}
                  cy={y(s.value)}
                  r="4.5"
                  style={{
                    fill:
                      s.kind === "best"
                        ? "var(--color-accent)"
                        : s.kind === "target"
                          ? "rgb(240 197 0 / 1)"
                          : "var(--color-bg-soft)",
                    stroke:
                      s.kind === "baseline"
                        ? "rgb(var(--ink) / 0.4)"
                        : "none",
                  }}
                  strokeWidth="1.5"
                />
                <text
                  x={x(i)}
                  y={H - 8}
                  textAnchor="middle"
                  style={{ fill: "rgb(var(--ink) / 0.55)" }}
                  fontFamily="var(--font-mono)"
                  fontSize="10"
                >
                  {s.label}
                </text>
                <text
                  x={x(i)}
                  y={y(s.value) - 12}
                  textAnchor="middle"
                  style={{ fill: "rgb(var(--ink) / 0.9)" }}
                  fontFamily="var(--font-mono)"
                  fontSize="11"
                  fontWeight="600"
                >
                  {fmt(s.value)}
                </text>
              </g>
            ))}
          </svg>

          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[11px] text-[var(--color-fg-dim)]">
            <Legend color="var(--color-accent)" label="Accepted frontier" />
            <Legend color="rgb(240 197 0)" label="Next target (threshold)" dashed />
            {proposals.some((p) => p.score !== null) ? (
              <Legend color="rgb(0 167 181)" label="In-review proposals" dot />
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function MiniSpark({
  baseline,
  best,
  target,
}: {
  baseline: number;
  best: number;
  target: number;
}) {
  const vals = [baseline, best, target];
  const lo = Math.min(...vals);
  const hi = Math.max(...vals);
  const y = (v: number) => 20 - ((v - lo) / (hi - lo || 1)) * 16 - 2;
  return (
    <svg width="44" height="24" viewBox="0 0 44 24" aria-hidden="true">
      <path
        d={`M 2 ${y(baseline)} L 22 ${y(best)}`}
        fill="none"
        style={{ stroke: "var(--color-accent)" }}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d={`M 22 ${y(best)} L 42 ${y(target)}`}
        fill="none"
        style={{ stroke: "rgb(240 197 0 / 0.9)" }}
        strokeWidth="2"
        strokeDasharray="3 3"
        strokeLinecap="round"
      />
      <circle cx="22" cy={y(best)} r="2.5" style={{ fill: "var(--color-accent)" }} />
    </svg>
  );
}

function Legend({
  color,
  label,
  dashed,
  dot,
}: {
  color: string;
  label: string;
  dashed?: boolean;
  dot?: boolean;
}) {
  return (
    <span className="inline-flex items-center gap-2">
      {dot ? (
        <span
          className="size-2 rounded-full"
          style={{ backgroundColor: color }}
        />
      ) : (
        <span
          className="inline-block h-0 w-4 border-t-2"
          style={{
            borderColor: color,
            borderStyle: dashed ? "dashed" : "solid",
          }}
        />
      )}
      {label}
    </span>
  );
}
