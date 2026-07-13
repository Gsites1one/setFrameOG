"use client";

import { useEffect, useRef } from "react";

// SetFrame's own signature visual for the hero background: a bracket-framed
// core with copper/teal nodes and pulsing connections radiating out. Pure
// inline SVG (no network cost, no LCP impact). Adds a small mouse-parallax
// on fine pointers only; fully static otherwise. Decorative, aria-hidden.

const COPPER = "#c77b3f";
const COOL = "#4fb3c9";

const NODES = [
  { x: 150, y: 120, r: 4, c: COOL },
  { x: 210, y: 250, r: 3, c: COOL },
  { x: 470, y: 140, r: 4, c: COPPER },
  { x: 540, y: 300, r: 3, c: COPPER },
  { x: 620, y: 190, r: 4, c: COPPER },
  { x: 300, y: 340, r: 3, c: COOL },
];

const LINKS = [
  "M 330 210 C 260 180, 210 150, 150 120",
  "M 330 250 C 280 270, 250 250, 210 250",
  "M 450 210 C 500 170, 520 150, 470 140",
  "M 460 240 C 520 270, 540 290, 540 300",
  "M 470 220 C 560 210, 600 200, 620 190",
  "M 360 280 C 330 320, 320 330, 300 340",
];

export function SystemSignature() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (!finePointer || reducedMotion) return;

    let raf = 0;
    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };

    const onMove = (e: PointerEvent) => {
      // max 12px offset, mapped from cursor position across the viewport
      target.x = (e.clientX / window.innerWidth - 0.5) * 24;
      target.y = (e.clientY / window.innerHeight - 0.5) * 24;
    };

    const tick = () => {
      current.x += (target.x - current.x) * 0.06;
      current.y += (target.y - current.y) * 0.06;
      el.style.transform = `translate3d(${current.x}px, ${current.y}px, 0)`;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 flex items-center justify-center"
    >
      <svg
        viewBox="0 0 768 460"
        className="h-full w-full max-w-5xl opacity-60"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <radialGradient id="sig-core">
            <stop offset="0%" stopColor={COPPER} stopOpacity="0.25" />
            <stop offset="100%" stopColor={COPPER} stopOpacity="0" />
          </radialGradient>
        </defs>

        <circle cx="384" cy="230" r="150" fill="url(#sig-core)" />

        {LINKS.map((d, i) => (
          <g key={d}>
            <path d={d} fill="none" stroke="rgba(245,245,244,0.08)" strokeWidth="1.5" />
            <path
              className="flow-dash"
              style={{ animationDelay: `${i * 0.4}s` }}
              d={d}
              fill="none"
              stroke={i % 2 === 0 ? COPPER : COOL}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeOpacity="0.7"
            />
          </g>
        ))}

        {/* central bracket-framed core */}
        <g className="flow-node" style={{ transformOrigin: "384px 230px" }}>
          <path
            d="M 352 198 h -14 v 64 h 14"
            fill="none"
            stroke={COPPER}
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M 416 198 h 14 v 64 h -14"
            fill="none"
            stroke={COPPER}
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx="384" cy="230" r="10" fill="none" stroke={COPPER} strokeWidth="2" />
          <circle cx="384" cy="230" r="3" fill={COPPER} />
        </g>

        {NODES.map((n) => (
          <circle
            key={`${n.x}-${n.y}`}
            cx={n.x}
            cy={n.y}
            r={n.r}
            fill={n.c}
            fillOpacity="0.8"
          />
        ))}
      </svg>
    </div>
  );
}
