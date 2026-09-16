"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { CopyTextButton } from "../components/CopyTextButton";

const methods = [
  {
    id: "brew",
    label: "Homebrew",
    // No `--cask`: bare `brew install` resolves casks, and this is the exact
    // command the ore README documents.
    command: "brew install openresearchh/tap/ore",
  },
  {
    id: "curl",
    label: "curl",
    // Keep `-L`: the apex domain 307s to www and curl must follow it.
    command: "curl -fsSL https://openresearchh.com/ore/install.sh | sh",
  },
] as const;

type MethodId = (typeof methods)[number]["id"];

const focusRingOnDark =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

/** Install tabs, styled for the dark glass card on the ORE wallpaper. */
export function OreInstall() {
  const [active, setActive] = useState<MethodId>("brew");
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const current = methods.find((m) => m.id === active)!;

  // WAI-ARIA tabs: arrow keys move between tabs, Home/End jump to the ends.
  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next = -1;
    if (event.key === "ArrowRight") next = (index + 1) % methods.length;
    else if (event.key === "ArrowLeft")
      next = (index - 1 + methods.length) % methods.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = methods.length - 1;
    if (next < 0) return;
    event.preventDefault();
    setActive(methods[next].id);
    tabRefs.current[next]?.focus();
  };

  return (
    <div>
      <div
        role="tablist"
        aria-label="Install method"
        className="mx-auto flex w-max gap-1 rounded-full bg-black/25 p-1"
      >
        {methods.map((method, index) => {
          const selected = method.id === active;
          return (
            <button
              key={method.id}
              ref={(node) => {
                tabRefs.current[index] = node;
              }}
              id={`ore-install-tab-${method.id}`}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls="ore-install-panel"
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(method.id)}
              onKeyDown={(event) => onKeyDown(event, index)}
              className={`min-w-28 rounded-full px-4 py-1.5 font-sans text-sm font-medium transition-colors ${focusRingOnDark} ${
                selected
                  ? "bg-white/90 text-[#16130f] shadow-[0_2px_10px_-4px_rgba(0,0,0,0.5)]"
                  : "text-white/65 hover:text-white"
              }`}
            >
              {method.label}
            </button>
          );
        })}
      </div>

      <div
        id="ore-install-panel"
        role="tabpanel"
        aria-labelledby={`ore-install-tab-${current.id}`}
        className="mt-4 flex min-h-12 items-center gap-3 rounded-[14px] border border-white/15 bg-black/35 py-1.5 pr-1.5 pl-4"
      >
        <code className="min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-left font-mono text-[12px] text-white md:text-[13px]">
          <span className="select-none text-white/45">$ </span>
          {current.command}
        </code>
        <CopyTextButton
          text={current.command}
          label={`Copy the ${current.label} install command`}
          variant="icon"
          className="rounded-[10px]! border-white/15! bg-white/10! text-white! hover:border-white/35! hover:bg-white/20!"
        />
      </div>
    </div>
  );
}
