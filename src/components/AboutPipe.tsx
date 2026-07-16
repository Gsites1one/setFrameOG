"use client";

import { useEffect, useRef } from "react";

// Ambient background for the About section (P7.3): a copper current travels a
// curved, organic path (stroke-dashoffset) with a few brief "leak" bursts that
// flash and vanish almost instantly — a leak caught the moment it appears.
// Kept at low opacity so the body text keeps its AA contrast margin (verified),
// paused off-screen via IntersectionObserver, and static under reduced motion.

// Organic S-curve across the section.
const PIPE =
  "M 12 262 C 150 262, 150 104, 300 148 S 470 250, 588 108";

// Points near the path where a leak briefly flares. Staggered so at most one
// shows at a time (low frequency).
const LEAKS = [
  { x: 150, y: 186, delay: "0s" },
  { x: 316, y: 150, delay: "3s" },
  { x: 470, y: 206, delay: "6s" },
];

export function AboutPipe() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        el.dataset.visible = entry.isIntersecting ? "true" : "false";
      },
      { rootMargin: "0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      data-visible="false"
      aria-hidden="true"
      className="about-pipe pointer-events-none absolute inset-0"
    >
      <svg
        viewBox="0 0 600 320"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        className="h-full w-full"
        style={{ opacity: 0.5 }}
      >
        {/* faint static conduit */}
        <path
          d={PIPE}
          stroke="rgba(199,123,63,0.14)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        {/* traveling current */}
        <path
          d={PIPE}
          className="pipe-flow"
          stroke="rgba(199,123,63,0.42)"
          strokeWidth="1.75"
          strokeLinecap="round"
        />
        {/* brief leak/catch bursts */}
        {LEAKS.map((leak) => (
          <circle
            key={`${leak.x}-${leak.y}`}
            className="leak-burst"
            style={{ animationDelay: leak.delay }}
            cx={leak.x}
            cy={leak.y}
            r="4"
            fill="rgba(199,123,63,0.5)"
          />
        ))}
      </svg>
    </div>
  );
}
