"use client";

import { useEffect, useRef } from "react";
import { useAnimateAfterIdle } from "@/lib/useAnimateAfterIdle";

// Coded hero focal visual (P7.2): the SetFrame idea expressed in SVG, no
// raster and no rectangular photo edge. A business on the left leaks copper
// beads along an arc; a teal + copper system cluster on the right catches them
// and turns them into upward movement. The whole thing is masked with a soft
// radial falloff so it dissolves into the ambient background.
//
// All motion is opacity-only (bead shimmer, node pulse, rising dots) plus a
// tiny transform parallax on fine pointers. Under reduced motion the CSS
// animations resolve to a calm static state (see globals.css overrides), so
// the scene stays legible with no movement.
//
// P7.4: the CSS animations are held paused until after first paint via the
// `.anim-gate` gate (requestIdleCallback), so these above-the-fold,
// non-composited SVG animations do not run inside the LCP / Speed Index
// window on throttled mobile — restoring the deferral the previous hero had.

const COPPER = "#c77b3f";
const COOL = "#4fb3c9";

// Points sampled along the leak arc, business -> cluster.
const BEADS = [
  { x: 196, y: 300 },
  { x: 252, y: 276 },
  { x: 310, y: 256 },
  { x: 370, y: 240 },
  { x: 432, y: 228 },
  { x: 494, y: 220 },
  { x: 556, y: 214 },
];

// Cluster nodes (right): a mix of copper and teal.
const NODES = [
  { x: 636, y: 168, r: 4, c: COPPER },
  { x: 690, y: 206, r: 3, c: COOL },
  { x: 622, y: 250, r: 3, c: COOL },
  { x: 676, y: 262, r: 4, c: COPPER },
];
const CENTER = { x: 648, y: 214 };

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
      className="anim-gate pointer-events-none absolute inset-0 flex items-center justify-center"
      style={{
        maskImage:
          "radial-gradient(ellipse 72% 62% at 50% 45%, #000 48%, transparent 92%)",
        WebkitMaskImage:
          "radial-gradient(ellipse 72% 62% at 50% 45%, #000 48%, transparent 92%)",
      }}
    >
      {/* Full-viewport width (no max-w cap): the ambient visual spans edge to
          edge and fades out via the radial mask, so it never reads as an inset
          panel with hard graphite bars on wide screens (P9). */}
      <svg
        viewBox="0 0 800 460"
        className="h-full w-full"
        fill="none"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <radialGradient id="hero-cluster-glow">
            <stop offset="0%" stopColor={COPPER} stopOpacity="0.22" />
            <stop offset="100%" stopColor={COPPER} stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* soft bloom behind the cluster */}
        <circle cx={CENTER.x} cy={CENTER.y} r="120" fill="url(#hero-cluster-glow)" />

        {/* business glyph (left) — outlined, quiet */}
        <g stroke="rgba(245,245,244,0.18)" strokeWidth="1.5">
          <rect x="112" y="286" width="66" height="60" rx="6" />
          <path d="M 112 300 L 178 300" />
          <rect x="150" y="316" width="16" height="30" fill="rgba(245,245,244,0.05)" />
        </g>

        {/* leak arc (static, faint) */}
        <path
          d="M 190 306 Q 380 232 560 214 T 640 210"
          stroke="rgba(199,123,63,0.14)"
          strokeWidth="1.5"
          strokeDasharray="1 7"
          strokeLinecap="round"
        />

        {/* traveling beads — sequential opacity pulse reads as flow along the
            arc (opacity only) */}
        {BEADS.map((b, i) => (
          <circle
            key={`${b.x}-${b.y}`}
            className="hero-bead"
            style={{ animationDelay: `${i * 0.26}s` }}
            cx={b.x}
            cy={b.y}
            r="2.6"
            fill={COPPER}
          />
        ))}

        {/* cluster connectors */}
        <g stroke="rgba(245,245,244,0.10)" strokeWidth="1.25">
          {NODES.map((n) => (
            <line key={`l-${n.x}`} x1={CENTER.x} y1={CENTER.y} x2={n.x} y2={n.y} />
          ))}
        </g>

        {/* cluster center */}
        <circle cx={CENTER.x} cy={CENTER.y} r="6" fill="none" stroke={COPPER} strokeWidth="1.75" />
        <circle cx={CENTER.x} cy={CENTER.y} r="2" fill={COPPER} />

        {/* cluster nodes — gentle pulse */}
        {NODES.map((n, i) => (
          <circle
            key={`n-${n.x}`}
            className={i % 2 === 0 ? "blink-a" : "blink-b"}
            cx={n.x}
            cy={n.y}
            r={n.r}
            fill={n.c}
          />
        ))}

        {/* movement — dots rising up and onward from the cluster */}
        <circle className="hero-rise" style={{ animationDelay: "0s" }} cx="666" cy="150" r="2.4" fill={COOL} />
        <circle className="hero-rise" style={{ animationDelay: "1.1s" }} cx="700" cy="140" r="2" fill={COPPER} />
        <circle className="hero-rise" style={{ animationDelay: "2.2s" }} cx="632" cy="150" r="2" fill={COPPER} />
      </svg>
    </div>
  );
}
