"use client";

import { useRef } from "react";
import Image from "next/image";

// Shared, premium browser frame for the prototype showcases (Iteration 4,
// Task 3). Both prototypes render through this one component, so the frames
// are provably identical — all variety lives inside the screenshots. Chrome:
// traffic-light dots, a centered URL pill, a subtle top highlight, a soft
// drop shadow, a faint diagonal screen reflection, and a thin line-colour
// border. The copper cursor spotlight is retained; its rect is cached on
// pointer enter so pointermove never reads layout.
export function BrowserFrame({
  displayUrl,
  label,
  image,
  alt,
}: {
  displayUrl: string;
  label: string;
  image: string;
  alt: string;
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  const rectRef = useRef<DOMRect | null>(null);

  const cacheRect = () => {
    if (frameRef.current) rectRef.current = frameRef.current.getBoundingClientRect();
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !frameRef.current || !rectRef.current) return;
    frameRef.current.style.setProperty("--sx", `${e.clientX - rectRef.current.left}px`);
    frameRef.current.style.setProperty("--sy", `${e.clientY - rectRef.current.top}px`);
  };

  return (
    <div
      ref={frameRef}
      onPointerEnter={cacheRect}
      onPointerMove={onPointerMove}
      className="relative overflow-hidden rounded-xl border border-white/10 bg-surface shadow-[0_30px_80px_-40px_rgba(0,0,0,0.95)] transition-colors group-hover:border-accent/40"
      style={{ "--sx": "-300px", "--sy": "-300px" } as React.CSSProperties}
    >
      {/* top highlight — a thin lit edge along the very top of the chrome */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 z-20 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent"
      />

      {/* copper cursor spotlight, hover + fine pointer only */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-20 opacity-0 mix-blend-screen transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(240px circle at var(--sx) var(--sy), rgba(199,123,63,0.20), transparent 70%)",
        }}
      />

      {/* chrome bar: dots left, URL pill centered */}
      <div className="relative flex items-center gap-2 border-b border-white/10 px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-foreground/20" />
        <span className="h-2.5 w-2.5 rounded-full bg-foreground/20" />
        <span className="h-2.5 w-2.5 rounded-full bg-foreground/20" />
        <span className="absolute left-1/2 -translate-x-1/2 rounded-full border border-white/5 bg-background px-4 py-1 font-mono text-[11px] text-foreground/50">
          {displayUrl}
        </span>
      </div>

      {/* screenshot */}
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={image}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, 480px"
          className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
        />
        {/* faint diagonal screen reflection */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.07] via-transparent to-transparent"
        />
        <span className="absolute left-3 top-3 z-10 rounded-full bg-background/80 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-accent backdrop-blur-sm">
          {label}
        </span>
      </div>
    </div>
  );
}
