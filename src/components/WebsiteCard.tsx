"use client";

import { useRef } from "react";
import Image from "next/image";
import type { WebsitePrototype } from "@/lib/projects";

// Website prototype card: browser-chrome frame + screenshot, signature copper
// cursor-spotlight, hover preview (scale), a "Prototype 0N" label and a quiet
// "view live" link. The bounding rect is cached on pointer enter so the
// pointermove handler never reads layout (avoids forced reflow).
export function WebsiteCard({ prototype }: { prototype: WebsitePrototype }) {
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
    <div className="group flex flex-col">
      <div
        ref={frameRef}
        onPointerEnter={cacheRect}
        onPointerMove={onPointerMove}
        className="relative overflow-hidden rounded-xl border border-white/10 bg-surface shadow-2xl transition-colors group-hover:border-accent/40"
        style={{ "--sx": "-300px", "--sy": "-300px" } as React.CSSProperties}
      >
        {/* signature copper spotlight, hover + fine pointer only */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-20 opacity-0 mix-blend-screen transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(240px circle at var(--sx) var(--sy), rgba(199,123,63,0.20), transparent 70%)",
          }}
        />

        <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-foreground/20" />
          <span className="h-2.5 w-2.5 rounded-full bg-foreground/20" />
          <span className="h-2.5 w-2.5 rounded-full bg-foreground/20" />
          <span className="ml-3 rounded-full bg-background px-3 py-1 font-mono text-[11px] text-foreground/50">
            {prototype.displayUrl}
          </span>
        </div>

        <div className="relative aspect-video overflow-hidden">
          <Image
            src={prototype.image}
            alt={prototype.alt}
            fill
            sizes="(max-width: 768px) 100vw, 480px"
            className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
          />
          {/* Prototype label badge */}
          <span className="absolute left-3 top-3 z-10 rounded-full bg-background/80 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-accent backdrop-blur-sm">
            {prototype.label}
          </span>
        </div>
      </div>

      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <p className="font-display text-base font-semibold">{prototype.name}</p>
          <p className="mt-1 text-sm leading-relaxed text-foreground/60">
            {prototype.outcome}
          </p>
        </div>
        <a
          href={prototype.url}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 whitespace-nowrap pt-1 font-mono text-xs text-foreground/60 transition-colors hover:text-accent"
        >
          view live →
        </a>
      </div>
    </div>
  );
}
