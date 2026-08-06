"use client";

import { useEffect, useRef } from "react";
import { useAnimateAfterIdle } from "@/lib/useAnimateAfterIdle";

// Hero focal visual: node/line clusters that FLANK the headline on both sides
// (Iteration 7, Task 1). Previously this was one 800x460 SVG spanning the whole
// hero, with the leak arc and the system cluster running straight through the
// middle — measured, the headline occupies viewBox x179..x621 at 1440px while
// the cluster sat at x620..700 and the arc ran x190..x640, so the artwork was
// passing directly behind the text. That is what forced the scrim in
// Iteration 6, and with the scrim covering the centre the hero read as flat.
//
// Now there are two independent clusters pinned to the left and right margins,
// so the animation frames the text instead of colliding with it and the middle
// stays open. The left is not a rigid mirror: it carries the quiet business
// glyph and a shorter three-node cluster, the right keeps the four-node system
// cluster, and their bead/pulse timings differ, so the two sides read as
// related rather than reflected.
//
// IMPORTANT geometry note. Flanking only fits where there is margin to flank
// into. Measured safe margin beside the headline is ~179 viewBox units per side
// at 1440px, but only ~25 at 768px, and at 320px the text block is taller than
// the SVG box entirely. There is physically nowhere to put a cluster on a phone
// without it landing under the copy, so the clusters are shown from lg up and
// the hero relies on its ambient glow and the slow breathing wash below that.
//
// All motion is opacity-only (bead shimmer, node pulse, rising dots) plus a
// small transform parallax on fine pointers. Held paused until the browser is
// idle after first paint via `.anim-gate`, so these never run inside the LCP /
// Speed Index window. Static under reduced motion (see globals.css overrides).

const COPPER = "#c77b3f";
const COOL = "#4fb3c9";

// Each cluster is drawn in its own tall, narrow box so it can be pinned to the
// hero's edge and scale with the viewport without ever reaching the centre.
const VB_W = 200;
const VB_H = 600;

type Node = { x: number; y: number; r: number; c: string };

// Right: the system cluster — four nodes wired to a centre, catching what the
// left side leaks.
const RIGHT_CENTER = { x: 95, y: 300 };
const RIGHT_NODES: Node[] = [
  { x: 150, y: 232, r: 4, c: COPPER },
  { x: 42, y: 258, r: 3, c: COOL },
  { x: 58, y: 366, r: 3, c: COOL },
  { x: 152, y: 348, r: 4, c: COPPER },
];
const RIGHT_RISE = [
  { x: 118, y: 178, r: 2.4, c: COOL, d: "0s" },
  { x: 72, y: 148, r: 2, c: COPPER, d: "1.1s" },
  { x: 142, y: 120, r: 2, c: COPPER, d: "2.2s" },
];

// Left: three nodes, offset centre, different rhythm — same language, not a
// reflection.
const LEFT_CENTER = { x: 108, y: 268 };
const LEFT_NODES: Node[] = [
  { x: 46, y: 214, r: 3, c: COPPER },
  { x: 158, y: 256, r: 4, c: COOL },
  { x: 62, y: 338, r: 4, c: COPPER },
];
const LEFT_RISE = [
  { x: 88, y: 190, r: 2.2, c: COPPER, d: "0.6s" },
  { x: 136, y: 158, r: 2, c: COOL, d: "1.8s" },
];
// Beads travelling up the left arc, away from the business glyph.
const LEFT_BEADS = [
  { x: 74, y: 470 },
  { x: 84, y: 428 },
  { x: 96, y: 388 },
  { x: 104, y: 344 },
];

