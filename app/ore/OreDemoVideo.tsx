"use client";

import { useEffect, useRef, useState } from "react";

/** How far the video shrinks when it is furthest from the middle of the screen. */
const ZOOM = 0.1;

/**
 * The hero product demo: a trimmed screen recording that loops silently.
 * It autoplays unless the visitor prefers reduced motion, and always has a
 * pause control, since it runs longer than five seconds.
 *
 * Scrolling eases it up to full size as it reaches the middle of the screen
 * and back down as it leaves. This is driven from scroll position rather than
 * a CSS scroll timeline: the video sits inside clipped, rounded panels, and a
 * CSS `view()` timeline resolves against the nearest scroll container, which
 * made it silently inert.
 */
export function OreDemoVideo() {
  const frameRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    video.play().catch(() => {
      /* autoplay blocked; the play button still works */
    });
  }, []);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let queued = 0;

    const update = () => {
      queued = 0;
      const rect = frame.getBoundingClientRect();
      const viewport = window.innerHeight;
      // 0 when the video is centered, 1 when it is entirely out of sight.
      const offset = Math.abs(rect.top + rect.height / 2 - viewport / 2);
      const distance = Math.min(offset / (viewport / 2 + rect.height / 2), 1);
      frame.style.transform = `scale(${(1 - ZOOM * distance).toFixed(4)})`;
    };

    const onScroll = () => {
      if (!queued) queued = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (queued) window.cancelAnimationFrame(queued);
      frame.style.transform = "";
    };
  }, []);

  const toggle = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  };

  return (
    <div
      ref={frameRef}
      className="relative mx-auto w-full max-w-[1180px] overflow-hidden rounded-[14px] shadow-[0_40px_100px_-40px_rgba(0,0,0,0.85)] ring-1 ring-white/15 will-change-transform"
    >
      <video
        ref={videoRef}
        src="/ore/demo.mp4"
        poster="/ore/demo-poster.jpg"
        width={1374}
        height={880}
        muted
        loop
        playsInline
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        aria-label="Demo of the ORE app: moving between agent workspaces in two repositories, reading what Claude Code did in each, with the changed files and commits in the right panel."
        className="block h-auto w-full"
      />
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Pause the demo video" : "Play the demo video"}
        className="ore-glass-on-dark absolute right-3 bottom-3 grid size-10 place-items-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:right-4 md:bottom-4"
      >
        {playing ? <PauseIcon /> : <PlayIcon />}
      </button>
    </div>
  );
}

function PlayIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M7 4.5v15a1 1 0 0 0 1.5.86l12.5-7.5a1 1 0 0 0 0-1.72L8.5 3.64A1 1 0 0 0 7 4.5Z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <rect x="5.5" y="4" width="4.5" height="16" rx="1.2" />
      <rect x="14" y="4" width="4.5" height="16" rx="1.2" />
    </svg>
  );
}
