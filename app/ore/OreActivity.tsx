import activity from "./activity.json";

const WEEKS = 16;
const WINDOW_DAYS = 30;
const DAY_MS = 86_400_000;
const counts: Record<string, number> = activity.days;

// Empty, then four steps of ORE amber, like GitHub's contribution graph.
const levelClass = [
  "bg-[rgb(var(--ink)_/_0.07)]",
  "bg-[rgb(245_158_11_/_0.3)]",
  "bg-[rgb(245_158_11_/_0.52)]",
  "bg-[rgb(245_158_11_/_0.76)]",
  "bg-[#f59e0b]",
];

function level(count: number) {
  if (count === 0) return 0;
  if (count < 5) return 1;
  if (count < 10) return 2;
  if (count < 18) return 3;
  return 4;
}

const dayKey = (time: number) => new Date(time).toISOString().slice(0, 10);
const monthName = (time: number) =>
  new Date(time).toLocaleString("en-US", { month: "short", timeZone: "UTC" });

/**
 * A GitHub-style commit heatmap for the ORE repository. The counts are a
 * dated snapshot (activity.json) because the repository is private and the
 * site cannot read it at build time; the card says when it was taken.
 */
export function OreActivity() {
  const end = Date.parse(`${activity.updated}T00:00:00Z`);
  // Columns are Sunday-first weeks; the last column holds the snapshot date.
  const start = end - (new Date(end).getUTCDay() + (WEEKS - 1) * 7) * DAY_MS;

  const weeks = Array.from({ length: WEEKS }, (_, w) =>
    Array.from({ length: 7 }, (_, d) => {
      const time = start + (w * 7 + d) * DAY_MS;
      const key = dayKey(time);
      return { key, time, count: time > end ? null : (counts[key] ?? 0) };
    }),
  );

  let windowCommits = 0;
  let activeDays = 0;
  for (let i = 0; i < WINDOW_DAYS; i++) {
    const count = counts[dayKey(end - i * DAY_MS)] ?? 0;
    windowCommits += count;
    if (count > 0) activeDays += 1;
  }

  const updatedLabel = new Date(end).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
  const columns = { gridTemplateColumns: `repeat(${WEEKS}, minmax(0, 1fr))` };

  return (
    <figure className="m-0 rounded-[var(--radius-lg)] border border-[var(--color-line)] bg-[var(--color-bg-soft)] p-6 shadow-[0_24px_60px_-40px_rgba(15,15,15,0.35)] md:p-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="label-muted">Commit activity</p>
          <p className="mt-3 font-sans text-[40px] leading-none font-semibold tracking-[-0.03em] text-[var(--color-fg)]">
            {windowCommits}
            <span className="ml-2 text-lg font-medium tracking-normal text-[var(--color-fg-muted)]">
              commits in {WINDOW_DAYS} days
            </span>
          </p>
        </div>
        <p className="font-sans text-sm text-[var(--color-fg-muted)]">
          Active on {activeDays} of the last {WINDOW_DAYS} days
        </p>
      </div>

      <div
        role="img"
        aria-label={`Commit activity heatmap: ${windowCommits} commits on ${activeDays} of the ${WINDOW_DAYS} days up to ${updatedLabel}.`}
        className="mt-7"
      >
        <div
          className="grid gap-[5px] pb-2 font-sans text-[11px] text-[var(--color-fg-dim)]"
          style={columns}
        >
          {weeks.map((week, w) => {
            const month = monthName(week[0].time);
            const isNew = w === 0 || month !== monthName(weeks[w - 1][0].time);
            return (
              <span key={week[0].key} className="whitespace-nowrap">
                {isNew ? month : ""}
              </span>
            );
          })}
        </div>
        <div className="grid grid-flow-col grid-rows-7 gap-[5px]" style={columns}>
          {weeks.flat().map((day) => (
            <span
              key={day.key}
              title={
                day.count === null
                  ? undefined
                  : `${day.count} ${day.count === 1 ? "commit" : "commits"} on ${day.key}`
              }
              className={`aspect-square rounded-[4px] ${
                day.count === null ? "" : levelClass[level(day.count)]
              }`}
            />
          ))}
        </div>
      </div>

      <figcaption className="mt-5 flex flex-wrap items-center justify-between gap-3 font-sans text-xs text-[var(--color-fg-dim)]">
        <span>
          All branches of OpenResearchh/ore, excluding automatic checkpoints ·
          updated {updatedLabel}
        </span>
        <span className="flex items-center gap-1.5" aria-hidden="true">
          Less
          {levelClass.map((cls) => (
            <span key={cls} className={`size-3 rounded-[3px] ${cls}`} />
          ))}
          More
        </span>
      </figcaption>
    </figure>
  );
}
