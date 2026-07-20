"use client";

import { useRef } from "react";
import Image from "next/image";

// Shared, premium browser frame for the prototype showcases (Iteration 4,
// Task 3, upgraded). Both prototypes render through this one component, so the
// frames are provably identical — all variety lives inside the screenshots.
//
// Premium treatment: a soft copper halo that lifts in on hover (behind the
// frame, outside its clip), a deep layered drop shadow, a glassy inset ring,
// a chrome bar with a subtle vertical gradient and a lit top edge, a centered
// URL pill, a faint diagonal screen reflection, and a slight lift on hover.
// The copper cursor spotlight is retained; its rect is cached on pointer
// enter so pointermove never reads layout.
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
    <div className="relative">
      {/* soft copper halo behind the frame, revealed on card hover (sits
          outside the frame's overflow clip) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-3 -z-10 rounded-2xl bg-accent/10 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
      />

      <div
        ref={frameRef}
        onPointerEnter={cacheRect}
        onPointerMove={onPointerMove}
        className="relative overflow-hidden rounded-xl border border-white/10 bg-surface shadow-[0_30px_80px_-30px_rgba(0,0,0,0.95)] ring-1 ring-inset ring-white/[0.06] transition-[transform,border-color,box-shadow] duration-300 group-hover:-translate-y-1 group-hover:border-accent/40 group-hover:shadow-[0_44px_110px_-34px_rgba(0,0,0,0.95)]"
        style={{ "--sx": "-300px", "--sy": "-300px" } as React.CSSProperties}
      >
        {/* lit top edge */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 z-20 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"
        />

        {/* copper cursor spotlight, hover + fine pointer only */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-20 opacity-0 mix-blend-screen transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(240px circle at var(--sx) var(--sy), rgba(199,123,63,0.22), transparent 70%)",
          }}
        />

        {/* chrome bar: dots left, centered URL pill, subtle gradient for depth */}
        <div className="relative flex items-center gap-2 border-b border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-foreground/25" />
          <span className="h-2.5 w-2.5 rounded-full bg-foreground/25" />
          <span className="h-2.5 w-2.5 rounded-full bg-foreground/25" />
          <span className="absolute left-1/2 -translate-x-1/2 rounded-full border border-white/[0.07] bg-background px-4 py-1 font-mono text-[11px] text-foreground/55 shadow-[inset_0_1px_2px_rgba(0,0,0,0.4)]">
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
            className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.08] via-transparent to-transparent"
          />
          <span className="absolute left-3 top-3 z-10 rounded-full bg-background/80 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-accent backdrop-blur-sm">
            {label}
          </span>
        </div>
      </div>
    </div>
  );
}
