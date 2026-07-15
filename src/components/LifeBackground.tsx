"use client";

import { useEffect, useRef } from "react";

// Site-wide background "life" package. Two layers:
// 1. Default ambient layer (Task 6): a slow drifting/breathing copper glow
//    plus a slow-pulsing mesh + grain, CSS-only, on for every device
//    including touch. This is what keeps the background alive with no
//    pointer at all.
// 2. Cursor-reactive enhancement: a second copper glow that follows the
//    pointer, plus a cursor-revealed dot grid. Fine-pointer devices only,
//    layered on top of (never replacing) the default ambient layer.
// All motion here is transform/opacity only, and the pointer-follow loop
// runs through a single rAF tick. Fully static under reduced motion.

const GRAIN_DATA_URI = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

export function LifeBackground() {
  const glowRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (!finePointer || reducedMotion) return;

    const glow = glowRef.current;
    const grid = gridRef.current;
    if (!glow || !grid) return;

    glow.style.opacity = "1";

    const target = { x: window.innerWidth / 2, y: window.innerHeight * 0.3 };
    const current = { ...target };
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      grid.style.setProperty("--mx", `${e.clientX}px`);
      grid.style.setProperty("--my", `${e.clientY}px`);
    };

    const tick = () => {
      current.x += (target.x - current.x) * 0.06;
      current.y += (target.y - current.y) * 0.06;
      glow.style.transform = `translate3d(${current.x}px, ${current.y}px, 0) translate(-50%, -50%)`;
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
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10">
      {/* Default ambient layer — on for every device, no pointer required.
          Slow drifting + breathing copper glow (transform + opacity only). */}
      <div className="ambient-glow-drift absolute left-[10%] top-[15%] h-[40rem] w-[40rem] rounded-full bg-accent/10 blur-[130px]" />

      {/* static mesh depth: two faint off-center glows so the graphite never
          reads as flat void, even on touch with no cursor tracking. Slow
          breathing opacity, same shared keyframe as the glow above. */}
      <div
        className="ambient-glow absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 50% at 15% 0%, rgba(199,123,63,0.05), transparent 70%), radial-gradient(55% 45% at 100% 100%, rgba(79,179,201,0.04), transparent 70%)",
        }}
      />

      {/* cursor-following copper glow; ENHANCEMENT only, layered on top of
          the ambient glow above. Stays invisible on touch / reduced motion. */}
      <div
        ref={glowRef}
        className="absolute left-0 top-0 h-[44rem] w-[44rem] rounded-full bg-accent/10 blur-[140px] opacity-0 transition-opacity duration-700"
      />

      {/* dot grid revealed in a radius around the cursor */}
      <div
        ref={gridRef}
        className="absolute inset-0"
        style={
          {
            "--mx": "-999px",
            "--my": "-999px",
            backgroundImage:
              "radial-gradient(circle, rgba(245,245,244,0.4) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            maskImage:
              "radial-gradient(260px circle at var(--mx) var(--my), black 0%, transparent 85%)",
            WebkitMaskImage:
              "radial-gradient(260px circle at var(--mx) var(--my), black 0%, transparent 85%)",
            opacity: 0.5,
          } as React.CSSProperties
        }
      />

      {/* grain so the graphite reads as material, not void — slow, barely
          perceptible pulse, on a different period than the glow so nothing
          reads as synced/mechanical */}
      <div
        className="grain-breathe absolute inset-0"
        style={{ backgroundImage: GRAIN_DATA_URI }}
      />
    </div>
  );
}
