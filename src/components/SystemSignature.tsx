"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

// SetFrame's hero signature visual: the "leak to movement" raster (a business
// leaking copper particles, caught and redirected by a teal+copper system
// cluster) as the base plate, with cheap compositor-safe motion layered on
// top: (a) a slow breathing glow over the cluster, (b) up to 12px mouse
// parallax on fine-pointer devices. No traveling SVG pulse here — the raster
// already shows the particle trail baked in, so a redundant overlay would
// just add cost without reading any better.
export function SystemSignature() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (!el || !finePointer || reducedMotion) return;

    let raf = 0;
    // Cache viewport size (updated on resize) so the pointer handler never
    // reads layout in the hot path.
    let vw = window.innerWidth;
    let vh = window.innerHeight;
    const onResize = () => {
      vw = window.innerWidth;
      vh = window.innerHeight;
    };
    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };

    const onMove = (e: PointerEvent) => {
      // max 12px offset, mapped from cursor position across the viewport
      target.x = (e.clientX / vw - 0.5) * 24;
      target.y = (e.clientY / vh - 0.5) * 24;
    };

    const tick = () => {
      current.x += (target.x - current.x) * 0.06;
      current.y += (target.y - current.y) * 0.06;
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
      className="pointer-events-none absolute inset-0"
    >
      <Image
        src="/hero/leak-to-movement.webp"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-contain"
      />

      {/* Static vignette so the centered H1 stays legible over the busier
          right-hand cluster and left-hand particle trail. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 55% 45% at 50% 42%, rgba(18,18,20,0.7), rgba(18,18,20,0.25) 60%, transparent 100%)",
        }}
      />

      {/* Slow breathing glow over the system cluster (right third of frame) */}
      <div
        className="ambient-glow absolute right-[8%] top-[30%] h-56 w-56 rounded-full blur-[90px] sm:h-72 sm:w-72"
        style={{ backgroundColor: "rgba(79,179,201,0.35)" }}
      />
    </div>
  );
}
