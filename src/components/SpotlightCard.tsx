"use client";

import { useRef } from "react";

type SpotlightCardProps = {
  children: React.ReactNode;
  className?: string;
};

// Card with a copper spotlight that follows the cursor (CSS-var driven,
// no rAF needed). Falls back to a plain surface card on touch devices.
export function SpotlightCard({ children, className = "" }: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const onPointerMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    ref.current.style.setProperty("--sx", `${e.clientX - rect.left}px`);
    ref.current.style.setProperty("--sy", `${e.clientY - rect.top}px`);
  };

  return (
    <div
      ref={ref}
      onPointerMove={onPointerMove}
      className={`group relative overflow-hidden rounded-xl border border-white/10 bg-surface transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 ${className}`}
      style={{ "--sx": "-200px", "--sy": "-200px" } as React.CSSProperties}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(220px circle at var(--sx) var(--sy), rgba(199,123,63,0.14), transparent 70%)",
        }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}