function Cluster({ side }: { side: "left" | "right" }) {
  const isLeft = side === "left";
  const center = isLeft ? LEFT_CENTER : RIGHT_CENTER;
  const nodes = isLeft ? LEFT_NODES : RIGHT_NODES;
  const rise = isLeft ? LEFT_RISE : RIGHT_RISE;

  return (
    <svg
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      className="h-full w-full"
      fill="none"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id={`hero-glow-${side}`}>
          <stop offset="0%" stopColor={COPPER} stopOpacity="0.2" />
          <stop offset="100%" stopColor={COPPER} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* soft bloom behind the cluster centre */}
      <circle cx={center.x} cy={center.y} r="105" fill={`url(#hero-glow-${side})`} />

      {isLeft && (
        <>
          {/* the business the system is built around — quiet, outlined */}
          <g stroke="rgba(245,245,244,0.16)" strokeWidth="1.5">
            <rect x="62" y="470" width="66" height="60" rx="6" />
            <path d="M 62 484 L 128 484" />
            <rect x="100" y="500" width="16" height="30" fill="rgba(245,245,244,0.05)" />
          </g>
          {/* what leaks out of it, rising toward the cluster */}
          <path
            d="M 96 466 Q 76 400 108 300"
            stroke="rgba(199,123,63,0.14)"
            strokeWidth="1.5"
            strokeDasharray="1 7"
            strokeLinecap="round"
          />
          {LEFT_BEADS.map((b, i) => (
            <circle
              key={`b-${b.x}-${b.y}`}
              className="hero-bead"
              style={{ animationDelay: `${i * 0.3}s` }}
              cx={b.x}
              cy={b.y}
              r="2.6"
              fill={COPPER}
            />
          ))}
        </>
      )}

      {/* connectors */}
      <g stroke="rgba(245,245,244,0.10)" strokeWidth="1.25">
        {nodes.map((n) => (
          <line key={`l-${n.x}-${n.y}`} x1={center.x} y1={center.y} x2={n.x} y2={n.y} />
        ))}
      </g>

      {/* cluster centre */}
      <circle
        cx={center.x}
        cy={center.y}
        r="6"
        fill="none"
        stroke={COPPER}
        strokeWidth="1.75"
      />
      <circle cx={center.x} cy={center.y} r="2" fill={COPPER} />

      {/* nodes — gentle alternating pulse */}
      {nodes.map((n, i) => (
        <circle
          key={`n-${n.x}-${n.y}`}
          className={i % 2 === 0 ? "blink-a" : "blink-b"}
          cx={n.x}
          cy={n.y}
          r={n.r}
          fill={n.c}
        />
      ))}

      {/* movement — dots rising out of the cluster */}
      {rise.map((d) => (
        <circle
          key={`r-${d.x}-${d.y}`}
          className="hero-rise"
          style={{ animationDelay: d.d }}
          cx={d.x}
          cy={d.y}
          r={d.r}
          fill={d.c}
        />
      ))}
    </svg>
  );
}

export function HeroVisual() {
  const ref = useRef<HTMLDivElement>(null);
  // Hold the continuous CSS pulses until the browser is idle after first
  // paint, so they never compete with the headline for the LCP / Speed Index
  // window.
  const animate = useAnimateAfterIdle();

  // Up to 10px parallax on fine pointers only; static otherwise.
  useEffect(() => {
    const el = ref.current;
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (!el || !finePointer || reducedMotion) return;

    let raf = 0;
    let vw = window.innerWidth;
    let vh = window.innerHeight;
    const onResize = () => {
      vw = window.innerWidth;
      vh = window.innerHeight;
    };
    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    const onMove = (e: PointerEvent) => {
      target.x = (e.clientX / vw - 0.5) * 20;
      target.y = (e.clientY / vh - 0.5) * 20;
    };
    const tick = () => {
      current.x += (target.x - current.x) * 0.05;
      current.y += (target.y - current.y) * 0.05;
      el.style.transform = `translate3d(${current.x}px, ${current.y}px, 0)`;
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      data-animate={animate ? "on" : "off"}
      className="anim-gate pointer-events-none absolute inset-0"
    >
      {/* Each side is pinned to its own edge and capped at 11% of the hero
          width. That cap is what keeps the artwork out of the copy: the text
          block is max-w-3xl (768px), so the free margin per side is
          (viewport - 768) / 2 — 128px at 1024px and 336px at 1440px, and 11%
          stays inside both. Hidden below lg, where that margin collapses to
          almost nothing and there is nowhere to flank into. */}
      <div className="absolute inset-y-0 left-0 hidden w-[11%] lg:block">
        {/* fade toward the text so the cluster dissolves before it gets near */}
        <div
          className="h-full w-full"
          style={{
            maskImage:
              "linear-gradient(to right, #000 25%, rgba(0,0,0,0.35) 70%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to right, #000 25%, rgba(0,0,0,0.35) 70%, transparent 100%)",
          }}
        >
          <Cluster side="left" />
        </div>
      </div>

      <div className="absolute inset-y-0 right-0 hidden w-[11%] lg:block">
        <div
          className="h-full w-full"
          style={{
            maskImage:
              "linear-gradient(to left, #000 25%, rgba(0,0,0,0.35) 70%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to left, #000 25%, rgba(0,0,0,0.35) 70%, transparent 100%)",
          }}
        >
          <Cluster side="right" />
        </div>
      </div>
    </div>
  );
}
