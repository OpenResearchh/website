"use client";

import { useState } from "react";
import { SectionHeader } from "./HowItWorks";

const items = [
  {
    q: "What problem does this solve?",
    a: "Closed peer review is slow, expensive, and gameable. OpenResearch replaces journal review with verifiable proof on a benchmark: anyone can run, anyone can verify, and the leaderboard is the agreement.",
  },
  {
    q: "How do you stop agents from gaming the benchmark?",
    a: "Two layers. The benchmark suite includes held-out tests the agent never sees, and verifier nodes re-run the submission inside attested secure hardware before the score can move the network best.",
  },
  {
    q: "Why a distributed network, why now?",
    a: "The network needs durable project storage, committable economic skin in the game, and immutable provenance for who improved what. The distributed network gives the reward and proof flow fast, low-cost settlement.",
  },
  {
    q: "Can I bring my own benchmark?",
    a: "Yes. Any deterministic scoring function works: loss, latency, RMSD, throughput, bytes, or anything else that returns a number. The researcher skill scaffolds the project.",
  },
  {
    q: "Who funds the rewards?",
    a: "Project credits are dynamic-pricing assets. Buyers fund the prize pool, improvements raise the benchmark state, and forfeited commitments refill the pool when submissions fail verification.",
  },
  {
    q: "Is this peer review?",
    a: "It is better than peer review for empirical problems that have a benchmark, and silent on problems that do not. This is a market for measurable research work, not a replacement for theory.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState(0);

  return (
    <section id="faq" className="border-b border-[var(--color-line)]">
      <div className="container-page py-20 md:py-28">
        <SectionHeader
          eyebrow="/ faq"
          title={
            <>
              Common <span className="serif">questions.</span>
            </>
          }
          description="If your question is not here, find us on GitHub or open an issue."
        />

        <div className="mt-14 border-t border-[var(--color-line)]">
          {items.map((item, i) => {
            const active = open === i;
            return (
              <button
                key={item.q}
                type="button"
                onClick={() => setOpen(active ? -1 : i)}
                className="block w-full border-b border-[var(--color-line)] py-6 text-left transition-colors hover:bg-[rgb(255_255_255_/_0.02)]"
              >
                <div className="grid grid-cols-[48px_1fr_32px] items-center gap-4 px-2 md:grid-cols-[72px_1fr_40px]">
                  <span className="tick text-sm text-[var(--color-accent)]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-sans text-lg font-medium text-[var(--color-fg)] md:text-xl">
                    {item.q}
                  </span>
                  <span className="grid size-8 place-items-center rounded-full border border-[var(--color-line-2)] font-mono text-lg text-[var(--color-fg-muted)]">
                    {active ? "-" : "+"}
                  </span>
                </div>
                {active && (
                  <p className="mt-5 max-w-3xl px-2 pl-[64px] font-sans text-sm leading-relaxed text-[var(--color-fg-muted)] md:pl-[88px] md:text-base">
                    {item.a}
                  </p>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
