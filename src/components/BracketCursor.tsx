"use client";

import { useEffect, useRef } from "react";

// Custom cursor: a copper bracket pair that trails the pointer and expands
// around interactive elements. Fine-pointer devices only, disabled under
// reduced motion. Native cursor is hidden except over text fields.

const INTERACTIVE = "a, button, [role='button'], summary";
const TEXT_FIELDS = "input, textarea, select";

export function BracketCursor() {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const wrap = wrapRef.current;
    if (!finePointer || reducedMotion || !wrap) return;

    document.body.classList.add("bracket-cursor-active");

    const target = { x: -100, y: -100 };
    const current = { x: -100, y: -100 };
    let expanded = false;
    let visible = false;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      if (!visible) {
        visible = true;
        wrap.style.opacity = "1";
      }
    };

    const onOver = (e: PointerEvent) => {
      const el = e.target as Element;
      if (el.closest(TEXT_FIELDS)) {
        wrap.style.opacity = "0";
        return;
      }
      wrap.style.opacity = visible ? "1" : "0";
      expanded = !!el.closest(INTERACTIVE);
      wrap.style.setProperty("--gap", expanded ? "26px" : "9px");
    };

    const onLeave = () => {
      visible = false;
      wrap.style.opacity = "0";
    };

    const tick = () => {
      current.x += (target.x - current.x) * 0.35;
      current.y += (target.y - current.y) * 0.35;
      wrap.style.transform = `translate3d(${current.x}px, ${current.y}px, 0)`;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    raf = requestAnimationFrame(tick);

    return () => {
      document.body.classList.remove("bracket-cursor-active");
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[100] opacity-0 transition-opacity duration-200"
      style={{ "--gap": "9px" } as React.CSSProperties}
    >
      <span
        className="absolute font-mono text-lg font-medium text-accent transition-[left] duration-200 ease-out"
        style={{ left: "calc(var(--gap) * -1)", top: "-14px" }}
      >
        [
      </span>
      <span
        className="absolute font-mono text-lg font-medium text-accent transition-[left] duration-200 ease-out"
        style={{ left: "calc(var(--gap) - 8px)", top: "-14px" }}
      >
        ]
      </span>
    </div>
  );
}
